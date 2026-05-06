"use client";
import React, { useRef } from "react";
import StoreProductCard from "./StoreProductCard";
import { Product } from "@/lib/types";

interface FeaturedSectionProps {
  products: Product[];
}

const FeaturedSection = ({ products }: FeaturedSectionProps) => {
  const sliderRef = useRef<HTMLDivElement>(null);

  return (
    <section id="featured" className="featured-section">
      <div className="section-header fade-in-scroll">
        <h2 className="section-title">New Arrivals</h2>
      </div>

      <div className="slider-container" ref={sliderRef}>
        <div className="horizontal-slider">
          {products.map((product) => (
            <StoreProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
