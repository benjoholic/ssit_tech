import Image from "next/image";
import { HeroSection } from "@/components/hero-section";
import { CtaSection } from "@/components/cta-section";
import { WhyChooseSection } from "@/components/why-choose-section";
import { PartnersOrbit } from "@/components/partners-orbit";


export default function Home() {
  return (
    <main className="relative min-h-screen bg-gray-100 pb-20 font-sans text-zinc-900 lg:pb-0">
      <HeroSection />
      <WhyChooseSection />
      <PartnersOrbit />
      <CtaSection />
    </main>
  );
}
