"use client";

import React from "react";
import Link from "next/link";
import { BRAND_CATEGORIES } from "@/lib/brands";

export default function BrandGrid() {
  return (
    <section className="max-w-[1440px] mx-auto px-8 mt-24 fade-up">
      <div className="flex items-end justify-between mb-12">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-on-surface">CURATED BRANDS</h2>
          <p className="text-on-surface-variant/60 font-medium">The world&apos;s most prestigious labels, curated for the discerning.</p>
        </div>
      </div>

      <div className="space-y-16">
        {Object.entries(BRAND_CATEGORIES).map(([group, brands]) => (
          <div key={group} className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-primary border-l-2 border-primary pl-3">
              {group}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {brands.map((brand) => (
                <Link 
                  key={brand} 
                  href={`/shop/${brand.toLowerCase().replace(/\s+/g, "-")}`}
                  className="group relative aspect-video bg-white border border-outline-variant/10 rounded-xl flex items-center justify-center p-4 transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/5 active:scale-95"
                >
                  {/* Brand Logo Placeholder - User can replace src with actual logo paths */}
                  <div className="text-center">
                    <p className="text-on-surface font-headline font-bold text-sm group-hover:text-primary transition-colors">
                      {brand}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
