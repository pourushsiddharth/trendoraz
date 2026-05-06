"use client";

import { useEffect, useState, useCallback } from "react";
import { updateQuantity } from "@/app/actions/inventory";
import { Product } from "@/lib/types";

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/products?search=${search}`);
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  }, [search]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleUpdate = async (id: number, currentQty: number, delta: number) => {
    const newQty = currentQty + delta;
    if (newQty < 0) return;

    try {
      await updateQuantity(id, newQty);
      setProducts(prev => prev.map(p => p.id === id ? { ...p, quantity: newQty } : p));
      showToast("Stock updated");
    } catch (err) {
      showToast("Update failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Inventory Management</h1>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search products..."
          className="bg-[#161616] border border-white/10 rounded-xl px-4 py-2 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#d4a853]/50 transition-all w-64"
        />
      </div>

      <div className="bg-[#161616] border border-white/5 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="animate-spin w-6 h-6 text-[#d4a853]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22C6.48 22 2 17.52 2 12S6.48 2 12 2" strokeLinecap="round"/>
            </svg>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-white/30">No products found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/30 text-xs uppercase tracking-wider border-b border-white/5 bg-white/[0.02]">
                <th className="text-left px-6 py-4 font-medium">Product</th>
                <th className="text-center px-6 py-4 font-medium">SKU</th>
                <th className="text-center px-6 py-4 font-medium">Current Stock</th>
                <th className="text-right px-6 py-4 font-medium">Adjust Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={p.images?.[0]} alt="" className="w-10 h-10 object-cover rounded-lg bg-white/5" />
                      <span className="text-white font-medium">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-white/40">{p.sku || "—"}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-lg font-bold ${p.quantity <= 5 ? "text-red-400" : "text-white"}`}>
                      {p.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleUpdate(p.id, p.quantity, -1)}
                        className="w-8 h-8 flex items-center justify-center bg-white/5 border border-white/10 text-white rounded-lg hover:bg-red-400/20 hover:border-red-400/50 transition-all"
                      >
                        -
                      </button>
                      <button 
                        onClick={() => handleUpdate(p.id, p.quantity, 1)}
                        className="w-8 h-8 flex items-center justify-center bg-white/5 border border-white/10 text-white rounded-lg hover:bg-emerald-400/20 hover:border-emerald-400/50 transition-all"
                      >
                        +
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-[#1e1e1e] border border-white/10 text-white text-sm px-5 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-3 animate-in slide-in-from-bottom-2">
          <span className="w-2 h-2 rounded-full bg-[#d4a853] shrink-0" />
          {toast}
        </div>
      )}
    </div>
  );
}
