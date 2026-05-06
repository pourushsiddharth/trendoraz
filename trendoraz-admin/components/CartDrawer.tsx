"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { updateCartQuantity, removeFromCart, getCartItems } from "@/app/actions/cart";

export default function CartDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [items, setItems] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);

  const refreshCart = async () => {
    const data = await getCartItems();
    setItems(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      refreshCart();
    }
  }, [isOpen]);

  const handleUpdateQuantity = async (id: number, newQty: number) => {
    startTransition(async () => {
      await updateCartQuantity(id, newQty);
      await refreshCart();
    });
  };

  const handleRemove = async (id: number) => {
    startTransition(async () => {
      await removeFromCart(id);
      await refreshCart();
    });
  };

  const total = items.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-500 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white z-[70] shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.32,0,0.67,0)] ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-black/5">
            <h2 className="text-lg font-bold uppercase tracking-widest">Your Bag</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-full text-gray-400 font-medium">Loading your bag...</div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6zM3 6h18M16 10a4 4 0 01-8 0"/></svg>
                </div>
                <p className="text-gray-500 font-medium">Your bag is currently empty.</p>
                <Link href="/shop" className="text-sm font-bold uppercase tracking-widest text-black underline underline-offset-4">Start Shopping</Link>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex gap-4 group">
                  <div className="w-20 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.images?.[0] || '/placeholder.png'} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-sm font-bold uppercase tracking-tight">{item.name || 'Unknown Product'}</h4>
                          <p className="text-xs text-gray-400">{item.variant} / {item.size}</p>
                        </div>
                        <p className="text-sm font-bold">₹{Number(item.price || 0).toFixed(2)}</p>
                      </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-black/10 rounded-full px-2 py-1 gap-3 bg-gray-50">
                        <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} className="hover:text-primary transition-colors">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14"/></svg>
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                        <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} className="hover:text-primary transition-colors">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 5v14M5 12h14"/></svg>
                        </button>
                      </div>
                      <button onClick={() => handleRemove(item.id)} className="text-[10px] font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest">Remove</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-black/5 bg-gray-50">
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm font-medium text-gray-500 uppercase tracking-widest">Subtotal</span>
              <span className="text-xl font-bold">₹{total.toFixed(2)}</span>
            </div>
            <Link 
              href="/checkout" 
              className={`w-full py-4 px-6 rounded-xl text-center text-[9px] font-bold uppercase tracking-widest transition-all duration-300 ${
                items.length === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-black text-white hover:bg-[#D4FF00] hover:text-black'
              }`}
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
