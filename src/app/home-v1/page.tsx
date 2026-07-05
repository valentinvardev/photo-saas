import { CtaBanner } from "~/components/landing/CtaBanner";
import { Features } from "~/components/landing/Features";
import { Footer } from "~/components/landing/Footer";
import { Hero } from "~/components/landing/Hero";
import { HowItWorks } from "~/components/landing/HowItWorks";
import { Marquee } from "~/components/landing/Marquee";
import { Navbar } from "~/components/landing/Navbar";
import { Pricing } from "~/components/landing/Pricing";
import { Testimonials } from "~/components/landing/Testimonials";

/**
 * Archived homepage (v1) — the original full landing, kept at /home-v1 so it
 * can be compared against or restored. The live homepage lives at `/`.
 */
export default function LandingV1Page() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Marquee />
      <Features />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <CtaBanner />
      <Footer />
    </main>
  );
}
