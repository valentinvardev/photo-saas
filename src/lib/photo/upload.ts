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

/**
 * Generate an optimized WebP preview in-browser (resized + re-encoded).
 * Returns null if the browser can't decode the image (e.g. some RAW/HEIC).
 */
async function makeWebpPreview(file: File, maxDim = 1600, quality = 0.82): Promise<Blob | null> {
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
    const w = Math.max(1, Math.round(bitmap.width * scale));
    const h = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) { bitmap.close(); return null; }
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close();
    return await new Promise((resolve) => canvas.toBlob((b) => resolve(b), "image/webp", quality));
  } catch {
    return null;
  }
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
        const { uploadUrl, key, photoId, previewUploadUrl } = await createUpload.mutateAsync({
          filename: file.name,
          mimeType: file.type,
          size:     file.size,
        });

        // 1) Direct browser → S3 PUT of the original.
        const put = await fetch(uploadUrl, {
          method:  "PUT",
          headers: { "Content-Type": file.type },
          body:    file,
        });
        if (!put.ok) throw new Error(`Upload failed (HTTP ${put.status})`);

        // 2) Generate + upload a WebP preview (best-effort; original still works without it).
        let hasPreview = false;
        try {
          const previewBlob = await makeWebpPreview(file);
          if (previewBlob) {
            const pr = await fetch(previewUploadUrl, {
              method:  "PUT",
              headers: { "Content-Type": "image/webp" },
              body:    previewBlob,
            });
            hasPreview = pr.ok;
          }
        } catch { hasPreview = false; }

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
          hasPreview,
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
