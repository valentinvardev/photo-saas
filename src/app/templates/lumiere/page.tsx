"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useT } from "~/components/providers/LangProvider";

/* ═══════════════════════════════════════════════════════════════
   Petal — Playful pastel portfolio template · FRAME platform
   ───────────────────────────────────────────────────────────────
   FRAME Standard Palette
   bg #f0ebe3 · surface #e8e2da · ink #18181b · mid #6b6560
   coral #fdd5cf · mint #caf0e0 · periwi #d8d4f8
   peach #fde8c8 · lemon #f5f4ba
═══════════════════════════════════════════════════════════════ */

const C = {
  bg:       "#f0ebe3",
  surface:  "#e8e2da",
  ink:      "#18181b",
  mid:      "#6b6560",
  muted:    "#a09890",
  coral:    "#fdd5cf",
  coralDk:  "#d9544a",
  mint:     "#caf0e0",
  mintDk:   "#259a6f",
  periwi:   "#d8d4f8",
  periwiDk: "#5c52c8",
  peach:    "#fde8c8",
  lemon:    "#f5f4ba",
  dim:      "rgba(24,24,27,0.08)",
  dimMed:   "rgba(24,24,27,0.15)",
} as const;

const SANS = "var(--tpl-sans), 'DM Sans', system-ui, sans-serif";
const MONO = "var(--tpl-mono), 'Space Mono', ui-monospace, monospace";

/* ── i18n demo strings ─────────────────────────────────────────── */

const DEMO_EN = {
  /* Nav */
  navItems:          ["Work", "About", "Shop"] as string[],
  letsTalk:          "Let's talk",
  /* Hero */
  heroBadge:         "Photographer · Berlin",
  heroH1a:           "Making light",
  heroH1work:        "work",
  heroH1b:           "for you.",
  heroBio:           "I'm Mia — a photographer obsessed with natural light, genuine moments, and the kind of images you actually want to keep forever.",
  seeMyWork:         "See my work",
  downloadKit:       "Download press kit",
  heroLocation:      "Berlin, 2024",
  statsYears:        "Years",
  statsProjects:     "Projects",
  statsCountries:    "Countries",
  /* Works */
  selectedProjects:  "Selected projects",
  recentWork:        "Recent work",
  allProjects:       "All projects →",
  viewProject:       "View project",
  /* Works data */
  works: [
    { title: "Golden Hour",     year: "2024", cat: "Portrait",    desc: "Sun-drenched portraits for a debut album campaign." },
    { title: "Still Waters",    year: "2024", cat: "Landscape",   desc: "Six weeks chasing coastlines at low tide." },
    { title: "Bloom",           year: "2023", cat: "Editorial",   desc: "Fashion in an overgrown greenhouse." },
    { title: "Saturday Market", year: "2023", cat: "Documentary", desc: "A year spent at the same market stall." },
    { title: "Small Hours",     year: "2022", cat: "Portrait",    desc: "Night portraits in neon-lit city corners." },
    { title: "Overgrown",       year: "2022", cat: "Landscape",   desc: "Abandoned spaces swallowed by plants." },
  ],
  /* Gallery */
  theArchive:        "The archive",
  allShots:          "All shots",
  photographs:       "photographs",
  openPhoto:         "↗ Open",
  /* About */
  heyIm:             "Hey, I'm Mia!",
  aboutH2a:          "I shoot what",
  aboutH2highlight:  "feels real.",
  aboutBio1:         "Based in Berlin, I've been making pictures for eleven years. Drawn to in-between moments — the laugh before the pose, the glance before the ceremony, the quiet after the gig.",
  aboutBio2:         "I work with musicians, brands, couples, and anyone who wants images that don't feel like stock photos.",
  pills: [
    { label: "11 years shooting", bg: C.coral },
    { label: "6 countries",       bg: C.lemon },
    { label: "2 dogs",            bg: C.peach },
    { label: "∞ cups of tea",     bg: C.periwi },
  ],
  happyClients:      "happy clients",
  myFullStory:       "My full story →",
  /* Contact */
  sayHello:          "Say hello",
  contactH2:         "Got a project in mind?",
  contactSub:        "Whether it's a wedding, a campaign, or just an idea on a napkin — let's figure it out together.",
  sendMessage:       "Send me a message",
  bookCall:          "Book a call",
  /* Footer */
  footerCopy:        "© 2024 · Made with love in Berlin",
  footerLinks:       ["Privacy", "Terms", "Colophon"] as string[],
  /* Lightbox */
  lbClose:           "Close",
  lbReset:           "Reset",
};

