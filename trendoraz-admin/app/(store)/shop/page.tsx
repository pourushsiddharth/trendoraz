import React from "react";
import Link from "next/link";
import { getDb } from "@/lib/db";
import { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ brand?: string; category?: string }>;
}

async function getProducts(brand?: string, category?: string) {
  try {
    const sql = getDb();
    let products: any[];
    
    if (brand && category) {
        products = await sql`SELECT * FROM products WHERE status = 'active' AND (name ILIKE ${'%' + brand + '%'} OR category ILIKE ${'%' + brand + '%'}) AND category ILIKE ${'%' + category + '%'} ORDER BY created_at DESC`;
    } else if (brand) {
        products = await sql`SELECT * FROM products WHERE status = 'active' AND (name ILIKE ${'%' + brand + '%'} OR category ILIKE ${'%' + brand + '%'}) ORDER BY created_at DESC`;
    } else if (category) {
        products = await sql`SELECT * FROM products WHERE status = 'active' AND category ILIKE ${'%' + category + '%'} ORDER BY created_at DESC`;
    } else {
        products = await sql`SELECT * FROM products WHERE status = 'active' ORDER BY created_at DESC`;
    }

    return products.map(p => ({
      ...p,
      created_at: p.created_at instanceof Date ? p.created_at.toISOString() : (p.created_at || new Date().toISOString())
    })) as Product[];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function ShopPage({ searchParams }: Props) {
  const { brand, category } = await searchParams;
  const products = await getProducts(brand, category);
  
  const title = brand || category || "All Products";

  return (
    <div className="bg-black min-h-screen text-white selection:bg-[#d4a853] selection:text-black">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#d4a853]/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-[#d4a853]/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
        {/* Breadcrumb & Header */}
        <div className="mb-20">
          <div className="flex items-center gap-2 mb-8 group">
            <Link href="/" className="text-[10px] text-white/30 font-bold tracking-[0.3em] uppercase hover:text-[#d4a853] transition-colors">Home</Link>
            <span className="text-[10px] text-white/10">/</span>
            <span className="text-[10px] text-[#d4a853] font-bold tracking-[0.3em] uppercase">{title}</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-8">
                {brand ? (
                  <>
                    <span className="text-[#d4a853] block text-2xl md:text-3xl tracking-[0.2em] mb-4">Essence of</span>
                    {brand}
                  </>
                ) : (
                  <>
                    <span className="text-[#d4a853] block text-2xl md:text-3xl tracking-[0.2em] mb-4">Curated</span>
                    Collection
                  </>
                )}
              </h1>
              <p className="text-white/40 text-base md:text-xl font-medium max-w-xl leading-relaxed">
                Discover pieces that redefine modern elegance and streetwear grit. Meticulously curated for those who lead.
              </p>
            </div>
            
            <div className="flex items-center gap-4 text-[10px] font-black tracking-widest uppercase text-white/20">
              <span className="w-12 h-[1px] bg-white/10" />
              <span>{products.length} Results Found</span>
            </div>
          </div>
        </div>

        {/* Filters/Sort Bar (Visual only for now) */}
        <div className="flex flex-wrap items-center gap-6 mb-16 py-6 border-y border-white/5">
          <span className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">Filter By:</span>
          {['New Arrivals', 'Price: High-Low', 'Featured', 'Limited Edition'].map(f => (
            <button key={f} className="text-[10px] font-bold tracking-[0.1em] uppercase px-4 py-2 rounded-full border border-white/5 hover:border-[#d4a853]/40 hover:text-[#d4a853] transition-all">
              {f}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="py-40 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="w-20 h-20 border border-white/5 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-white/20">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold uppercase tracking-widest mb-4">No results found</h2>
            <p className="text-white/30 text-sm mb-12 max-w-sm mx-auto">We couldn't find any products matching your current selection. Try broadening your search.</p>
            <Link href="/shop" className="inline-block bg-white text-black px-10 py-4 rounded-xl text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-[#d4a853] transition-all">View Full Collection</Link>
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

        {/* Bottom Callout */}
        {products.length > 0 && (
          <div className="mt-32 p-12 md:p-20 rounded-[3rem] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 text-center">
            <span className="text-[10px] font-black tracking-[0.5em] text-[#d4a853] uppercase mb-6 block">Join the Movement</span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-8">Never miss a drop.</h2>
            <div className="max-w-md mx-auto relative group">
              <input 
                type="email" 
                placeholder="YOUR EMAIL ADDRESS" 
                className="w-full bg-transparent border-b border-white/10 py-4 text-[10px] tracking-[0.2em] focus:outline-none focus:border-[#d4a853] transition-all placeholder:text-white/10 uppercase"
              />
              <button className="absolute right-0 bottom-4 text-[10px] font-black tracking-[0.2em] uppercase text-[#d4a853] hover:text-white transition-colors">Subscribe</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
