import React from "react";
import Link from "next/link";
import { getDb } from "@/lib/db";
import { Product } from "@/lib/types";
import { notFound } from "next/navigation";
import AddToBagButton from "./AddToBagButton";
import ReviewForm from "./ReviewForm";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

async function getProductById(id: string) {
  if (parseInt(id) > 9000) {
    // Return dummy product for demonstration to match frontend dummy generation
    return {
      id: parseInt(id),
      name: "The Luminous Silk Blouse",
      price: 890,
      description: "An architectural approach to fluidity. This piece is crafted from premium materials, designed to move with the body like a second skin.",
      images: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCcJ3amfn_hz1J8r1PqNCHZEWOfFj9mujhQOhCSPfa-S-imI1tLGuNO64-ecxTDxl1M-90LidAN1bX4sf9TNYdB0UgR54YjYotPJ_xl592SfIPCaTUsnq-uLMr4z0rOMNLET5rWvxn7wRTYwsdoCf0o2xzrhvXW_nsgE-RzYYcVHNw8bDOiG5Q23J0LtOsdx5sfmigg4oB6tZy40lGdJMtTTtG2z-A5-4-g9mCjDi7kwlMziLO6ND47wfeTfNl8-x9mwFxTMeXdrlc",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAjBW7s8enqagGaX_Tl4KaXMSWJW1ywXKD0u3psWcbIHLEX63rgsAxMB63ZTv1UJzn1MKheSNRFXwr3f34Gp_YRuESFKM3l5I7mjDM1st9FZAsQ3etYwtkuXD3Uhd-8Q-HT2VwQJvlBGWvKrQfFCDS1prM8-fJA5cmoifnH-11TZPSS1DmlgyB38IieDHKITfTMM54JPaJwiDZNoy65eK15XXXeKtyKa5VmCgVh7ZkB3LqRoOd_i2rUUidi9fODehZtEbo3QCmS6Sk",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAhCBM2CzZrpfeJw1oa1wBgjQx2N7PSp6lFtD5cOYACZfUrJE13VLLOeYIYgINNMiIPfk4gEFtxi3y1UJAweZyXRYL0MBQer9FJFU_lCbvuFcJgzY8mXCiR7bdr4T08tNT7_hMjwYnW3NXF6oUiU9KRa5nLfDhiJT8EmQw2NK2Z4yhpuEEYwKbKmiRvVK_hwKbZSEC0ADBAWqCe1x_QtKjOsLsvGjNirxw5O3kznz9qKV731n1Qf-_KhxxwFHhmVYnmWr_iXLRbYXs",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCki1mhi4aOFpm-kQmYM-kQjnA7OWAGzVz3uOLngrmPjbf2sD3m6VtZy9ePoEcCrjfmZlbw9lxFy25KxtAg6jQ7VQ3XwQwMTVzcBkI8hHLu_zD222h5aTraGX80duf3_13mMbQH7bO2F0mnwMGrddTKUUQZM9XyEJWGD11oIBNTLoghPi6d9tmSKBZyuPHxDpepN3kA4S4N0QaYLKfKHKFpH8S2oJd1dFcs0tBzD3SRbtxiPBJ0qeBrdVLBRu7SaDXmFuU8JjnH968"
      ],
      colors: [],
      sizes: ["XS", "S", "M", "L"],
      status: "active",
      featured: true,
      category: "womenswear"
    } as unknown as Product;
  }
  
  try {
    const sql = getDb();
    const results = await sql`SELECT * FROM products WHERE id = ${id} AND status = 'active' LIMIT 1`;
    return results[0] as Product | undefined;
  } catch(e) {
    return undefined;
  }
}