const DEMO_ES = {
  /* Nav */
  navItems:          ["Trabajo", "Sobre mí", "Tienda"] as string[],
  letsTalk:          "Hablemos",
  /* Hero */
  heroBadge:         "Fotógrafa · Berlín",
  heroH1a:           "Haciendo que la luz",
  heroH1work:        "trabaje",
  heroH1b:           "para ti.",
  heroBio:           "Soy Mia — una fotógrafa obsesionada con la luz natural, los momentos auténticos y el tipo de imágenes que realmente quieres conservar para siempre.",
  seeMyWork:         "Ver mi trabajo",
  downloadKit:       "Descargar press kit",
  heroLocation:      "Berlín, 2024",
  statsYears:        "Años",
  statsProjects:     "Proyectos",
  statsCountries:    "Países",
  /* Works */
  selectedProjects:  "Proyectos seleccionados",
  recentWork:        "Trabajo reciente",
  allProjects:       "Todos los proyectos →",
  viewProject:       "Ver proyecto",
  /* Works data */
  works: [
    { title: "Golden Hour",     year: "2024", cat: "Retrato",      desc: "Retratos bañados de sol para una campaña de debut discográfico." },
    { title: "Still Waters",    year: "2024", cat: "Paisaje",       desc: "Seis semanas persiguiendo costas en marea baja." },
    { title: "Bloom",           year: "2023", cat: "Editorial",     desc: "Moda en un invernadero salvaje." },
    { title: "Saturday Market", year: "2023", cat: "Documental",    desc: "Un año en el mismo puesto de mercado." },
    { title: "Small Hours",     year: "2022", cat: "Retrato",       desc: "Retratos nocturnos en esquinas de ciudad iluminadas de neón." },
    { title: "Overgrown",       year: "2022", cat: "Paisaje",       desc: "Espacios abandonados engullidos por las plantas." },
  ],
  /* Gallery */
  theArchive:        "El archivo",
  allShots:          "Todas las tomas",
  photographs:       "fotografías",
  openPhoto:         "↗ Abrir",
  /* About */
  heyIm:             "¡Hola, soy Mia!",
  aboutH2a:          "Fotografío lo que",
  aboutH2highlight:  "se siente real.",
  aboutBio1:         "Con base en Berlín, llevo once años haciendo fotos. Me atraen los momentos intermedios — la risa antes de la pose, la mirada antes de la ceremonia, el silencio después del concierto.",
  aboutBio2:         "Trabajo con músicos, marcas, parejas y cualquiera que quiera imágenes que no parezcan fotos de banco.",
  pills: [
    { label: "11 años fotografiando", bg: C.coral },
    { label: "6 países",              bg: C.lemon },
    { label: "2 perros",              bg: C.peach },
    { label: "∞ tazas de té",         bg: C.periwi },
  ],
  happyClients:      "clientes felices",
  myFullStory:       "Mi historia completa →",
  /* Contact */
  sayHello:          "Di hola",
  contactH2:         "¿Tienes un proyecto en mente?",
  contactSub:        "Ya sea una boda, una campaña o solo una idea en una servilleta — vamos a resolverlo juntos.",
  sendMessage:       "Envíame un mensaje",
  bookCall:          "Reservar una llamada",
  /* Footer */
  footerCopy:        "© 2024 · Hecho con amor en Berlín",
  footerLinks:       ["Privacidad", "Términos", "Colofón"] as string[],
  /* Lightbox */
  lbClose:           "Cerrar",
  lbReset:           "Restablecer",
};

function demo(locale: string) {
  return locale === "es" ? DEMO_ES : DEMO_EN;
}

type DemoStrings = ReturnType<typeof demo>;

/* ── Data ───────────────────────────────────────────────────── */

const WORK_SEEDS = [452, 338, 866, 730, 575, 190];
const WORK_BGS   = [C.coral, C.mint, C.periwi, C.peach, C.lemon, C.mint] as const;
const WORK_TAGS  = [C.coralDk, C.mintDk, C.periwiDk, "#c2710a", "#8a8000", C.mintDk] as const;

const BENTO_SPANS = [4, 2, 2, 4, 3, 3];
const BENTO_IMG_H = [280, 200, 200, 280, 240, 240];

