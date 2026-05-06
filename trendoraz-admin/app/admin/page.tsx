import { getDb } from "@/lib/db";
import Link from "next/link";
import { Product } from "@/lib/types";

async function getStats() {
  const sql = getDb();
  const [countResult] = await sql`SELECT COUNT(*) as count FROM products`;
  const [activeResult] = await sql`SELECT COUNT(*) as count FROM products WHERE status = 'active'`;
  const [lowStockResult] = await sql`SELECT COUNT(*) as count FROM products WHERE quantity <= 5`;
  const recent = await sql`SELECT * FROM products ORDER BY created_at DESC LIMIT 5`;
  return {
    total: Number(countResult.count),
    active: Number(activeResult.count),
    lowStock: Number(lowStockResult.count),
    recent: recent as Product[],
  };
}

const categoryLabel: Record<string, string> = {
  "mens-tshirt": "T-Shirt (Men)",
  "mens-shirt": "Shirt (Men)",
  "mens-hoodie": "Hoodie (Men)",
  "mens-jacket": "Jacket (Men)",
  "mens-jogger": "Jogger (Men)",
  "mens-jeans": "Jeans (Men)",
  "mens-shorts": "Shorts (Men)",
  "mens-cords": "Co-Ords (Men)",
  "mens-pajamas": "Pajamas (Men)",
  "mens-boxers": "Boxers (Men)",
  "womens-tshirt": "T-Shirt (Women)",
  "womens-top": "Tops (Women)",
  "womens-dress": "Dress",
  "womens-hoodie": "Hoodie (Women)",
  "womens-jacket": "Jacket (Women)",
  "womens-jeans": "Jeans (Women)",
  "womens-skirt": "Skirt",
  "womens-leggings": "Leggings",
  "womens-shorts": "Shorts (Women)",
  "womens-cords": "Co-Ords (Women)",
  "womens-pajamas": "Pajamas (Women)",
  sneakers: "Sneakers",
  watch: "Watch",
  accessories: "Accessories",
};

export default async function DashboardPage() {
  const { total, active, lowStock, recent } = await getStats();

  const statCards = [
    {
      label: "Total Products",
      value: total,
      color: "text-[#d4a853]",
      bg: "bg-[#d4a853]/10",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
        </svg>
      ),
    },
    {
      label: "Active Products",
      value: active,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      ),
    },
    {
      label: "Low Stock",
      value: lowStock,
      color: "text-red-400",
      bg: "bg-red-400/10",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      ),
    },
    {
      label: "Revenue",
      value: "—",
      color: "text-violet-400",
      bg: "bg-violet-400/10",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <line x1="12" y1="1" x2="12" y2="23"/>
          <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="bg-[#161616] border border-white/5 rounded-2xl p-5">
            <div className={`w-10 h-10 ${card.bg} ${card.color} rounded-xl flex items-center justify-center mb-4`}>
              {card.icon}
            </div>
            <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-1">{card.label}</p>
            <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Products */}
      <div className="bg-[#161616] border border-white/5 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="text-sm font-semibold text-white">Recent Products</h2>
          <Link href="/admin/products" className="text-xs text-[#d4a853] hover:underline underline-offset-2">
            View all →
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4 text-white/30">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            <p className="text-sm">No products yet.</p>
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
                  <th className="text-left px-6 py-3 font-medium">Name</th>
                  <th className="text-left px-6 py-3 font-medium">Category</th>
                  <th className="text-left px-6 py-3 font-medium">Price</th>
                  <th className="text-left px-6 py-3 font-medium">Status</th>
                  <th className="text-left px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((p) => (
                  <tr key={p.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-3">
                      {p.images?.[0] ? (
                        <img src={p.images[0]} alt={p.name} className="w-10 h-10 object-cover rounded-lg bg-white/5" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white/20">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                          </svg>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-3 text-white font-medium">{p.name}</td>
                    <td className="px-6 py-3 text-white/50">{categoryLabel[p.category] ?? p.category}</td>
                    <td className="px-6 py-3 text-[#d4a853] font-semibold">₹{p.price.toLocaleString()}</td>
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
                      <Link href={`/admin/products/${p.id}/edit`} className="text-xs text-white/40 hover:text-[#d4a853] transition-colors">
                        Edit →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
