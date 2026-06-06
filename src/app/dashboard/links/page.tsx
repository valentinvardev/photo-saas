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
    <ComingSoon
      icon={<LinksIcon />}
      title="Link builder"
      tagline="A single link-in-bio page that ties everything together — your portfolio, galleries, socials and contact, all on one branded page for Instagram and TikTok."
      features={[
        { title: "One link for everything", desc: "Point your bio at one page that links to your portfolio, galleries and shop." },
        { title: "Social & contact buttons", desc: "Instagram, WhatsApp, email and more, with the icons your clients expect." },
        { title: "Drag-and-drop ordering", desc: "Arrange your links and dividers exactly how you want them, no code." },
        { title: "Themes that match you", desc: "Pick a style that matches your brand and stays consistent with your portfolio." },
      ]}
    />
  );
}
