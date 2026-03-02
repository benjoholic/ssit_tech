"use client";

import * as React from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { type CarouselApi } from "@/components/ui/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { fetchProductsCached as getProductsAction } from "@/lib/productsClient";
import { CATEGORY_LABELS, type Product } from "@/lib/products";

export function HeroCarousel() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    let mounted = true;
    getProductsAction().then(({ data, error }) => {
      if (mounted) {
        setLoading(false);
        if (!error) setProducts(data);
      }
    });
    return () => { mounted = false; };
  }, []);

  React.useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  const imageUrl = (p: Product) =>
    p.image && p.image.trim() ? p.image.trim() : null;

  if (loading) {
    return (
      <div className="relative w-full max-w-sm sm:max-w-2xl md:max-w-6xl px-2 sm:px-6">
        {/* Shimmer skeleton cards sized to match final image container */}
        <div className="flex items-end justify-center gap-3">
          {/* Side card left */}
          <div className="hidden sm:block w-1/3 rounded-3xl overflow-hidden shrink-0 scale-[0.82] opacity-[0.45] shadow-2xl bg-transparent">
            <div className="w-full h-full min-h-[260px] sm:min-h-[320px] md:min-h-[380px] bg-white/10 shimmer-card" />
          </div>
          {/* Center card */}
          <div className="w-full sm:w-1/3 rounded-3xl overflow-hidden shrink-0 shadow-2xl bg-transparent">
            <div className="w-full h-full min-h-[260px] sm:min-h-[320px] md:min-h-[380px] bg-white/20 shimmer-card" />
          </div>
          {/* Side card right */}
          <div className="hidden sm:block w-1/3 rounded-3xl overflow-hidden shrink-0 scale-[0.82] opacity-[0.45] shadow-2xl bg-transparent">
            <div className="w-full h-full min-h-[260px] sm:min-h-[320px] md:min-h-[380px] bg-white/10 shimmer-card" />
          </div>
        </div>
        <style>{`
          @keyframes shimmer {
            0% { background-position: -400px 0; }
            100% { background-position: 400px 0; }
          }
          .shimmer-card {
            background-image: linear-gradient(
              90deg,
              rgba(255,255,255,0.04) 0px,
              rgba(255,255,255,0.12) 80px,
              rgba(255,255,255,0.04) 160px
            );
            background-size: 400px 100%;
            animation: shimmer 1.6s infinite linear;
          }
        `}</style>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex aspect-[3/4] w-64 items-center justify-center rounded-2xl bg-white/10">
        <Package className="h-12 w-12 text-white/30" />
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        className="relative w-full max-w-sm sm:max-w-2xl md:max-w-6xl select-none"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
      <Carousel
        setApi={setApi}
        opts={{ loop: true, align: "center" }}
        plugins={[Autoplay({ delay: 4000, stopOnInteraction: false })]}
        className="w-full"
      >
        <CarouselContent className="-ml-3">
          {products.map((product, index) => {
            const isCurrent = index === current;
            return (
              <CarouselItem
                key={product.id}
                className="pl-3 basis-full sm:basis-4/5 md:basis-3/5 lg:basis-1/2"
              >
                <div
                  className={`transition-all duration-500 ${
                    isCurrent
                      ? "scale-100 opacity-100"
                      : "scale-[0.82] opacity-[0.45] blur-[1px]"
                  }`}
                >
                  {/* Album cover */}
                  <div className="relative w-full overflow-hidden rounded-3xl shadow-2xl bg-transparent min-h-[260px] sm:min-h-[320px] md:min-h-[380px]">
                    {imageUrl(product) ? (
                      <Image
                        src={imageUrl(product)!}
                        alt={product.name}
                        width={600}
                        height={800}
                        className="w-full h-auto object-contain"
                        sizes="(max-width: 640px) 90vw, (max-width: 768px) 60vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-transparent min-h-[260px] sm:min-h-[320px] md:min-h-[380px]">
                        <Package className="h-24 w-24 text-white/20" />
                      </div>
                    )}
                    {/* Bottom gradient label */}
                    {/* Removed name and category from bottom gradient label */}
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>

      {/* Custom nav buttons */}
      <button
        type="button"
        onClick={() => api?.scrollPrev()}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 flex h-7 w-7 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 border border-white/10"
        aria-label="Previous"
      >
        <ChevronLeft className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
      </button>
      <button
        type="button"
        onClick={() => api?.scrollNext()}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 flex h-7 w-7 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 border border-white/10"
        aria-label="Next"
      >
        <ChevronRight className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
      </button>

      {/* Dot indicators */}
      {count > 1 && (
        <div className="mt-6 flex items-center justify-center gap-1.5">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => api?.scrollTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? "w-6 h-1.5 bg-white"
                  : "w-1.5 h-1.5 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </motion.div>
    </AnimatePresence>
  );
}