const GALLERY: { seed: number; w: number; h: number }[] = [
  { seed: 20,  w: 800, h: 533 },
  { seed: 37,  w: 533, h: 800 },
  { seed: 48,  w: 600, h: 600 },
  { seed: 63,  w: 533, h: 800 },
  { seed: 71,  w: 800, h: 533 },
  { seed: 82,  w: 533, h: 760 },
  { seed: 95,  w: 800, h: 600 },
  { seed: 108, w: 600, h: 600 },
  { seed: 133, w: 533, h: 800 },
  { seed: 145, w: 800, h: 533 },
  { seed: 156, w: 533, h: 800 },
  { seed: 167, w: 700, h: 500 },
  { seed: 178, w: 533, h: 800 },
  { seed: 189, w: 800, h: 533 },
  { seed: 200, w: 600, h: 800 },
];

/* ── Scroll-reveal hook ─────────────────────────────────────── */

function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry?.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function revealStyle(visible: boolean, delay = 0): React.CSSProperties {
  return {
    opacity:    visible ? 1 : 0,
    transform:  visible ? "translateY(0)" : "translateY(28px)",
    transition: `opacity 0.7s ${delay}ms cubic-bezier(0.2,0.8,0.2,1), transform 0.7s ${delay}ms cubic-bezier(0.2,0.8,0.2,1)`,
  };
}

/* ── Page ───────────────────────────────────────────────────── */

