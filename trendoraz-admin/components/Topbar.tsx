"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const breadcrumbMap: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/products": "Products",
  "/admin/products/new": "Add Product",
  "/admin/orders": "Orders",
};

export default function Topbar() {
  const pathname = usePathname();
  const isEdit = pathname.includes("/edit");
  const title = isEdit
    ? "Edit Product"
    : breadcrumbMap[pathname] ?? "Admin";

  return (
    <header className="h-[60px] shrink-0 bg-[#111111] border-b border-white/5 flex items-center justify-between px-6 lg:px-8">
      <div className="flex items-center gap-2">
        <h1 className="text-base font-semibold text-white tracking-wide">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        {/* Clock */}
        <ClockDisplay />
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#d4a853] text-black text-sm font-semibold rounded-lg hover:bg-[#e0b96a] transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Product
        </Link>
      </div>
    </header>
  );
}

function ClockDisplay() {
  // Simple static — avoid hydration mismatch
  return (
    <span className="text-xs text-white/30 font-mono hidden sm:block">
      {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
    </span>
  );
}
