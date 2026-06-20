import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

/** A merged "recent activity" feed from uploads, portfolios and inbox messages. */
export const activityRouter = createTRPCRouter({
  recent: protectedProcedure.query(async ({ ctx }) => {
    const [photos, portfolios, messages] = await Promise.all([
      ctx.db.photo.findMany({ where: { userId: ctx.userId }, orderBy: { createdAt: "desc" }, take: 5, select: { filename: true, createdAt: true } }),
      ctx.db.portfolio.findMany({ where: { userId: ctx.userId }, orderBy: { updatedAt: "desc" }, take: 5, select: { title: true, status: true, updatedAt: true } }),
      ctx.db.contactMessage.findMany({ where: { userId: ctx.userId }, orderBy: { createdAt: "desc" }, take: 5, select: { name: true, createdAt: true } }),
    ]);

    const items = [
      ...photos.map((p) => ({ kind: "photo" as const, label: p.filename, at: p.createdAt.toISOString() })),
      ...portfolios.map((p) => ({ kind: (p.status === "published" ? "portfolioPublished" : "portfolioUpdated") as "portfolioPublished" | "portfolioUpdated", label: p.title, at: p.updatedAt.toISOString() })),
      ...messages.map((m) => ({ kind: "message" as const, label: m.name, at: m.createdAt.toISOString() })),
    ];
    items.sort((a, b) => (a.at < b.at ? 1 : -1));
    return items.slice(0, 6);
  }),
});
