"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Product } from "@/lib/types";

const categoryLabel: Record<string, string> = {
  "mens-tshirt": "T-Shirt (Men)", "mens-shirt": "Shirt (Men)",
  "mens-hoodie": "Hoodie (Men)", "mens-jacket": "Jacket (Men)",
  "mens-jogger": "Jogger (Men)", "mens-jeans": "Jeans (Men)",
  "mens-shorts": "Shorts (Men)", "mens-cords": "Co-Ords (Men)",
  "mens-pajamas": "Pajamas (Men)", "mens-boxers": "Boxers (Men)",
  "womens-tshirt": "T-Shirt (Women)", "womens-top": "Tops (Women)",
  "womens-dress": "Dress", "womens-hoodie": "Hoodie (Women)",
  "womens-jacket": "Jacket (Women)", "womens-jeans": "Jeans (Women)",
  "womens-skirt": "Skirt", "womens-leggings": "Leggings",
  "womens-shorts": "Shorts (Women)", "womens-cords": "Co-Ords (Women)",
  "womens-pajamas": "Pajamas (Women)", sneakers: "Sneakers",
  watch: "Watch", accessories: "Accessories",
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (filter) params.set("category", filter);
    const res = await fetch(`/api/products?${params}`);
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  }, [search, filter]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleDelete = async () => {
    if (!deleteId) return;
    await fetch(`/api/products/${deleteId}`, { method: "DELETE" });
    setDeleteId(null);
    showToast("Product deleted.");
    fetchProducts();
  };

  return (
    <div>
      <div className="bg-[#161616] border border-white/5 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-white/5">
          <h2 className="text-sm font-semibold text-white">
            All Products <span className="text-white/30 font-normal">({products.length})</span>
          </h2>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products…"
              className="bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#d4a853]/50 transition-all w-52"
            />
            <select
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-[#d4a853]/50 transition-all"
            >
              <option value="">All Categories</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="watch">Watches</option>
              <option value="sneakers">Sneakers</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="animate-spin w-6 h-6 text-[#d4a853]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22C6.48 22 2 17.52 2 12S6.48 2 12 2" strokeLinecap="round"/>
            </svg>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-white/30">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            <p className="text-sm">No products found.</p>
            <Link href="/admin/products/new" className="px-4 py-2 bg-[#d4a853] text-black text-xs font-semibold rounded-lg hover:bg-[#e0b96a] transition-colors">
              + Add First Product
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-white/30 text-xs uppercase tracking-wider border-b border-white/5">
                  <th className="text-left px-6 py-3 font-medium">Image</th>
                  <th className="text-left px-6 py-3 font-medium">Product</th>
                  <th className="text-left px-6 py-3 font-medium">Category</th>
                  <th className="text-left px-6 py-3 font-medium">Price</th>
                  <th className="text-left px-6 py-3 font-medium">Sizes</th>
                   <th className="text-left px-6 py-3 font-medium">Colors</th>
                   <th className="text-left px-6 py-3 font-medium">Stock</th>
                   <th className="text-left px-6 py-3 font-medium">Status</th>
                  <th className="text-left px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-3">
                      {p.images?.[0] ? (
                        <img src={p.images[0]} alt={p.name} className="w-11 h-11 object-cover rounded-xl bg-white/5" />
                      ) : (
                        <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center text-white/20">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                          </svg>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-3">
                      <p className="text-white font-medium">{p.name}</p>
                      {p.sku && <p className="text-white/30 text-xs mt-0.5">{p.sku}</p>}
                    </td>
                    <td className="px-6 py-3 text-white/50">{categoryLabel[p.category] ?? p.category}</td>
                    <td className="px-6 py-3">
                      <p className="text-[#d4a853] font-semibold">₹{p.price.toLocaleString()}</p>
                      {p.original_price && (
                        <p className="text-white/25 text-xs line-through">₹{p.original_price.toLocaleString()}</p>
                      )}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex flex-wrap gap-1">
                        {(p.sizes ?? []).slice(0, 4).map(s => (
                          <span key={s} className="px-1.5 py-0.5 bg-white/5 text-white/50 text-[10px] rounded">{s}</span>
                        ))}
                        {(p.sizes ?? []).length > 4 && <span className="text-white/30 text-[10px]">+{(p.sizes ?? []).length - 4}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-3">
                       <div className="flex gap-1">
                         {(p.colors ?? []).slice(0, 5).map((c, i) => (
                           <span key={i} title={c.name} className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: c.hex }} />
                         ))}
                       </div>
                     </td>
                     <td className="px-6 py-3">
                       <span className={`font-medium ${p.quantity <= 5 ? "text-red-400" : "text-white/70"}`}>
                         {p.quantity}
                       </span>
                     </td>
                     <td className="px-6 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        p.status === "active" ? "bg-emerald-400/10 text-emerald-400" :
                        p.status === "draft" ? "bg-white/10 text-white/50" :
                        "bg-red-400/10 text-red-400"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          p.status === "active" ? "bg-emerald-400" :
                          p.status === "draft" ? "bg-white/40" : "bg-red-400"
                        }`}/>
                        {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <Link href={`/admin/products/${p.id}/edit`} className="text-xs text-white/40 hover:text-[#d4a853] transition-colors">Edit</Link>
                        <button onClick={() => setDeleteId(p.id)} className="text-xs text-white/30 hover:text-red-400 transition-colors">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="w-14 h-14 bg-red-400/10 rounded-full flex items-center justify-center text-red-400 mx-auto mb-5">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                <path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
              </svg>
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Delete Product?</h3>
            <p className="text-white/40 text-sm mb-6">This action cannot be undone. The product will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 border border-white/10 text-white/60 text-sm rounded-xl hover:bg-white/5 transition-colors">
                Cancel
              </button>
              <button onClick={handleDelete} className="flex-1 py-2.5 bg-red-500 text-white text-sm font-semibold rounded-xl hover:bg-red-600 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-[#1e1e1e] border border-white/10 text-white text-sm px-5 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#d4a853] shrink-0" />
          {toast}
        </div>
      )}
    </div>
  );
}
