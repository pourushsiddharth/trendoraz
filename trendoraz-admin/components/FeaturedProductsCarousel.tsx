"use client";

import React, { useRef } from "react";
import { Product } from "@/lib/types";

const ProductCard = ({ product }: { product: Product }) => (
  <div className="group cursor-pointer min-w-[280px] md:min-w-[300px]">
    <div className="relative aspect-[4/5] bg-surface-container-low rounded-xl overflow-hidden mb-4">
      <img 
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
        alt={product.name} 
        src={product.images && product.images.length > 0 ? product.images[0] : "/placeholder.png"} 
      />
      {product.original_price && product.original_price > product.price && (
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-primary">
          SAVE {Math.round((1 - (product.price / product.original_price)) * 100)}%
        </div>
      )}
      <button className="absolute bottom-4 left-4 right-4 bg-on-surface text-surface py-3 rounded-lg font-bold text-xs tracking-widest uppercase opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
        Add to Cart
      </button>
    </div>
    <div className="space-y-1">
      <p className="text-[10px] font-bold uppercase tracking-widest text-primary">{product.category}</p>
      <h3 className="font-headline font-bold text-on-surface truncate">{product.name}</h3>
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-on-surface">${(product.price / 100).toFixed(2)}</span>
        {product.original_price && product.original_price > product.price && (
          <span className="text-xs text-outline line-through">${(product.original_price / 100).toFixed(2)}</span>
        )}
      </div>
    </div>
  </div>
);

export default function FeaturedProductsCarousel({ products }: { products: Product[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" 
        ? scrollLeft - clientWidth / 1.5 
        : scrollLeft + clientWidth / 1.5;
      
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <div className="relative group">
      {/* Navigation Arrows */}
      <button 
        onClick={() => scroll("left")}
        className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/80 backdrop-blur rounded-full shadow-lg flex items-center justify-center text-on-surface opacity-0 group-hover:opacity-100 transition-all hover:bg-white active:scale-90 hidden md:flex"
      >
        <span className="material-symbols-outlined">chevron_left</span>
      </button>
      <button 
        onClick={() => scroll("right")}
        className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/80 backdrop-blur rounded-full shadow-lg flex items-center justify-center text-on-surface opacity-0 group-hover:opacity-100 transition-all hover:bg-white active:scale-90 hidden md:flex"
      >
        <span className="material-symbols-outlined">chevron_right</span>
      </button>

      {/* Scrollable Container */}
      <div 
        ref={scrollRef}
        className="flex gap-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((p) => (
          <div key={p.id} className="snap-start">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
}
