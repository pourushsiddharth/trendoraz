"use client";

import React, { useTransition } from "react";
import Link from "next/link";
import { Product } from "@/lib/types";
import { addToCart } from "@/app/actions/cart";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await addToCart(product.id, "Default", "Standard");
      router.push("/cart");
    });
  };

  return (
    <div className="group relative w-full h-full flex flex-col bg-[#0d0d0d] border border-white/5 rounded-2xl overflow-hidden transition-all duration-500 hover:border-[#d4a853]/40 hover:shadow-[0_0_30px_rgba(212,168,83,0.1)]">
      <Link href={`/p/${product.id}`} className="block relative aspect-[4/5] overflow-hidden">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-white/5 flex items-center justify-center text-white/20">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2" strokeLinecap="round" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
           {product.new_arrival && (
             <span className="px-3 py-1 bg-white text-black text-[9px] font-black uppercase tracking-widest rounded-sm">New Arrival</span>
           )}
           {product.featured && (
             <span className="px-3 py-1 bg-[#d4a853] text-black text-[9px] font-black uppercase tracking-widest rounded-sm shadow-xl">Featured</span>
           )}
        </div>

        <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/20" />
      </Link>

      <div className="p-5 flex flex-col items-center text-center">
        <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em] mb-2">{product.category.replace(/-/g, " ")}</p>
        <h3 className="text-white text-sm font-semibold tracking-wide mb-3">{product.name}</h3>
        
        <div className="flex items-center gap-4">
           {product.original_price && (
             <span className="text-white/20 text-xs line-through font-medium">₹{product.original_price.toLocaleString()}</span>
           )}
           <span className="text-[#d4a853] text-lg font-bold tracking-tight">₹{product.price.toLocaleString()}</span>
        </div>
      </div>

      <div className="absolute bottom-5 left-5 right-5 translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out z-10">
         <button 
           onClick={handleAddToCart}
           disabled={isPending}
           className="w-full bg-[#d4a853] hover:bg-white text-black font-black text-[10px] tracking-[0.1em] py-4 rounded-xl shadow-2xl transition-all disabled:opacity-50"
         >
            {isPending ? "ADDING..." : "ADD TO CART"}
         </button>
      </div>
    </div>
  );
};

export default ProductCard;
