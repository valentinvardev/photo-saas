import { CtaBanner } from "~/components/landing/CtaBanner";
import { Features } from "~/components/landing/Features";
import { Footer } from "~/components/landing/Footer";
import { Hero } from "~/components/landing/Hero";
import { HowItWorks } from "~/components/landing/HowItWorks";
import { Marquee } from "~/components/landing/Marquee";
import { Navbar } from "~/components/landing/Navbar";
import { Pricing } from "~/components/landing/Pricing";
import { Testimonials } from "~/components/landing/Testimonials";

export default function LandingPage() {
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
