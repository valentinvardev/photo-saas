import "server-only";

import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectsCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { env } from "~/env";

const region = env.AWS_REGION;
const bucket = env.AWS_S3_BUCKET;
const prefix = env.AWS_S3_PREFIX; // e.g. "fotografo"

if (!bucket) {
  console.warn("[s3] AWS_S3_BUCKET not configured — uploads will fail.");
}

export const s3 = new S3Client({
  region,
  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",
  useAccelerateEndpoint: env.AWS_S3_ACCELERATE,
  ...(env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY
    ? {
        credentials: {
          accessKeyId: env.AWS_ACCESS_KEY_ID,
          secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
        },
      }
    : {}),
});

/* ----------------------------------------------------------------------------
 * Key layout (shared bucket, namespaced by prefix):
 *   {prefix}/users/{userId}/photos/{photoId}.{ext}
 * Previews (WebP) land beside the original when that pipeline is added:
 *   {prefix}/users/{userId}/photos/{photoId}-preview.webp
 * -------------------------------------------------------------------------- */

export function photoKey(userId: string, photoId: string, ext: string) {
  return `${prefix}/users/${userId}/photos/${photoId}.${ext.replace(/^\./, "")}`;
}

export function photoPreviewKey(userId: string, photoId: string) {
  return `${prefix}/users/${userId}/photos/${photoId}-preview.webp`;
}

/** True if a key lives under our prefix. */
export function isOwnedKey(key: string): boolean {
  return key.startsWith(`${prefix}/`);
}

/* ----------------------------------------------------------------------------
 * URL resolution
 * -------------------------------------------------------------------------- */

/** Stable CloudFront URL for a key, or null if CF is not configured. */
export function getCFUrl(key: string): string | null {
  return env.CLOUDFRONT_DOMAIN ? `https://${env.CLOUDFRONT_DOMAIN}/${key}` : null;
}

/**
 * Resolve a key to a display URL. Prefers CloudFront (stable, edge-cached, no
 * signing); falls back to a presigned GET in dev when CF isn't set.
 */
export async function resolveMediaUrl(key: string, opts: { expiresIn?: number } = {}): Promise<string> {
  return getCFUrl(key) ?? getPresignedDownloadUrl(key, opts);
}

/* ----------------------------------------------------------------------------
 * Presigned URLs (direct browser ↔ S3, never through our server)
 * -------------------------------------------------------------------------- */

export async function getPresignedUploadUrl(opts: {
  key: string;
  contentType: string;
  contentLength?: number;
  expiresIn?: number;
}): Promise<{ url: string; key: string }> {
  if (!bucket) throw new Error("AWS_S3_BUCKET is not configured");
  const cmd = new PutObjectCommand({
    Bucket: bucket,
    Key: opts.key,
    ContentType: opts.contentType,
    ...(opts.contentLength !== undefined ? { ContentLength: opts.contentLength } : {}),
  });
  const url = await getSignedUrl(s3, cmd, { expiresIn: opts.expiresIn ?? 60 * 15 });
  return { url, key: opts.key };
}

export async function getPresignedDownloadUrl(
  key: string,
  opts: { expiresIn?: number; filename?: string } = {},
): Promise<string> {
  if (!bucket) throw new Error("AWS_S3_BUCKET is not configured");
  const cmd = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
    ...(opts.filename ? { ResponseContentDisposition: `attachment; filename="${opts.filename}"` } : {}),
  });
  return getSignedUrl(s3, cmd, { expiresIn: opts.expiresIn ?? 60 * 60 });
}

/* ----------------------------------------------------------------------------
 * Server-side IO
 * -------------------------------------------------------------------------- */

export async function getS3ObjectBytes(key: string): Promise<Uint8Array> {
  if (!bucket) throw new Error("AWS_S3_BUCKET is not configured");
  const res = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
  const chunks: Uint8Array[] = [];
  for await (const chunk of res.Body as AsyncIterable<Uint8Array>) chunks.push(chunk);
  return Buffer.concat(chunks);
}

export async function putS3Object(key: string, body: Buffer | Uint8Array, contentType: string): Promise<void> {
  if (!bucket) throw new Error("AWS_S3_BUCKET is not configured");
  await s3.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: contentType }));
}

export async function deleteS3Objects(keys: string[]): Promise<void> {
  if (!bucket || keys.length === 0) return;
  await s3.send(
    new DeleteObjectsCommand({
      Bucket: bucket,
      Delete: { Objects: keys.map((k) => ({ Key: k })) },
    }),
  );
}

export async function getObjectSize(key: string): Promise<number | null> {
  if (!bucket) return null;
  try {
    const res = await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    return res.ContentLength ?? null;
  } catch {
    return null;
  }
}