export default function PetalPage() {
  const { locale } = useT();
  const D = demo(locale);

  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [scrolled,    setScrolled]    = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <main style={{ fontFamily: SANS, background: C.bg, color: C.ink, overflowX: "hidden" }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: ${C.coral}; }
        img { display: block; }
        a   { text-decoration: none; }
      `}</style>

      <PetalNav scrolled={scrolled} D={D} />
      <HeroSection D={D} />
      <WorksSection D={D} />
      <GallerySection onOpen={setLightboxIdx} D={D} />
      <AboutSection D={D} />
      <ContactSection D={D} />
      <FooterBar D={D} />

      {lightboxIdx !== null && (
        <PetalLightbox photos={GALLERY} startIndex={lightboxIdx} onClose={() => setLightboxIdx(null)} D={D} />
      )}
    </main>
  );
}

/* ── Nav ────────────────────────────────────────────────────── */

function PetalNav({ scrolled, D }: { scrolled: boolean; D: DemoStrings }) {
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 clamp(20px, 5vw, 64px)", height: 60,
      background: scrolled ? "rgba(240,235,227,0.88)" : "transparent",
      backdropFilter: scrolled ? "blur(16px)" : "none",
      borderBottom: scrolled ? `1px solid ${C.dim}` : "1px solid transparent",
      transition: "background 0.4s, border-color 0.4s",
    }}>
      <span style={{ fontFamily: SANS, fontSize: 17, fontWeight: 800, letterSpacing: "-0.03em" }}>
        mia.<span style={{ color: C.coralDk }}>photo</span>
      </span>

      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        {D.navItems.map((item) => (
          <a key={item} href="#" style={{
            fontFamily: SANS, fontSize: 13, fontWeight: 500, color: C.mid,
            padding: "7px 16px", borderRadius: 100,
            transition: "background 0.18s, color 0.18s",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = C.dim; e.currentTarget.style.color = C.ink; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.mid; }}
          >{item}</a>
        ))}
        <a href="#" style={{
          fontFamily: SANS, fontSize: 13, fontWeight: 700, color: "#fff",
          background: C.ink, padding: "9px 22px", borderRadius: 100, marginLeft: 8,
          transition: "background 0.2s, transform 0.2s", display: "inline-block",
        }}
          onMouseEnter={(e) => { e.currentTarget.style.background = C.coralDk; e.currentTarget.style.transform = "scale(1.05)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = C.ink; e.currentTarget.style.transform = "scale(1)"; }}
        >{D.letsTalk}</a>
      </div>
    </nav>
  );
}

/* ── Hero ───────────────────────────────────────────────────── */

function HeroSection({ D }: { D: DemoStrings }) {
  return (
    <section style={{
      minHeight: "100svh", paddingTop: 60,
      display: "grid", gridTemplateColumns: "55fr 45fr",
    }}>
      {/* Left — text */}
      <div style={{
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "64px clamp(24px, 5vw, 72px) 64px clamp(24px, 5vw, 72px)",
        gap: 28,
      }}>
        <span style={{
          fontFamily: MONO, fontSize: 12, letterSpacing: "0.26em",
          textTransform: "uppercase", color: C.coralDk,
          background: C.coral, padding: "6px 16px",
          borderRadius: 100, alignSelf: "flex-start",
          animation: "fadeUp 0.6s 0.1s both cubic-bezier(0.2,0.8,0.2,1)",
        }}>
          {D.heroBadge}
        </span>

        <h1 style={{
          fontFamily: SANS, fontWeight: 800,
          fontSize: "clamp(44px, 7.5vw, 108px)",
          lineHeight: 0.95, letterSpacing: "-0.04em",
          maxWidth: "13ch",
          animation: "fadeUp 0.7s 0.22s both cubic-bezier(0.2,0.8,0.2,1)",
        }}>
          {D.heroH1a}{" "}
          <span style={{
            display: "inline-block", background: C.coral,
            borderRadius: 14, padding: "2px 18px",
            transform: "rotate(-1.8deg)",
            whiteSpace: "nowrap",
          }}>{D.heroH1work}</span>{" "}
          {D.heroH1b}
        </h1>

        <p style={{
          fontFamily: SANS, fontSize: 16, fontWeight: 400,
          lineHeight: 1.7, color: C.mid, maxWidth: 440,
          animation: "fadeUp 0.7s 0.38s both cubic-bezier(0.2,0.8,0.2,1)",
        }}>
          {D.heroBio}
        </p>

        <div style={{
          display: "flex", gap: 12, flexWrap: "wrap",
          animation: "fadeUp 0.7s 0.52s both cubic-bezier(0.2,0.8,0.2,1)",
        }}>
          <a href="#" style={{
            fontFamily: SANS, fontSize: 14, fontWeight: 700,
            color: "#fff", background: C.ink,
            padding: "14px 30px", borderRadius: 100,
            display: "flex", alignItems: "center", gap: 8,
            transition: "background 0.22s, transform 0.22s",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = C.coralDk; e.currentTarget.style.transform = "translateY(-3px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = C.ink; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            {D.seeMyWork}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
          <a href="#" style={{
            fontFamily: SANS, fontSize: 14, fontWeight: 600,
            color: C.ink, padding: "14px 30px", borderRadius: 100,
            border: `2px solid ${C.dimMed}`,
            transition: "border-color 0.2s",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.ink; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.dimMed; }}
          >{D.downloadKit}</a>
        </div>

        {/* Stats row */}
        <div style={{
          display: "flex", gap: 36, paddingTop: 20,
          borderTop: `1px solid ${C.dimMed}`,
          animation: "fadeUp 0.7s 0.64s both cubic-bezier(0.2,0.8,0.2,1)",
        }}>
          {[{ v: "11", l: D.statsYears }, { v: "340+", l: D.statsProjects }, { v: "6", l: D.statsCountries }].map((s) => (
            <div key={s.l}>
              <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em" }}>{s.v}</div>
              <div style={{ fontFamily: MONO, fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: C.muted, marginTop: 3 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — portrait image */}
      <div style={{
        padding: "24px 24px 24px 0",
        animation: "fadeUp 0.9s 0.3s both cubic-bezier(0.2,0.8,0.2,1)",
      }}>
        <div style={{
          borderRadius: 28, overflow: "hidden",
          height: "100%", minHeight: 480,
          background: C.coral,
          position: "relative",
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://picsum.photos/seed/452/800/1100"
            alt="Hero portrait"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div style={{
            position: "absolute", bottom: 20, left: 20,
            background: "rgba(240,235,227,0.85)", backdropFilter: "blur(10px)",
            borderRadius: 14, padding: "10px 16px",
            fontFamily: MONO, fontSize: 13, letterSpacing: "0.22em",
            textTransform: "uppercase", color: C.mid,
          }}>
            {D.heroLocation}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Works — Bento grid ─────────────────────────────────────── */

function WorksSection({ D }: { D: DemoStrings }) {
  const { ref, visible } = useReveal();

  const works = D.works.map((w, i) => ({
    ...w,
    seed: WORK_SEEDS[i]!,
    bg:   WORK_BGS[i]!,
    tag:  WORK_TAGS[i]!,
  }));

  return (
    <section style={{ padding: "100px clamp(20px, 5vw, 64px)" }}>
      {/* Header */}
      <div ref={ref} style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 40, ...revealStyle(visible) }}>
        <div>
          <p style={{ fontFamily: MONO, fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", color: C.mid, marginBottom: 10 }}>{D.selectedProjects}</p>
          <h2 style={{ fontFamily: SANS, fontWeight: 800, fontSize: "clamp(28px, 4vw, 48px)", letterSpacing: "-0.03em" }}>{D.recentWork}</h2>
        </div>
        <a href="#" style={{
          fontFamily: SANS, fontSize: 13, fontWeight: 600, color: C.ink,
          padding: "10px 22px", borderRadius: 100, border: `2px solid ${C.dimMed}`,
          whiteSpace: "nowrap", transition: "border-color 0.2s",
        }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.ink; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.dimMed; }}
        >{D.allProjects}</a>
      </div>

      {/* Bento */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 16 }}>
        {works.map((work, i) => (
          <BentoCard key={work.seed} work={work} span={BENTO_SPANS[i]!} imgH={BENTO_IMG_H[i]!} delay={i * 80} viewProjectLabel={D.viewProject} />
        ))}
      </div>
    </section>
  );
}

function BentoCard({ work, span, imgH, delay, viewProjectLabel }: {
  work: { seed: number; title: string; year: string; cat: string; desc: string; bg: string; tag: string };
  span: number; imgH: number; delay: number; viewProjectLabel: string;
}) {
  const [hovered, setHovered] = useState(false);
  const { ref, visible } = useReveal();

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        gridColumn: `span ${span}`,
        borderRadius: 24, overflow: "hidden",
        background: work.bg, cursor: "pointer",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered ? "0 24px 56px rgba(0,0,0,0.13)" : "0 2px 8px rgba(0,0,0,0.04)",
        transition: "transform 0.32s cubic-bezier(0.2,0.8,0.2,1), box-shadow 0.32s ease",
        ...revealStyle(visible, delay),
      }}
    >
      {/* Image */}
      <div style={{ height: imgH, overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://picsum.photos/seed/${work.seed}/640/480`}
          alt={work.title}
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            transform: hovered ? "scale(1.06)" : "scale(1)",
            transition: "transform 650ms cubic-bezier(0.2,0.8,0.2,1)",
          }}
        />
      </div>

      {/* Info */}
      <div style={{ padding: "18px 20px 22px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{
            fontFamily: MONO, fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase",
            color: work.tag, background: "rgba(255,255,255,0.5)",
            padding: "4px 10px", borderRadius: 100,
          }}>{work.cat}</span>
          <span style={{ fontFamily: MONO, fontSize: 12, color: C.mid }}>{work.year}</span>
        </div>
        <h3 style={{
          fontFamily: SANS, fontWeight: 700, fontSize: span >= 4 ? 22 : 17,
          letterSpacing: "-0.02em", marginBottom: 6,
        }}>{work.title}</h3>
        <p style={{ fontFamily: SANS, fontSize: 13, color: C.mid, lineHeight: 1.55, marginBottom: 14 }}>{work.desc}</p>
        <span style={{
          fontFamily: SANS, fontSize: 12, fontWeight: 700,
          display: "flex", alignItems: "center", gap: 4,
          opacity: hovered ? 1 : 0.35, transition: "opacity 0.25s",
        }}>
          {viewProjectLabel}
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </span>
      </div>
    </div>
  );
}

