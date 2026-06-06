/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  // ── MVP scope: portfolio + gallery only ──────────────────────────────────
  // Domain and the all-templates browser are built but hidden for the MVP. The
  // code stays in the repo; these redirects disable the routes. Link builder and
  // Client delivery render a "coming soon" page (see /dashboard/links and
  // /dashboard/delivery) so they keep their sidebar entries.
  // To re-enable a feature, remove its entry here and restore it in the sidebar.
  async redirects() {
    return [
      { source: "/dashboard/domain",    destination: "/dashboard/portfolio", permanent: false },
      { source: "/dashboard/templates", destination: "/dashboard/portfolio", permanent: false },
      // Link builder / Client delivery: the base route renders a "coming soon"
      // page (kept), but their half-built sub-routes (:path+ = 1+ segments) stay
      // disabled so no mock screens leak.
      { source: "/dashboard/links/:path+",    destination: "/dashboard/links",    permanent: false },
      { source: "/dashboard/delivery/:path+", destination: "/dashboard/delivery", permanent: false },
    ];
  },
};

export default config;
