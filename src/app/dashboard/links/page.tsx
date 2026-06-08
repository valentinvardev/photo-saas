import { ComingSoon } from "~/components/dashboard/ComingSoon";

export const metadata = { title: "Link builder — Portapic" };

function LinksIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4"  width="18" height="4" rx="2" />
      <rect x="3" y="10" width="18" height="4" rx="2" />
      <rect x="3" y="16" width="18" height="4" rx="2" />
    </svg>
  );
}

export default function LinksComingSoonPage() {
  return (
    <ComingSoon icon={<LinksIcon />} ns="links" />
  );
}
