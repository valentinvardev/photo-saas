"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

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

  async function upload(files: File[], opts?: { folderId?: string | null }): Promise<UploadedPhoto[]> {
    const images = files.filter((f) => f.type.startsWith("image/"));
    if (images.length === 0) return [];

    const created: UploadedPhoto[] = [];
    setError(null);
    setUploading(true);
    setProgress({ done: 0, total: images.length });

    try {
      for (const file of images) {
        const { uploadUrl, key, photoId } = await createUpload.mutateAsync({
          filename: file.name,
          mimeType: file.type,
          size:     file.size,
        });

        // Direct browser → S3 PUT. Content-Type must match what was signed.
        const put = await fetch(uploadUrl, {
          method:  "PUT",
          headers: { "Content-Type": file.type },
          body:    file,
        });
        if (!put.ok) throw new Error(`Upload failed (HTTP ${put.status})`);

        const dims = await readImageSize(file).catch(() => undefined);
        const photo = await confirm.mutateAsync({
          photoId,
          key,
          filename: file.name,
          mimeType: file.type,
          size:     file.size,
          width:    dims?.w,
          height:   dims?.h,
          folderId: opts?.folderId ?? null,
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
