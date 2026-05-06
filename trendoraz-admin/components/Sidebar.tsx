"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    label: "Add Product",
    href: "/admin/products/new",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
      </svg>
    ),
  },
   {
     label: "Products",
     href: "/admin/products",
     icon: (
       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
         <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
         <line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
       </svg>
     ),
   },
   {
     label: "Inventory",
     href: "/admin/inventory",
     icon: (
       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
         <path d="M21 8V5a2 2 0 00-2-2H5a2 2 0 00-2 2v3"/><path d="M21 16v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3"/><path d="M3 12h18"/><path d="M12 8v8"/>
       </svg>
     ),
   },
   {
     label: "Orders",
    href: "/admin/orders",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
        <rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/>
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[220px] shrink-0 bg-[#111111] border-r border-white/5 flex flex-col h-full overflow-y-auto">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#d4a853] rounded-lg flex items-center justify-center">
            <span className="text-black font-bold text-xs">TR</span>
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wider text-white">TRENDORAZ</p>
            <p className="text-[10px] text-white/30 uppercase tracking-widest">Admin</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="text-[10px] text-white/25 uppercase tracking-widest px-3 mb-3 mt-1">Menu</p>
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? "bg-[#d4a853]/10 text-[#d4a853]"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className={`transition-colors ${isActive ? "text-[#d4a853]" : "text-white/30 group-hover:text-white/70"}`}>
                {item.icon}
              </span>
              {item.label}
              {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#d4a853]" />}
            </Link>
          );
        })}

        <div className="!mt-6 pt-4 border-t border-white/5">
          <p className="text-[10px] text-white/25 uppercase tracking-widest px-3 mb-3">Store</p>
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              <polyline points="9,22 9,12 15,12 15,22"/>
            </svg>
            View Store
          </Link>
        </div>
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#d4a853] flex items-center justify-center text-black font-bold text-sm">A</div>
          <div>
            <p className="text-sm font-medium text-white">Admin</p>
            <p className="text-xs text-white/30">Super Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
