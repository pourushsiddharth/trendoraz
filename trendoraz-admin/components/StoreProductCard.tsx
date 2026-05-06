"use client";
import React from "react";
import Link from "next/link";
import { Product } from "@/lib/types";

interface StoreProductCardProps {
  product: Product;
  className?: string;
}

const StoreProductCard = ({ product, className }: StoreProductCardProps) => {
  return (
    <Link 
      href={`/p/${product.id}`}
      className={`slider-card group ${className || ""}`}
    >
      <div className="relative overflow-hidden aspect-[4/5]">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-[#EAEAEA] flex items-center justify-center text-[#666]">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2" strokeLinecap="round" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
        
        {/* Badges */}
        {product.new_arrival && (
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-[#D4FF00] text-[#1A1A1A] text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg">New Arrival</span>
          </div>
        )}
      </div>

      <div className="p-6 text-center border-t border-[#00000008]">
        <p className="text-[10px] text-[#666666] font-bold uppercase tracking-[0.2em] mb-2">{product.category.replace(/-/g, " ")}</p>
        <h3 className="text-[#1A1A1A] text-sm font-semibold tracking-tight transition-colors group-hover:text-[#8A2BE2] mb-3">{product.name}</h3>
        
        <div className="flex items-center justify-center gap-4">
           {product.original_price && (
             <span className="text-[#666666] text-xs line-through font-medium opacity-50">₹{product.original_price.toLocaleString()}</span>
           )}
           <span className="text-[#1A1A1A] text-lg font-bold tracking-tight">₹{product.price.toLocaleString()}</span>
        </div>
      </div>
    </Link>
  );
};

export default StoreProductCard;
