import { LandingV2 } from "~/components/landing/v2/LandingV2";

/**
 * Homepage — the simplified selling landing (v2). CTA routes to /register;
 * copy localizes to es/en/pt by the visitor's country. The previous full
 * landing is archived at /home-v1.
 */
export default function LandingPage() {
  return <LandingV2 />;
}
