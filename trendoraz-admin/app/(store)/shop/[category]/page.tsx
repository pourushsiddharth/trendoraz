import React from "react";
import Link from "next/link";
import { getDb } from "@/lib/db";
import { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ category: string }>;
}

const CATEGORY_NAMES: Record<string, string> = {
  men: "Men's Collection",
  women: "Women's Collection",
  watch: "Signature Watches",
  sneakers: "Premium Sneakers",
  accessories: "Luxury Accessories",
  apparel: "Designer Apparel",
  performance: "High Performance",
  lifestyle: "Lifestyle & Culture"
};

async function getProductsByCategory(category: string) {
  try {
    const sql = getDb();
    const results = await sql`SELECT * FROM products WHERE status = 'active' AND category ILIKE ${'%' + category + '%'} ORDER BY created_at DESC`;
    
    return results.map(p => ({
      ...p,
      created_at: p.created_at instanceof Date ? p.created_at.toISOString() : (p.created_at || new Date().toISOString())
    })) as Product[];
  } catch (error) {
    console.error("Error fetching category products:", error);
    return [];
  }
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const products = await getProductsByCategory(category);
  const displayName = CATEGORY_NAMES[category.toLowerCase()] || category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <div className="bg-black min-h-screen text-white selection:bg-[#d4a853] selection:text-black">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-[#d4a853]/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-20">
          <div className="flex items-center gap-2 mb-8">
            <Link href="/" className="text-[10px] text-white/30 font-bold tracking-[0.3em] uppercase hover:text-[#d4a853] transition-colors">Home</Link>
            <span className="text-[10px] text-white/10">/</span>
            <Link href="/shop" className="text-[10px] text-white/30 font-bold tracking-[0.3em] uppercase hover:text-[#d4a853] transition-colors">Shop</Link>
            <span className="text-[10px] text-white/10">/</span>
            <span className="text-[10px] text-[#d4a853] font-bold tracking-[0.3em] uppercase">{displayName}</span>
          </div>
          
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-8">
              <span className="text-[#d4a853] block text-2xl md:text-3xl tracking-[0.2em] mb-4">Elite Selection</span>
              {displayName}
            </h1>
            <p className="text-white/40 text-base md:text-xl font-medium max-w-xl leading-relaxed">
              Curating the world's most sought-after {category} pieces. From legendary icons to future classics.
            </p>
          </div>
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="py-40 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h2 className="text-2xl font-bold uppercase tracking-widest mb-4">Coming Soon</h2>
            <p className="text-white/30 text-sm mb-12 max-w-sm mx-auto">We're currently updating our {displayName} inventory with new arrivals. Check back shortly.</p>
            <Link href="/shop" className="inline-block bg-white text-black px-10 py-4 rounded-xl text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-[#d4a853] transition-all">Explore Other Categories</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {products.map((p, idx) => (
              <div key={p.id} className="animate-in fade-in slide-in-from-bottom-12 duration-1000 fill-mode-both" style={{ animationDelay: `${idx * 100}ms` }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
