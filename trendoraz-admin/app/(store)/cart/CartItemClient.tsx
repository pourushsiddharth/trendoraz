"use client";

import { useTransition } from "react";
import { updateCartQuantity, removeFromCart } from "@/app/actions/cart";

export default function CartItemClient({ 
  item 
}: { 
  item: { 
    id: number; 
    product_id: number; 
    quantity: number; 
    variant: string; 
    size: string; 
    product: any 
  } 
}) {
  const [isPending, startTransition] = useTransition();

  const p = item.product || { name: "Unknown Item", price: 0, images: [] };
  const image = p.images?.[0] || 'https://via.placeholder.com/300x400';

  return (
    <div 
      suppressHydrationWarning
      className={`flex flex-col md:flex-row gap-8 pb-12 group transition-opacity ${isPending ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <div className="w-full md:w-48 aspect-[3/4] overflow-hidden rounded-lg bg-surface-container-high">
        <img alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src={image} suppressHydrationWarning />
      </div>
      <div className="flex-1 flex flex-col justify-between py-2">
        <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-headline font-bold text-on-surface uppercase tracking-tight">{p.name}</h3>
                        <p className="text-xl font-headline font-medium">₹{Number(p.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                      </div>
          <div className="space-y-1">
            <p className="text-on-surface-variant text-sm font-label flex items-center gap-2">
              <span className="text-outline">Variant:</span> {item.variant}
            </p>
            <p className="text-on-surface-variant text-sm font-label flex items-center gap-2">
              <span className="text-outline">Size:</span> {item.size}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center border border-outline-variant/20 rounded-full px-4 py-2 bg-surface-container-lowest">
            <button 
              onClick={() => {
                startTransition(async () => {
                  try {
                    await updateCartQuantity(item.id, item.quantity - 1);
                  } catch (e) {
                    console.error("Update error:", e);
                  }
                });
              }}
              disabled={isPending}
              className="hover:text-primary transition-colors disabled:opacity-50 p-1"
              aria-label="Decrease quantity"
            >
              <span className="material-symbols-outlined text-sm">remove</span>
            </button>
            <span className="mx-6 text-sm font-bold w-4 text-center">{item.quantity}</span>
            <button 
              onClick={() => {
                startTransition(async () => {
                  try {
                    await updateCartQuantity(item.id, item.quantity + 1);
                  } catch (e) {
                    console.error("Update error:", e);
                  }
                });
              }}
              disabled={isPending}
              className="hover:text-primary transition-colors disabled:opacity-50 p-1"
              aria-label="Increase quantity"
            >
              <span className="material-symbols-outlined text-sm">add</span>
            </button>
          </div>
          
          <button 
            type="button"
            onClick={() => {
              startTransition(async () => {
                try {
                  // Direct call to the confirmed-working deletion logic
                  await updateCartQuantity(item.id, 0); 
                } catch (e) {
                  console.error("Remove failed:", e);
                }
              });
            }}
            disabled={isPending}
            className="text-on-surface-variant hover:text-error transition-all flex items-center gap-2 text-xs font-label disabled:opacity-30 py-2 px-3 hover:bg-error/5 rounded-md"
          >
            <span className="material-symbols-outlined text-lg">delete</span> 
            <span className="font-bold">REMOVE</span>
          </button>
        </div>
      </div>
    </div>
  );
}