/* ── Gallery — CSS columns masonry ─────────────────────────── */

function GallerySection({ onOpen, D }: { onOpen: (i: number) => void; D: DemoStrings }) {
  const { ref, visible } = useReveal();

  return (
    <section style={{
      background: C.periwi,
      borderRadius: "40px 40px 0 0",
      padding: "80px clamp(20px, 5vw, 64px) 100px",
    }}>
      <div ref={ref} style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 40, ...revealStyle(visible) }}>
        <div>
          <p style={{ fontFamily: MONO, fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", color: C.periwiDk, marginBottom: 10 }}>{D.theArchive}</p>
          <h2 style={{ fontFamily: SANS, fontWeight: 800, fontSize: "clamp(28px, 4vw, 48px)", letterSpacing: "-0.03em", color: C.ink }}>{D.allShots}</h2>
        </div>
        <span style={{ fontFamily: MONO, fontSize: 13, color: C.periwiDk }}>{GALLERY.length} {D.photographs}</span>
      </div>

      {/* True masonry via CSS columns */}
      <div style={{ columns: 3, columnGap: 12 }}>
        {GALLERY.map((photo, i) => (
          <MasonryItem key={photo.seed} photo={photo} index={i} onOpen={onOpen} openLabel={D.openPhoto} />
        ))}
      </div>
    </section>
  );
}

