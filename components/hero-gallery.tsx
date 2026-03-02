"use client";

import Image from "next/image";
import { useState } from "react";
import { fetchProductsCached as getProductsAction } from "@/lib/productsClient";
import { useEffect } from "react";
import { CATEGORY_LABELS, type Product } from "@/lib/products";
import styled from "styled-components";

// Styled-components
const GalleryWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  @media (min-width: 768px) {
    gap: 1rem;
  }
  @media (min-width: 1024px) {
    gap: 1.5rem;
  }
  user-select: none;
`;

const GalleryItem = styled.div<{ $isFocus: boolean }>`
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: ${({ $isFocus }) => ($isFocus ? 10 : 0)};
  transform: ${({ $isFocus }) => ($isFocus ? "scale(1.25)" : "scale(0.85)")};
  opacity: ${({ $isFocus }) => ($isFocus ? 1 : 0.6)};
  cursor: ${({ $isFocus }) => ($isFocus ? "default" : "pointer")};
`;

const ImageWrapper = styled.div`
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0,0,0,0.15);
  background: transparent;
`;

export function HeroGallery() {
  const [products, setProducts] = useState<Product[]>([]);
  const [focusIdx, setFocusIdx] = useState(0);

  useEffect(() => {
    getProductsAction().then(({ data }) => {
      setProducts(data || []);
    });
  }, []);

  if (products.length === 0) {
    return null;
  }

  // Show up to 5 images, focus in the center
  const visible = products.slice(0, 5);
  const focus = Math.min(focusIdx, visible.length - 1);

  return (
    <GalleryWrapper>
      {visible.map((product, idx) => {
        const isFocus = idx === focus;
        return (
          <GalleryItem
            key={product.id}
            $isFocus={isFocus}
            onClick={() => setFocusIdx(idx)}
          >
            <ImageWrapper>
              <Image
                src={product.image || "/images/placeholder.png"}
                alt={product.name}
                width={isFocus ? 320 : 180}
                height={isFocus ? 400 : 220}
                className="object-contain bg-transparent"
                priority={isFocus}
              />
            </ImageWrapper>
            <div className="mt-2 text-xs text-white/80 font-semibold text-center max-w-[140px] truncate">
              {product.name}
            </div>
          </GalleryItem>
        );
      })}
    </GalleryWrapper>
  );
}
