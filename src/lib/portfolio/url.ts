/** Production domain. Public portfolios are served path-based at /p/{slug}. */
export const PROD_DOMAIN = "portapic.com";

/**
 * Working public URL for a portfolio. Uses the current origin so test links
 * always point at the live deployment (Vercel preview/prod or localhost) and
 * actually work; falls back to the prod domain during SSR.
 */
export function portfolioPublicUrl(slug: string): string {
  const origin = typeof window !== "undefined" ? window.location.origin : `https://${PROD_DOMAIN}`;
  return `${origin}/p/${slug}`;
}

/** Pretty label (no protocol) for display next to a copy button. */
export function portfolioPublicLabel(slug: string): string {
  return portfolioPublicUrl(slug).replace(/^https?:\/\//, "");
}