function MasonryItem({ photo, index, onOpen, openLabel }: { photo: typeof GALLERY[0]; index: number; onOpen: (i: number) => void; openLabel: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onOpen(index)}
      style={{
        breakInside: "avoid",
        marginBottom: 12,
        borderRadius: 16,
        overflow: "hidden",
        position: "relative",
        cursor: "zoom-in",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://picsum.photos/seed/${photo.seed}/${photo.w}/${photo.h}`}
        alt=""
        style={{
          width: "100%", height: "auto",
          transform: hovered ? "scale(1.04)" : "scale(1)",
          transition: "transform 550ms cubic-bezier(0.2,0.8,0.2,1)",
        }}
      />
      <div style={{
        position: "absolute", inset: 0,
        background: "rgba(24,24,27,0.32)",
        opacity: hovered ? 1 : 0,
        transition: "opacity 0.25s",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{
          background: "rgba(240,235,227,0.15)", border: "1px solid rgba(240,235,227,0.3)",
          backdropFilter: "blur(8px)", borderRadius: 100,
          padding: "8px 18px",
          fontFamily: SANS, fontSize: 12, fontWeight: 600, color: "#fff",
        }}>{openLabel}</div>
      </div>
    </div>
  );
}

/* ── About ──────────────────────────────────────────────────── */

function AboutSection({ D }: { D: DemoStrings }) {
  const { ref, visible } = useReveal();

  return (
    <section style={{
      background: C.mint, borderRadius: "40px 40px 0 0",
      marginTop: -24, padding: "100px clamp(20px, 5vw, 64px)",
    }}>
      <div ref={ref} style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: "clamp(32px, 6vw, 96px)", alignItems: "center",
        ...revealStyle(visible),
      }}>
        {/* Portrait */}
        <div style={{ position: "relative" }}>
          <div style={{ borderRadius: 32, overflow: "hidden", aspectRatio: "4/5", background: C.peach }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://picsum.photos/seed/700/800/1000" alt="Mia" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          {/* Floating badge */}
          <div style={{
            position: "absolute", bottom: 24, right: -20,
            background: "#fff", borderRadius: 20,
            padding: "16px 22px",
            boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
          }}>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 30, letterSpacing: "-0.03em", lineHeight: 1 }}>340+</div>
            <div style={{ fontFamily: SANS, fontSize: 12, fontWeight: 500, color: C.mid, marginTop: 4 }}>{D.happyClients}</div>
          </div>
        </div>

        {/* Text */}
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div>
            <p style={{ fontFamily: MONO, fontSize: 12, letterSpacing: "0.26em", textTransform: "uppercase", color: C.mintDk, marginBottom: 14 }}>{D.heyIm}</p>
            <h2 style={{ fontFamily: SANS, fontWeight: 800, fontSize: "clamp(32px, 4vw, 52px)", letterSpacing: "-0.03em", lineHeight: 1.08 }}>
              {D.aboutH2a}{" "}
              <span style={{ background: C.coral, borderRadius: 10, padding: "1px 12px", display: "inline-block" }}>{D.aboutH2highlight}</span>
            </h2>
          </div>
          <p style={{ fontFamily: SANS, fontSize: 15, lineHeight: 1.75, color: C.mid }}>
            {D.aboutBio1}
          </p>
          <p style={{ fontFamily: SANS, fontSize: 15, lineHeight: 1.75, color: C.mid }}>
            {D.aboutBio2}
          </p>

          {/* Pill stats */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {D.pills.map((pill) => (
              <span key={pill.label} style={{
                fontFamily: SANS, fontSize: 13, fontWeight: 600,
                background: pill.bg, color: C.ink,
                padding: "8px 16px", borderRadius: 100,
              }}>{pill.label}</span>
            ))}
          </div>

          <a href="#" style={{
            alignSelf: "flex-start",
            fontFamily: SANS, fontSize: 14, fontWeight: 700,
            color: "#fff", background: C.ink,
            padding: "13px 28px", borderRadius: 100,
            display: "flex", alignItems: "center", gap: 8,
            transition: "background 0.2s, transform 0.2s",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = C.mintDk; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = C.ink; e.currentTarget.style.transform = "translateY(0)"; }}
          >{D.myFullStory}</a>
        </div>
      </div>
    </section>
  );
}

