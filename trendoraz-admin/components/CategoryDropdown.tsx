"use client";

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BRAND_CATEGORIES } from "@/lib/brands";

interface CategoryDropdownProps {
  category: string;
  brands: string[];
}

export default function CategoryDropdown({ category, brands }: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant group-hover:text-primary transition-colors flex items-center gap-1 whitespace-nowrap">
        {category}
        <span className={`material-symbols-outlined text-[14px] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
          expand_more
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-48 bg-white shadow-xl border border-outline-variant/10 rounded-b-xl py-3 z-[100] animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex flex-col">
            {brands.map((brand) => (
              <Link 
                key={brand} 
                href={`/shop/${brand.toLowerCase().replace(/\s+/g, "-")}`}
                className="px-4 py-2 text-xs text-slate-600 hover:text-primary hover:bg-slate-50 transition-colors"
              >
                {brand}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
