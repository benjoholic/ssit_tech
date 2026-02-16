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
      <div className="w-full max-w-md">
        <div className="aspect-[4/3] w-full animate-pulse rounded-xl bg-zinc-100" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex aspect-[4/3] w-full max-w-md items-center justify-center rounded-xl bg-zinc-50">
        <Package className="h-12 w-12 text-zinc-200" />
      </div>
    );
  }

  return (
    <Carousel
      setApi={setApi}
      opts={{ loop: true }}
      plugins={[Autoplay({ delay: 4000, stopOnInteraction: false })]}
      className="w-full max-w-md"
    >
      <CarouselContent>
        {products.map((product) => (
          <CarouselItem key={product.id}>
            <div className="overflow-hidden rounded-xl border border-zinc-100 bg-white">
              {/* Image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-50">
                {imageUrl(product) ? (
                  <Image
                    src={imageUrl(product)!}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 448px"
                    priority
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Package className="h-12 w-12 text-zinc-200" />
                  </div>
                )}
              </div>

              {/* Caption */}
              <div className="px-4 py-3">
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

      <CarouselPrevious className="-left-4 size-7 border-zinc-100 bg-white shadow-sm hover:bg-zinc-50" />
      <CarouselNext className="-right-4 size-7 border-zinc-100 bg-white shadow-sm hover:bg-zinc-50" />

      {/* Dots */}
      {count > 1 && (
        <div className="mt-3 flex items-center justify-center gap-1">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => api?.scrollTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current
                  ? "w-5 bg-zinc-900"
                  : "w-1.5 bg-zinc-200 hover:bg-zinc-300"
              }`}
            />
          ))}
        </div>
      )}
    </Carousel>
  );
}