/* ── Contact ────────────────────────────────────────────────── */

function ContactSection({ D }: { D: DemoStrings }) {
  const { ref, visible } = useReveal();

  return (
    <section style={{
      background: C.bg, borderRadius: "40px 40px 0 0",
      marginTop: -24, padding: "100px clamp(20px, 5vw, 64px)",
      textAlign: "center",
    }}>
      <div ref={ref} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, ...revealStyle(visible) }}>
        <p style={{ fontFamily: MONO, fontSize: 12, letterSpacing: "0.26em", textTransform: "uppercase", color: C.mid }}>{D.sayHello}</p>
        <h2 style={{ fontFamily: SANS, fontWeight: 800, fontSize: "clamp(36px, 6vw, 80px)", letterSpacing: "-0.04em", maxWidth: "14ch", lineHeight: 0.97 }}>
          {D.contactH2}
        </h2>
        <p style={{ fontFamily: SANS, fontSize: 16, lineHeight: 1.7, color: C.mid, maxWidth: 460 }}>
          {D.contactSub}
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <a href="#" style={{
            fontFamily: SANS, fontSize: 15, fontWeight: 700, color: "#fff",
            background: C.ink, padding: "15px 36px", borderRadius: 100,
            transition: "background 0.2s, transform 0.2s",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = C.coralDk; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = C.ink; e.currentTarget.style.transform = "translateY(0)"; }}
          >{D.sendMessage}</a>
          <a href="#" style={{
            fontFamily: SANS, fontSize: 15, fontWeight: 600, color: C.ink,
            padding: "15px 36px", borderRadius: 100, border: `2px solid ${C.dimMed}`,
            transition: "border-color 0.2s",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.ink; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.dimMed; }}
          >{D.bookCall}</a>
        </div>

        {/* Social pills */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginTop: 8 }}>
          {["Instagram", "TikTok", "Behance", "Substack"].map((s) => (
            <a key={s} href="#" style={{
              fontFamily: SANS, fontSize: 13, fontWeight: 500,
              color: C.mid, background: C.surface,
              padding: "8px 18px", borderRadius: 100,
              transition: "background 0.18s, color 0.18s",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = C.coral; e.currentTarget.style.color = C.ink; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = C.surface; e.currentTarget.style.color = C.mid; }}
            >{s}</a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Footer ─────────────────────────────────────────────────── */

function FooterBar({ D }: { D: DemoStrings }) {
  return (
    <footer style={{
      background: C.ink, padding: "0 clamp(20px, 5vw, 64px)",
      height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
    }}>
      <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 14, letterSpacing: "-0.02em", color: "#fff" }}>
        mia.<span style={{ color: C.coralDk }}>photo</span>
      </span>
      <span style={{ fontFamily: MONO, fontSize: 13, letterSpacing: "0.16em", color: "rgba(255,255,255,0.28)" }}>
        {D.footerCopy}
      </span>
      <div style={{ display: "flex", gap: 20 }}>
        {D.footerLinks.map((item) => (
          <a key={item} href="#" style={{
            fontFamily: SANS, fontSize: 12, fontWeight: 500,
            color: "rgba(255,255,255,0.32)", transition: "color 0.18s",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.85)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.32)"; }}
          >{item}</a>
        ))}
      </div>
    </footer>
  );
}

/* ── Lightbox ───────────────────────────────────────────────── */

function PetalLightbox({
  photos, startIndex, onClose, D,
}: { photos: typeof GALLERY; startIndex: number; onClose: () => void; D: DemoStrings }) {
  const [index, setIndex]   = useState(startIndex);
  const [zoom, setZoom]     = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDrag] = useState(false);
  const dragRef             = useRef({ sx: 0, sy: 0, ox: 0, oy: 0 });
  const containerRef        = useRef<HTMLDivElement>(null);
  const photo               = photos[index]!;

  const resetView = useCallback(() => { setZoom(1); setOffset({ x: 0, y: 0 }); }, []);
  const prev = useCallback(() => { setIndex((i) => Math.max(i - 1, 0)); resetView(); }, [resetView]);
  const next = useCallback(() => { setIndex((i) => Math.min(i + 1, photos.length - 1)); resetView(); }, [photos.length, resetView]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape")     onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft")  prev();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose, next, prev]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const fn = (e: WheelEvent) => {
      e.preventDefault();
      setZoom((p) => {
        const n = Math.min(Math.max(p * (e.deltaY < 0 ? 1.12 : 0.9), 1), 8);
        if (n === 1) setOffset({ x: 0, y: 0 });
        return n;
      });
    };
    el.addEventListener("wheel", fn, { passive: false });
    return () => el.removeEventListener("wheel", fn);
  }, []);

  const onMD = (e: React.MouseEvent) => { if (zoom <= 1) return; e.preventDefault(); setDrag(true); dragRef.current = { sx: e.clientX, sy: e.clientY, ox: offset.x, oy: offset.y }; };
  const onMM = (e: React.MouseEvent) => { if (!dragging) return; setOffset({ x: dragRef.current.ox + e.clientX - dragRef.current.sx, y: dragRef.current.oy + e.clientY - dragRef.current.sy }); };
  const onMU = () => setDrag(false);

  // Touch swipe — only when not zoomed
  const touchStartX = useRef(0);
  const onTouchStart = (e: React.TouchEvent) => { if (zoom <= 1 && e.touches[0]) touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (zoom > 1) return;
    const t = e.changedTouches[0]; if (!t) return;
    const dx = touchStartX.current - t.clientX;
    if (Math.abs(dx) > 40) { if (dx > 0) next(); else prev(); }
  };

  return (
    <div onClick={(e) => e.stopPropagation()} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
      style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(18,18,20,0.97)", display: "flex", flexDirection: "column", userSelect: "none" }}>

      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", flexShrink: 0 }}>
        <button onClick={onClose} style={{
          background: "rgba(255,255,255,0.08)", border: "none", cursor: "pointer",
          color: "rgba(255,255,255,0.7)", padding: "8px 18px", borderRadius: 100,
          fontFamily: SANS, fontSize: 13, fontWeight: 600,
          display: "flex", alignItems: "center", gap: 6,
          transition: "background 0.18s",
        }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.14)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          {D.lbClose}
        </button>
        <span style={{ fontFamily: MONO, fontSize: 12, letterSpacing: "0.2em", color: "rgba(255,255,255,0.3)" }}>
          {String(index + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
        </span>
        {zoom > 1 ? (
          <button onClick={resetView} style={{ background: C.coral, border: "none", cursor: "pointer", color: C.ink, padding: "8px 18px", borderRadius: 100, fontFamily: SANS, fontSize: 12, fontWeight: 700 }}>
            {Math.round(zoom * 100)}% · {D.lbReset}
          </button>
        ) : <div style={{ width: 90 }} />}
      </div>

      {/* Image */}
      <div ref={containerRef} style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "8px 80px", overflow: "hidden",
        cursor: zoom > 1 ? (dragging ? "grabbing" : "grab") : "default",
      }} onMouseDown={onMD} onMouseMove={onMM} onMouseUp={onMU} onMouseLeave={onMU}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://picsum.photos/seed/${photo.seed}/${photo.w * 2}/${photo.h * 2}`}
          alt="" draggable={false}
          style={{
            maxWidth: "100%", maxHeight: "100%", objectFit: "contain",
            borderRadius: 16, pointerEvents: "none",
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
            transition: dragging ? "none" : "transform 0.18s ease",
          }}
        />
      </div>

      {/* Arrows */}
      {index > 0 && (
        <button onClick={prev} style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.1)", border: "none", color: "rgba(255,255,255,0.75)", cursor: "pointer", width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", transition: "background 0.18s" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.18)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
      )}
      {index < photos.length - 1 && (
        <button onClick={next} style={{ position: "absolute", right: 18, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.1)", border: "none", color: "rgba(255,255,255,0.75)", cursor: "pointer", width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", transition: "background 0.18s" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.18)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      )}

      {/* Thumbnail strip */}
      <div style={{ display: "flex", gap: 8, padding: "12px 24px", overflowX: "auto", justifyContent: "center", flexShrink: 0 }}>
        {photos.map((p, i) => (
          <button key={p.seed} onClick={() => { setIndex(i); resetView(); }} style={{
            flex: "0 0 52px", height: 36, padding: 0, border: "none",
            borderRadius: 8, cursor: "pointer", overflow: "hidden",
            outline: i === index ? `2px solid ${C.coral}` : "2px solid transparent",
            outlineOffset: 2, transition: "outline-color 0.2s",
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`https://picsum.photos/seed/${p.seed}/120/80`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </button>
        ))}
      </div>
    </div>
  );
}
