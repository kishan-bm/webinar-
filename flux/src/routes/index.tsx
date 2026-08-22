import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { LogoMarquee } from "@/components/landing/LogoMarquee";
import { ProductShowcase } from "@/components/landing/ProductShowcase";
import { IntegrationFlow } from "@/components/landing/IntegrationFlow";
import { Stats } from "@/components/landing/Stats";
import { Features } from "@/components/landing/Features";
import { Testimonials } from "@/components/landing/Testimonials";
import { Waitlist } from "@/components/landing/Waitlist";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <LogoMarquee />
        <ProductShowcase />
        <Features />
        <IntegrationFlow />
        <Stats />
        <Testimonials />
        <Waitlist />
      </main>
      <Footer />
    </div>
  );
}
