/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  // ── MVP scope: portfolio + gallery only ──────────────────────────────────
  // Links, Delivery, Domain and the all-templates browser are built but hidden
  // for the MVP. The code stays in the repo; these redirects disable the routes.
  // To re-enable a feature, remove its entry here and restore it in the sidebar.
  async redirects() {
    return [
      { source: "/dashboard/links",        destination: "/dashboard/portfolio", permanent: false },
      { source: "/dashboard/links/:path*", destination: "/dashboard/portfolio", permanent: false },
      { source: "/dashboard/delivery",        destination: "/dashboard/portfolio", permanent: false },
      { source: "/dashboard/delivery/:path*", destination: "/dashboard/portfolio", permanent: false },
      { source: "/dashboard/domain",    destination: "/dashboard/portfolio", permanent: false },
      { source: "/dashboard/templates", destination: "/dashboard/portfolio", permanent: false },
    ];
  },
};

export default config;