export default async function ProductDetailsPage({ params }: Props) {
  const { id } = await params;
  const p = await getProductById(id);
  if (!p) notFound();

  let reviews: any[] = [];
  try {
    const sql = getDb();
    reviews = await sql`SELECT * FROM reviews WHERE product_id = ${p.id} ORDER BY created_at DESC LIMIT 10`;
  } catch(e) {}

  const avgRating = reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : "4.9";
  const displayReviews = reviews.length > 0 ? reviews : [
    { user_name: "Eleanor A.", rating: 5, comment: "The quality is unparalleled. It has a weight to it that you simply don't find in modern luxury anymore. A true heirloom piece." },
    { user_name: "Margaux W.", rating: 5, comment: "I wore this for an event and received endless compliments. The drape is spectacular. Fits true to size but with a generous drape." },
    { user_name: "Sophia J.", rating: 5, comment: "Exquisite packaging and even better garment. You can tell it was made by artisans who care. Seamless buying experience." },
  ];

  return (
    <div className="w-full">
      <main className="pb-20">
        {/* Product Header & Main Section */}
        <section className="max-w-[1440px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-16 mt-12">
          {/* Image Gallery */}
          <div className="lg:col-span-7 grid grid-cols-12 gap-4">
            {/* Thumbnails */}
            <div className="col-span-2 space-y-4 hidden md:block">
              {(p.images && p.images.length > 1 ? p.images.slice(0, 3) : [p.images?.[0] || '']).map((img, idx) => (
                <div key={idx} className="aspect-[3/4] bg-surface-container-high rounded-xl overflow-hidden cursor-pointer hover:ring-2 ring-primary transition-all">
                  <img src={img || 'https://via.placeholder.com/300x400'} alt={`${p.name} - Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            {/* Main Image */}
            <div className="col-span-12 md:col-span-10 relative group cursor-zoom-in">
              <div className="aspect-[3/4] bg-surface-container-low rounded-xl overflow-hidden">
                <img 
                  src={p.images?.[0] || 'https://via.placeholder.com/800x1200'} 
                  alt={p.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                />
              </div>
              <div className="absolute bottom-6 right-6 bg-surface-container-lowest/80 backdrop-blur-md p-3 rounded-full shadow-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-on-surface">zoom_in</span>
              </div>
            </div>
          </div>

          {/* Product Interaction */}
          <div className="lg:col-span-5 flex flex-col space-y-8">
            <div>
              {p.new_arrival ? (
                <span className="text-primary font-label font-semibold tracking-wider text-xs uppercase">New Arrival</span>
              ) : p.featured ? (
                <span className="text-primary font-label font-semibold tracking-wider text-xs uppercase">Limited Release</span>
              ) : (
                <span className="text-primary font-label font-semibold tracking-wider text-xs uppercase">Core Collection</span>
              )}
              <h1 className="text-4xl lg:text-5xl font-headline font-bold text-on-surface mt-2 tracking-tight">{p.name}</h1>
              <div className="flex items-end gap-3 mt-4">
                <p className="text-2xl font-headline text-on-surface-variant font-medium">${p.price.toLocaleString()}</p>
                {p.original_price && (
                  <p className="text-lg text-outline line-through mb-0.5">${p.original_price.toLocaleString()}</p>
                )}
              </div>
            </div>

            <p className="text-on-surface-variant leading-relaxed font-body text-lg">
              {p.description || "An architectural approach to fluidity. This piece is crafted from premium materials, designed to move with the body like a second skin."}
            </p>

            {/* Configuration */}
            <div className="space-y-6">
              {p.colors && p.colors.length > 0 ? (
                <div>
                  <label className="font-label font-bold text-sm tracking-wide block mb-3 uppercase">Color</label>
                  <div className="flex gap-3">
                    {p.colors.map((c, i) => (
                      <button key={i} title={c.name} className="w-10 h-10 rounded-full border border-outline-variant hover:ring-2 ring-primary ring-offset-2 transition-all shadow-sm" style={{ backgroundColor: c.hex }}></button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="font-label font-bold text-sm tracking-wide block mb-3 uppercase">Color: Crème Glacée</label>
                  <div className="flex gap-3">
                    <button className="w-10 h-10 rounded-full bg-[#f5f5f0] border-2 border-primary ring-2 ring-offset-2 ring-transparent transition-all shadow-sm"></button>
                    <button className="w-10 h-10 rounded-full bg-[#1a1a1a] border-2 border-transparent hover:border-outline-variant transition-all shadow-sm"></button>
                    <button className="w-10 h-10 rounded-full bg-[#3d4849] border-2 border-transparent hover:border-outline-variant transition-all shadow-sm"></button>
                  </div>
                </div>
              )}

              <div>
                <div className="flex justify-between items-end mb-3">
                  <label className="font-label font-bold text-sm tracking-wide uppercase">Select Size</label>
                  <button className="text-xs text-primary underline underline-offset-4 font-medium uppercase">Size Guide</button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {(p.sizes && p.sizes.length > 0 ? p.sizes : ['XS', 'S', 'M', 'L']).map((s, idx) => (
                    <button key={s} className={`py-3 text-sm rounded transition-colors ${idx === 1 ? 'font-semibold bg-primary text-on-primary' : 'font-medium border border-outline-variant hover:bg-surface-container-low'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Add to Bag */}
            <div className="pt-4 flex flex-col space-y-4">
              <AddToBagButton product={p} selectedColor={"Muted Silk"} selectedSize={"Standard"} />
              <button className="flex items-center justify-center gap-2 py-4 text-on-surface-variant font-medium hover:text-primary transition-colors">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>favorite</span>
                <span>Add to Wishlist</span>
              </button>
            </div>

            {/* Details Accordion-style */}
            <div className="border-t border-outline-variant/30 pt-8 space-y-8">
              <section>
                <h3 className="font-headline font-bold text-lg mb-2">The Story</h3>
                <p className="text-on-surface-variant font-body text-sm leading-relaxed">
                  Inspired by the interplay of light on the Seine at dawn. Every seam is calculated to drape effortlessly, bridging the gap between structure and softness.
                </p>
              </section>
              <div className="grid grid-cols-2 gap-8">
                <section>
                  <h3 className="font-headline font-bold text-sm uppercase tracking-widest mb-2">Craftsmanship</h3>
                  <ul className="text-xs text-on-surface-variant space-y-2 list-none">
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary rounded-full"></span> Master-level tailoring</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary rounded-full"></span> Premium hardware</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary rounded-full"></span> Precision seams</li>
                  </ul>
                </section>
                <section>
                  <h3 className="font-headline font-bold text-sm uppercase tracking-widest mb-2">Composition</h3>
                  <p className="text-xs text-on-surface-variant">{p.material ? p.material : "100% Grade A Material"}<br/>Sourced from sustainable ateliers.</p>
                </section>
              </div>
            </div>
          </div>
        </section>

        {/* Complete The Look */}
        <section className="mt-32 bg-surface-container-low py-24">
          <div className="max-w-[1440px] mx-auto px-8">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl font-headline font-bold">Complete the Look</h2>
                <p className="text-on-surface-variant mt-2">Curated pairings by our master stylists.</p>
              </div>
              <button className="text-primary font-bold flex items-center gap-2 group cursor-pointer hover:underline underline-offset-4">
                Shop All Styling <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Suggestion 1 */}
              <div className="group cursor-pointer">
                <div className="aspect-[3/4] rounded-xl overflow-hidden bg-surface-container-high mb-4">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyTP9aV66Bamxd7hfASQ6BE-x-XVZwxVOCFUhtAEdsW4RlNbYYxsY5N7C4pDFcnQ29aIhhAbo92ZzFshNX9V-nrBTe3Ow2R-u7nOsbBIKh1ax7E7gLrwVj5GTV-BgwRFOvhMNyllXB5gahWiRH-MX2HeHjxLjKjVs4m8yf81sBINE6cn0172RghDjfdWsXqPsO-buOhGNXwZZ6nYRES8ehYKs9xjla5XuT8OVZVO-BbU2ZRKiP3j8C8Wkjy1qvEnUrB0R3cZ3cgAE" alt="Wool Trouser" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <h4 className="font-headline font-semibold text-on-surface">Structured Wool Trouser</h4>
                <p className="text-on-surface-variant text-sm">$650</p>
              </div>
              {/* Suggestion 2 */}
              <div className="group cursor-pointer">
                <div className="aspect-[3/4] rounded-xl overflow-hidden bg-surface-container-high mb-4">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQQqC6J6G4qWrcUuB013l9bJZPtmCv9h6eWW1GZwV1D-qlicz81LJiLRXbQ93-ywViEuud2YR3ZSx5rCI81tFbXaUrd3LZ-_Gtf3wz1y663wTgFqMR23SCbXMVeScUdBhJ0okGZ5l2jMopBU8tVYD57gBbMHy14TomArvVFqSQuE72zVZBXQnC3tIEycfqwJf3A_hbbTS5hB9TxEpQCVCmWapplLy9WM4UPswzoQul_K6wUV6y_u9hGuBQwTBFK7V6X5xAWfjVOBU" alt="Necklace" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <h4 className="font-headline font-semibold text-on-surface">Aurelia Link Necklace</h4>
                <p className="text-on-surface-variant text-sm">$1,200</p>
              </div>
              {/* Suggestion 3 */}
              <div className="group cursor-pointer">
                <div className="aspect-[3/4] rounded-xl overflow-hidden bg-surface-container-high mb-4">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmvD8RMUAQWrzLzhW0DLpyT-UUJC8lSOd-WAuVndwESESuMLntfhvGS7DudN2XWh3dMW7y3FO1uqKEZCdUFyK8Y9iik2lO2V2Nw6k6tEX4Jp_0BRh3RfkgOeQR1By8x4aGuAueJu1K3amvhLeoRUVUdnRgEyUVgUiGSwHSVSOIimbYniAg7Z2pI_DdOxJnEJ3s3-69lttE6pDmq5BJ2PqFSdsLMd38Deneo7YkUGAQgGvrA481GUb52DULfpfUcvtT7bE-vFgllWs" alt="Pump" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <h4 className="font-headline font-semibold text-on-surface">The Sculpted Pump</h4>
                <p className="text-on-surface-variant text-sm">$480</p>
              </div>
              {/* Suggestion 4 */}
              <div className="group cursor-pointer">
                <div className="aspect-[3/4] rounded-xl overflow-hidden bg-surface-container-high mb-4">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCe5cWT4X_YtcHydTrVbZifcUwURrUWQweim1QQij1N3Q9bx9utVEmmGi3LPYTER6eoGY4IXjGD2XNSOXsmSQzQnfsUkt5zaIVAwBem1hdiy-ZWQx5hYFPkeqRnulq1pKLuyCMUoCLg7fb1p3xLBfMQ-JQn9spSg01asAo21aNQBBN5hOtJuTeqFpRpHEy6-VUepqXdzUPMby95olyB66hJnCoEgv9LHBU6zFIO7s7qTxA-2MN9Jnj69ecBahOOFVSrAWsQ5-hHI_8" alt="Tote" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <h4 className="font-headline font-semibold text-on-surface">Geometric Tote</h4>
                <p className="text-on-surface-variant text-sm">$2,450</p>
              </div>
            </div>
          </div>
        </section>

        {/* Client Reviews */}
        <section className="max-w-[1440px] mx-auto px-8 mt-32">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-headline font-bold tracking-tight">Client Reviews</h2>
            <div className="flex justify-center items-center gap-1 mt-4 text-primary">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="ml-2 text-on-surface font-semibold">{avgRating} / 5.0</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {displayReviews.map((r, i) => (
              <div key={i} className="p-8 bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/10">
                <p className="text-on-surface-variant italic font-body leading-relaxed mb-6">
                  "{r.comment}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center font-bold text-on-secondary-container">
                    {r.user_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-headline font-bold text-sm">{r.user_name}</p>
                    <p className="text-xs text-on-surface-variant">Verified Purchase</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <ReviewForm productId={p.id} />
        </section>

      </main>
    </div>
  );
}
