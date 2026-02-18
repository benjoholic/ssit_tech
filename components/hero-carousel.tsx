"use client";

import * as React from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { Package } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";
import { getProductsAction } from "@/app/admin/products/actions";
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
    return () => {
      mounted = false;
    };
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
      <div className="w-full max-w-3xl">
        <div className="flex gap-2 md:gap-4">
          <div className="aspect-4/3 w-full animate-pulse rounded-xl bg-zinc-100" />
          <div className="hidden aspect-4/3 w-full animate-pulse rounded-xl bg-zinc-100 md:block" />
          <div className="hidden aspect-4/3 w-full animate-pulse rounded-xl bg-zinc-100 lg:block" />
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex aspect-4/3 w-full max-w-3xl items-center justify-center rounded-xl bg-zinc-50">
        <Package className="h-12 w-12 text-zinc-200" />
      </div>
    );
  }

  return (
    <Carousel
      setApi={setApi}
      opts={{
        loop: true,
        align: "start",
      }}
      plugins={[Autoplay({ delay: 4000, stopOnInteraction: false })]}
      className="w-full max-w-3xl rounded-2xl border border-zinc-200 bg-white shadow-sm"
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {products.map((product) => (
          <CarouselItem
            key={product.id}
            className="pl-2 md:basis-1/2 md:pl-4 lg:basis-1/3"
          >
            <div className="flex flex-col">
              {/* Image Card */}
              <div className="overflow-hidden rounded-t-xl bg-white shadow-sm">
                <div className="relative aspect-4/3 w-full overflow-hidden bg-zinc-50">
                  {imageUrl(product) ? (
                    <Image
                      src={imageUrl(product)!}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Package className="h-12 w-12 text-zinc-200" />
                    </div>
                  )}
                </div>
              </div>

              {/* Text Card */}
              <div className="overflow-hidden rounded-b-xl border border-zinc-100 bg-white px-4 py-3 shadow-sm transition-all hover:shadow-md">
                <p className="text-xs font-medium text-zinc-400">
                  {CATEGORY_LABELS[product.category]}
                </p>
                <h3 className="mt-0.5 text-sm font-semibold text-zinc-900">
                  {product.name}
                </h3>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious className="-left-4 size-8 border-zinc-100 bg-white shadow-sm hover:bg-zinc-50" />
      <CarouselNext className="-right-4 size-8 border-zinc-100 bg-white shadow-sm hover:bg-zinc-50" />

      {/* Dots */}
      {count > 1 && (
        <div className="flex items-center justify-center gap-1.5 pb-4">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => api?.scrollTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current
                  ? "w-6 bg-zinc-900"
                  : "w-1.5 bg-zinc-200 hover:bg-zinc-300"
              }`}
            />
          ))}
        </div>
      )}
    </Carousel>
  );
}
