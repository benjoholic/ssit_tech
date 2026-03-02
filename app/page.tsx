import { HeroSection } from "@/components/hero-section";
import { CtaSection } from "@/components/cta-section";
import Card from "@/components/ui/feature-card";


export default function Home() {
  return (
    <main className="relative min-h-screen bg-gray-100 pb-20 font-sans text-zinc-900 lg:pb-0">
      <HeroSection />

      {/* Features */}
      <section id="features" className="px-6 py-16 md:px-10 md:py-24 bg-white">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold tracking-tight text-zinc-900 md:text-5xl">
            Why choose SSIT Tech
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-center text-base leading-relaxed text-zinc-500 md:text-lg">
            We deliver premium networking, surveillance, and communication solutions
            with expert support and competitive pricing for businesses of all sizes.
          </p>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Quality Assurance",
                desc: "Every product meets rigorous standards. We partner with industry-leading brands and thoroughly vet every solution.",
              },
              {
                title: "Expert Team",
                desc: "Our specialists provide knowledgeable guidance to help you choose the right technology for your unique needs.",
              },
              {
                title: "Flexible Solutions",
                desc: "From small deployments to enterprise installations, we scale our offerings to match your project requirements.",
              },
            ].map((f) => (
              <Card key={f.title} title={f.title} desc={f.desc} />
            ))}
          </div>
        </div>
      </section>
      <CtaSection />
    </main>
  );
}
