"use client";

import { useEffect, useRef } from "react";
import { api } from "~/trpc/react";
import { usePortfolioContentStore } from "./store";
import { type PortfolioContent } from "./data";

/** Narrow an unknown JSON blob to a PortfolioContent tree. */
function isContent(c: unknown): c is PortfolioContent {
  if (!c || typeof c !== "object") return false;
  const v = c as Partial<PortfolioContent>;
  return (
    Array.isArray(v.categoryIds) &&
    typeof v.categories === "object" &&
    typeof v.folders === "object" &&
    typeof v.photos === "object"
  );
}

/**
 * Two-way bridge between the local portfolio content store and the DB.
 *  - On first load, the server's `content` tree (if any) hydrates the store —
 *    the server is canonical, the localStorage persist layer is just a cache.
 *  - Afterwards, any change to this portfolio's tree is saved back to the DB,
 *    debounced 800ms.
 *
 * Returns { saving } so the editor can show a save indicator.
 */
export function usePortfolioContentSync(portfolioId: string) {
  const { data } = api.portfolio.get.useQuery({ id: portfolioId });
  const setContent = usePortfolioContentStore((s) => s.setContent);
  const content    = usePortfolioContentStore((s) => s.byPortfolio[portfolioId]);
  const updateMut  = api.portfolio.update.useMutation();
  const save       = updateMut.mutate;

  const hydrated  = useRef(false);
  const lastSaved = useRef<string | null>(null);

  // Hydrate the store once, when the server response first arrives.
  useEffect(() => {
    if (!data || hydrated.current) return;
    hydrated.current = true;
    if (isContent(data.content)) {
      lastSaved.current = JSON.stringify(data.content);
      setContent(portfolioId, data.content);
    } else {
      // No server tree yet — keep the local tree and remember it so we don't
      // immediately write back an unchanged value.
      lastSaved.current = content ? JSON.stringify(content) : null;
    }
  }, [data, portfolioId, setContent, content]);

  // Debounced autosave on every post-hydration change to this portfolio's tree.
  useEffect(() => {
    if (!hydrated.current || !content) return;
    const json = JSON.stringify(content);
    if (json === lastSaved.current) return;
    const t = setTimeout(() => {
      save({ id: portfolioId, content });
      lastSaved.current = json;
    }, 800);
    return () => clearTimeout(t);
  }, [content, portfolioId, save]);

  return { saving: updateMut.isPending };
}
