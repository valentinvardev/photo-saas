"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { createClient } from "~/lib/supabase/client";

/** Read an image file's natural pixel dimensions (best-effort). */
function readImageSize(file: File): Promise<{ w: number; h: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve({ w: img.naturalWidth, h: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };
    img.src = url;
  });
}

export type UploadedPhoto = {
  id: string;
  url: string;
  filename: string;
};

/**
 * Upload pipeline for the photo library:
 *   1. createUpload → presigned Storage URL + token (tRPC, server-side)
 *   2. uploadToSignedUrl → direct browser → Supabase Storage
 *   3. confirm → create the Photo row (tRPC)
 *
 * Returns an `upload(files)` that resolves to the created photo rows, plus
 * progress state for the UI.
 */
export function useUploadPhotos() {
  const createUpload = api.photo.createUpload.useMutation();
  const confirm      = api.photo.confirm.useMutation();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress]   = useState<{ done: number; total: number }>({ done: 0, total: 0 });
  const [error, setError]         = useState<string | null>(null);

  async function upload(files: File[]): Promise<UploadedPhoto[]> {
    const images = files.filter((f) => f.type.startsWith("image/"));
    if (images.length === 0) return [];

    const supabase = createClient();
    const created: UploadedPhoto[] = [];
    setError(null);
    setUploading(true);
    setProgress({ done: 0, total: images.length });

    try {
      for (const file of images) {
        const { token, path } = await createUpload.mutateAsync({
          filename: file.name,
          mimeType: file.type,
          size:     file.size,
        });

        const { error: upErr } = await supabase.storage
          .from("photos")
          .uploadToSignedUrl(path, token, file, { contentType: file.type });
        if (upErr) throw new Error(upErr.message);

        const dims = await readImageSize(file).catch(() => undefined);
        const photo = await confirm.mutateAsync({
          path,
          filename: file.name,
          mimeType: file.type,
          size:     file.size,
          width:    dims?.w,
          height:   dims?.h,
        });

        created.push({ id: photo.id, url: photo.url, filename: photo.filename });
        setProgress((p) => ({ ...p, done: p.done + 1 }));
      }
      return created;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
      throw e;
    } finally {
      setUploading(false);
    }
  }

  return { upload, uploading, progress, error };
}
