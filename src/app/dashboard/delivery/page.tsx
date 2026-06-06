import { ComingSoon } from "~/components/dashboard/ComingSoon";

export const metadata = { title: "Client delivery — Portapic" };

function DeliveryIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z" />
    </svg>
  );
}

export default function DeliveryComingSoonPage() {
  return (
    <ComingSoon
      icon={<DeliveryIcon />}
      title="Client delivery"
      tagline="Hand finished galleries to your clients on private, branded download pages — no more WeTransfer links or zip files buried in email."
      features={[
        { title: "Private client galleries", desc: "Each client gets their own password-protected page to view and download their photos." },
        { title: "High-res downloads", desc: "Deliver full-resolution originals and web-ready exports, one by one or as a zip." },
        { title: "Favorites & selection", desc: "Let clients star their picks so you know exactly which shots to retouch." },
        { title: "Branded, expiring links", desc: "Your logo, your colors, and optional expiry dates on every delivery." },
      ]}
    />
  );
}
