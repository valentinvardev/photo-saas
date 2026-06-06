import type { Metadata } from "next";
import { db } from "~/server/db";
import { PublicPortfolioClient } from "./PublicPortfolioClient";

/** Server-rendered SEO for the public portfolio (title/description/OG). */
export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username: slug } = await params;
  const p = await db.portfolio.findFirst({
    where: { slug, status: "published" },
    select: { title: true, seoTitle: true, seoDescription: true, ogImageUrl: true, user: { select: { name: true } } },
  });
  if (!p) return { title: "Portfolio not found · Portapic" };

  const title = p.seoTitle?.trim() || p.title;
  const description = p.seoDescription?.trim() || (p.user?.name ? `Photography portfolio by ${p.user.name}` : "Photography portfolio");
  const images = p.ogImageUrl ? [{ url: p.ogImageUrl }] : undefined;

  return {
    title,
    description,
    openGraph: { title, description, type: "website", images },
    twitter: { card: p.ogImageUrl ? "summary_large_image" : "summary", title, description, images: p.ogImageUrl ? [p.ogImageUrl] : undefined },
  };
}

export default async function Page({ params }: { params: Promise<{ username: string }> }) {
  const { username: slug } = await params;
  return <PublicPortfolioClient slug={slug} />;
}
