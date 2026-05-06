import React from "react";
import Link from "next/link";
import { getDb } from "@/lib/db";
import { getSessionId } from "@/app/actions/cart";
import CartItemClient from "./CartItemClient";
import { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const sessionId = await getSessionId();
  let cartItems: any[] = [];
  try {
    const sql = getDb();
    cartItems = await sql`SELECT * FROM cart_items WHERE session_id = ${sessionId} ORDER BY created_at DESC`;

    // Hydrate products
    if (cartItems.length > 0) {
      const productIds = cartItems.map(c => c.product_id);
      const dbProducts = await sql`SELECT * FROM products WHERE id = ANY(${productIds})`;
      
      cartItems = cartItems.map(item => {
        let p = dbProducts.find((dbp: any) => dbp.id === item.product_id);
        
        // Mock fallback check
        if (!p && item.product_id > 9000) {
          p = {
            id: item.product_id,
            name: "The Luminous Silk Blouse",
            price: 890,
            images: [
              "https://lh3.googleusercontent.com/aida-public/AB6AXuCcJ3amfn_hz1J8r1PqNCHZEWOfFj9mujhQOhCSPfa-S-imI1tLGuNO64-ecxTDxl1M-90LidAN1bX4sf9TNYdB0UgR54YjYotPJ_xl592SfIPCaTUsnq-uLMr4z0rOMNLET5rWvxn7wRTYwsdoCf0o2xzrhvXW_nsgE-RzYYcVHNw8bDOiG5Q23J0LtOsdx5sfmigg4oB6tZy40lGdJMtTTtG2z-A5-4-g9mCjDi7kwlMziLO6ND47wfeTfNl8-x9mwFxTMeXdrlc",
            ]
          };
        }
        return { ...item, product: p };
      });
      // Filter out items without products just in case
      cartItems = cartItems.filter(item => item.product);
    }
  } catch (err) {
    console.error("Cart fetch error:", err);
  }

  // Calculate Subtotal
  const subtotal = cartItems.reduce((acc, item) => acc + (Number(item.product.price) * item.quantity), 0);
  const estimatedTax = subtotal * 0.08;
  const total = subtotal + estimatedTax;

  return (
    <div className="w-full">
      <main className="pt-20 pb-20 px-6 max-w-screen-xl mx-auto min-h-[70vh]">
        {/* Editorial Header */}
        <header className="mb-16 md:mb-24 mt-12">
          <span className="text-primary font-label text-sm tracking-widest uppercase mb-4 block">Curated Selection</span>
          <h1 className="text-5xl md:text-7xl font-headline font-extrabold tracking-tighter text-on-surface max-w-2xl leading-[1.1]">
            Your Shopping Bag
          </h1>
        </header>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 border border-outline-variant/20 rounded-xl bg-surface-container-lowest">
            <h2 className="text-2xl font-headline font-bold mb-4">Your bag is empty</h2>
            <p className="text-on-surface-variant mb-8">Discover our latest collections and find your new signature piece.</p>
            <Link href="/" className="bg-primary text-on-primary py-4 px-8 rounded-md font-headline font-bold text-lg hover:bg-primary-container transition-all shadow-md">
              Explore Collections
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            {/* Items Section */}
            <div className="lg:col-span-7 space-y-12">
              {cartItems.map((item) => (
                <CartItemClient key={item.id} item={item} />
              ))}

              {/* Concierge Gift Wrapping (Bento Style) */}
              <section className="bg-surface-container-low p-8 rounded-xl flex flex-col md:flex-row items-center gap-8 border border-outline-variant/10">
                <div className="flex-1">
                  <h4 className="text-lg font-headline font-bold mb-2">Concierge Gift Wrapping</h4>
                  <p className="text-on-surface-variant text-sm leading-relaxed mb-4">
                    Each selection is housed in our signature textured linen boxes, hand-tied with silk ribbon. Includes a handwritten note of your choosing.
                  </p>
                  <button className="text-primary font-label text-sm font-semibold flex items-center gap-2 group transition-all">
                    Add Complimentary Wrapping 
                    <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </button>
                </div>
                <div className="w-full md:w-40 aspect-square bg-surface-container-highest rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-5xl text-outline-variant">featured_seasonal_and_gifts</span>
                </div>
              </section>
            </div>

            {/* Summary Section */}
            <div className="lg:col-span-5 sticky top-32">
              <div className="bg-surface-container-lowest p-8 md:p-12 rounded-xl shadow-sm border border-outline-variant/5">
                <h2 className="text-2xl font-headline font-bold mb-8 uppercase tracking-widest border-b border-outline-variant/10 pb-4">Order Summary</h2>
                
                <div className="space-y-6 mb-10">
                  <div className="flex justify-between text-on-surface-variant font-label">
                    <span>Subtotal</span>
                    <span className="text-on-surface">${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant font-label">
                    <div className="flex flex-col">
                      <span>Shipping</span>
                      <span className="text-[10px] text-primary font-bold uppercase tracking-wider">Complimentary Priority</span>
                    </div>
                    <span className="text-primary">FREE</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant font-label">
                    <span>Estimated Tax</span>
                    <span className="text-on-surface">${estimatedTax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="h-px bg-outline-variant/10 my-6"></div>
                  <div className="flex justify-between items-end">
                    <span className="text-lg font-headline font-bold uppercase tracking-widest">Total</span>
                    <span className="text-3xl font-headline font-extrabold text-primary tracking-tighter">${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </div>

                {/* CTA */}
                <Link href="/checkout" className="w-full flex items-center justify-center bg-primary text-on-primary py-6 rounded-md font-headline font-bold text-lg hover:bg-primary-container transition-all duration-300 active:scale-[0.98] shadow-lg shadow-primary/20 mb-6">
                  Proceed to Secure Checkout
                </Link>

                <div className="space-y-6 mt-12 border-t border-outline-variant/10 pt-8">
                  <div className="flex gap-4">
                    <span className="material-symbols-outlined text-primary">verified_user</span>
                    <div>
                      <h5 className="text-sm font-bold">Secure Transactions</h5>
                      <p className="text-xs text-on-surface-variant mt-1">Encrypted by industry-leading security protocols for your peace of mind.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <span className="material-symbols-outlined text-primary">local_shipping</span>
                    <div>
                      <h5 className="text-sm font-bold">Complimentary Shipping</h5>
                      <p className="text-xs text-on-surface-variant mt-1">Expedited global shipping on all orders over $500, fully insured.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Link href="/" className="text-on-surface-variant text-sm font-label hover:text-primary transition-colors underline underline-offset-4">
                  Continue Browsing Collections
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
