"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getCartCount } from "@/app/actions/cart";
import CartDrawer from "@/components/CartDrawer";

const BRAND_CATEGORIES = {
  "SNEAKERS": ["Nike", "Air Jordans", "Yeezys", "Zegna", "Loro Piana", "New Balance (NB)", "On Running", "Off-White", "Basketball Shoes", "Golden Goose"],
  "PERFORMANCE": ["Valentino", "Cole Haan", "Xerjoff", "Tom Ford", "Azzaro"],
  "APPAREL": ["Off-White", "Essentials", "Drew House", "Palm Angels", "Amiri", "All Saints", "Polo Ralph Lauren", "Anti Social", "Burberry", "Gucci"],
  "WATCHES": ["Cartier", "Rolex", "Franck Muller", "Patek Philippe"],
  "OTHERS": ["Hoodies", "Strategy", "WHOOP"]
};

const StoreLayout = ({ children }: { children: React.ReactNode }) => {
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [subNavTop, setSubNavTop] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileOpenCategory, setMobileOpenCategory] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);
  const pathname = usePathname();
  
  // Close sidebars on route change
  useEffect(() => {
    setIsCartOpen(false);
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    getCartCount().then(setCartCount).catch(console.error);

    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Main navbar background styling
      setScrolled(currentScrollY > 20);

      // Hide main navbar and fix sub-menu when scrolling down past the threshold
      // Show main navbar when scrolling up or at the top
      if (currentScrollY > 80) {
        const isScrollingDown = currentScrollY > lastScrollY;
        setNavHidden(isScrollingDown);
        setSubNavTop(isScrollingDown);
      } else {
        setNavHidden(false);
        setSubNavTop(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="min-h-screen" suppressHydrationWarning>
      {/* Main Navbar */}
      <header 
        className={`fixed top-0 w-full z-[60] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          scrolled ? 'bg-white/95 backdrop-blur-md border-b border-black/5' : 'bg-white'
        } ${navHidden ? '-translate-y-full' : 'translate-y-0'}`} 
        style={{ height: '80px' }}
      >
        <nav className="flex items-center justify-between px-6 md:px-16 h-full max-w-[1400px] mx-auto relative">
          <div className="nav-left flex items-center gap-4">
            {/* Hamburger Button */}
            <button 
              className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 z-[70]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className={`w-6 h-[1.5px] bg-black transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-[7.5px]' : ''}`}></span>
              <span className={`w-6 h-[1.5px] bg-black transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-6 h-[1.5px] bg-black transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-[7.5px]' : ''}`}></span>
            </button>

            <nav className="nav-links hidden md:flex gap-12">
              <Link href="/shop" className="text-[0.85rem] font-medium tracking-wide uppercase relative pb-1 hover:after:w-full after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-current after:transition-all">Shop</Link>
              <Link href="/#collections" className="text-[0.85rem] font-medium tracking-wide uppercase relative pb-1 hover:after:w-full after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-current after:transition-all">Collections</Link>
              <Link href="/#about" className="text-[0.85rem] font-medium tracking-wide uppercase relative pb-1 hover:after:w-full after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-current after:transition-all">About</Link>
            </nav>
          </div>
          
          <div className="nav-center absolute left-1/2 -translate-x-1/2">
            <Link href="/" className="logo">
              <img src="/logo.png" alt="Trendoraz" className="h-[35px] md:h-[50px] object-contain" />
            </Link>
          </div>
          
          <div className="nav-right flex gap-4 md:gap-6">
            <button className="icon-btn bg-transparent border-none text-current cursor-pointer hover:-translate-y-0.5 transition-all p-1" aria-label="Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </button>
            <button 
              className="icon-btn bg-transparent border-none text-current cursor-pointer hover:-translate-y-0.5 transition-all relative p-1" 
              aria-label="Cart"
              onClick={() => setIsCartOpen(true)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
              <span className="cart-dot absolute top-0 right-0.5 w-2 h-2 bg-[#D4FF00] rounded-full shadow-[0_0_10px_#D4FF00]"></span>
            </button>
          </div>
        </nav>

      </header>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[100] transition-all duration-500 ease-in-out ${
        isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        {/* Backdrop blur layer */}
        <div 
          className={`absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity duration-500 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
        
        {/* Menu Drawer Content */}
        <div className={`absolute left-0 top-0 bottom-0 w-[85%] max-w-[380px] bg-white shadow-[20px_0_60px_rgba(0,0,0,0.1)] transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex flex-col h-full pt-12 px-8 pb-10 overflow-y-auto">
            {/* Header inside Menu */}
            <div className="flex justify-between items-center mb-10">
              <img src="/logo.png" alt="Trendoraz" className="h-8 object-contain" />
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 -mr-2 text-gray-400 hover:text-black transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>

            <div className="flex flex-col gap-6 mb-12">
              <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-bold tracking-tight text-gray-900 hover:text-[#D4FF00] transition-colors">SHOP</Link>
              <Link href="/#collections" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-bold tracking-tight text-gray-900 hover:text-[#D4FF00] transition-colors">COLLECTIONS</Link>
              <Link href="/#about" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-bold tracking-tight text-gray-900 hover:text-[#D4FF00] transition-colors">ABOUT</Link>
            </div>
            
            <div className="mt-auto">
              <div className="text-[0.65rem] font-bold tracking-[0.3em] text-gray-400 uppercase mb-6">Explore Collections</div>
              <div className="flex flex-col gap-3">
                {Object.entries(BRAND_CATEGORIES).map(([cat, items]) => (
                  <div key={cat} className="flex flex-col gap-2">
                    <button 
                      onClick={() => setMobileOpenCategory(mobileOpenCategory === cat ? null : cat)}
                      className={`flex items-center justify-between px-5 py-3.5 rounded-2xl border transition-all group ${
                        mobileOpenCategory === cat ? 'bg-black text-white border-black' : 'bg-gray-50 text-gray-900 border-black/5 hover:border-black/20'
                      }`}
                    >
                      <span className="text-[0.8rem] font-bold tracking-wide">{cat}</span>
                      <svg 
                        width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" 
                        className={`transition-transform duration-300 ${mobileOpenCategory === cat ? 'rotate-180' : ''}`}
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    
                    <div className={`overflow-hidden transition-all duration-300 ${mobileOpenCategory === cat ? 'max-h-[800px] opacity-100 py-2' : 'max-h-0 opacity-0'}`}>
                      <div className="grid grid-cols-1 gap-1 pl-4">
                        {items.map((item) => (
                          <Link 
                            key={item} 
                            href={`/shop?brand=${encodeURIComponent(item)}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="px-4 py-2.5 text-[0.8rem] text-gray-600 hover:text-black hover:translate-x-1 transition-all"
                          >
                            {item}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>


      <main className="relative pt-[80px]">
        <div 
          className={`sub-navbar-wrapper sticky w-full border-b border-black/5 transition-all duration-300 ease-in-out z-[40] ${
            subNavTop 
              ? 'bg-white/95 backdrop-blur-md shadow-sm' 
              : 'bg-white'
          }`}
          style={{ 
            top: navHidden ? '0px' : '80px' 
          }}
        >
          <nav className="sub-navbar max-w-[1400px] mx-auto px-6 md:px-16 py-3 overflow-x-auto md:overflow-visible no-scrollbar">
            <div className="sub-nav-group flex md:justify-center items-center gap-8 md:gap-14 min-w-max">
              {Object.entries(BRAND_CATEGORIES).map(([category, items]) => (
                <div 
                  key={category} 
                  className="sub-nav-trigger relative cursor-pointer group"
                  onClick={() => {
                    setIsMobileMenuOpen(true);
                    setMobileOpenCategory(category);
                  }}
                >
                  {/* Category Title - Visible on all devices */}
                  <div className="text-[0.65rem] md:text-[0.8rem] font-bold tracking-[0.15em] md:tracking-[0.25em] text-gray-500 group-hover:text-black transition-all duration-300 py-3 flex items-center gap-1 md:gap-2 uppercase whitespace-nowrap">
                    {category}
                    <span className="w-1 h-1 bg-black/10 rounded-full group-hover:bg-black transition-colors"></span>
                  </div>
                  
                  {/* Desktop Dropdown */}
                  <div className={`hidden md:block sub-nav-dropdown absolute top-full left-1/2 -translate-x-1/2 translate-y-3 bg-white p-8 shadow-[0_30px_60px_rgba(0,0,0,0.12)] opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-500 rounded-2xl z-[100] border border-black/5 ${
                    items.length > 6 ? 'min-w-[520px]' : 'min-w-[240px]'
                  }`}>
                    <div className={`dropdown-content grid gap-x-12 gap-y-5 ${
                      items.length > 6 ? 'grid-cols-2' : 'grid-cols-1'
                    }`}>
                      {items.map((item) => (
                        <Link 
                          key={item} 
                          href={`/shop?brand=${encodeURIComponent(item)}`} 
                          className="text-[0.9rem] text-gray-500 hover:text-black hover:translate-x-1 transition-all whitespace-nowrap font-medium"
                        >
                          {item}
                        </Link>
                      ))}
                    </div>
                    <div className="mt-8 pt-6 border-t border-black/5">
                      <Link href="/shop" className="text-[0.75rem] font-extrabold tracking-widest text-black uppercase hover:opacity-70 transition-opacity flex items-center gap-2">
                        Explore All {category}
                        <span className="text-lg">→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </nav>
        </div>
        {children}
      </main>

      {/* Footer */}
      <footer className="footer bg-[#FAFAFA] border-t border-black/5 py-16 md:py-24 px-6 md:px-16 overflow-hidden">
        <div className="footer-container max-w-[1400px] mx-auto">
          <div className="footer-grid grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_2fr] gap-12 md:gap-16 mb-16 md:mb-20">
            <div className="footer-brand-column flex flex-col items-center md:items-start text-center md:text-left">
              <Link href="#" className="footer-logo mb-6 md:mb-8">
                <img src="/logo.png" alt="Trendoraz Logo" className="h-8 md:h-10 w-auto object-contain transition-all hover:-translate-y-0.5 hover:brightness-110" />
              </Link>
              <p className="footer-about text-[0.9rem] md:text-[0.95rem] text-gray-600 leading-relaxed max-w-[320px] mb-8 md:mb-10">Redefining streetwear with precision engineering and high-fashion aesthetics. Join the movement of the modern trailblazer.</p>
              <div className="footer-socials flex gap-5">
                {[1, 2, 3, 4].map((i) => (
                   <Link key={i} href="#" className="social-link flex items-center justify-center w-10 h-10 rounded-full border border-black/8 text-black hover:bg-black hover:text-white hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,0,0,0.1)] transition-all">
                    {i === 1 && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>}
                    {i === 2 && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>}
                    {i === 3 && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>}
                    {i === 4 && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>}
                   </Link>
                ))}
              </div>
            </div>

            <div className="footer-nav-column hidden md:block">
              <h3 className="footer-heading text-[0.85rem] uppercase tracking-widest font-bold mb-8">Shop</h3>
              <ul className="footer-links list-none flex flex-col gap-5">
                <li><Link href="#men-collection" className="text-[0.9rem] text-gray-600 hover:text-black hover:translate-x-2 transition-all inline-block">Men's Collection</Link></li>
                <li><Link href="#women-collection" className="text-[0.9rem] text-gray-600 hover:text-black hover:translate-x-2 transition-all inline-block">Women's Curation</Link></li>
                <li><Link href="#watches" className="text-[0.9rem] text-gray-600 hover:text-black hover:translate-x-2 transition-all inline-block">Signature Watches</Link></li>
                <li><Link href="#" className="text-[0.9rem] text-gray-600 hover:text-black hover:translate-x-2 transition-all inline-block">New Arrivals</Link></li>
              </ul>
            </div>

            <div className="footer-nav-column hidden md:block">
              <h3 className="footer-heading text-[0.85rem] uppercase tracking-widest font-bold mb-8">Support</h3>
              <ul className="footer-links list-none flex flex-col gap-5">
                <li><Link href="#" className="text-[0.9rem] text-gray-600 hover:text-black hover:translate-x-2 transition-all inline-block">Shipping & Returns</Link></li>
                <li><Link href="#" className="text-[0.9rem] text-gray-600 hover:text-black hover:translate-x-2 transition-all inline-block">Order Tracking</Link></li>
                <li><Link href="#" className="text-[0.9rem] text-gray-600 hover:text-black hover:translate-x-2 transition-all inline-block">Size Guide</Link></li>
                <li><Link href="#" className="text-[0.9rem] text-gray-600 hover:text-black hover:translate-x-2 transition-all inline-block">Contact Support</Link></li>
              </ul>
            </div>

            <div className="footer-newsletter-column">
              <h3 className="footer-heading text-[0.7rem] md:text-[0.7rem] uppercase tracking-[0.3em] font-bold mb-6 md:mb-8 text-black text-center md:text-left">Newsletter</h3>
              <p className="newsletter-text text-[0.85rem] text-gray-500 mb-6 md:mb-8 font-light leading-relaxed text-center md:text-left">Be the first to know about exclusive drops. Join the inner circle.</p>
              <form className="newsletter-form-premium relative group/form" id="footer-newsletter">
                <div className="relative flex items-center">
                  <input 
                    type="email" 
                    placeholder="ENTER YOUR EMAIL" 
                    required 
                    className="w-full bg-transparent border-b border-black/10 pb-4 text-[0.7rem] tracking-[0.2em] focus:outline-none transition-all duration-700 placeholder:text-gray-300 uppercase" 
                  />
                  <div className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-black transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-focus-within/form:w-full"></div>
                  
                  <button type="submit" className="absolute right-0 bottom-4 text-black/40 hover:text-black hover:translate-x-1 transition-all duration-300 flex items-center gap-2 group/btn">
                    <span className="text-[0.6rem] font-bold tracking-[0.2em] opacity-0 group-hover/btn:opacity-100 transition-all duration-500">JOIN</span>
                    <svg width="20" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 1L19 6L14 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M1 6H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="footer-bottom-premium mt-10 pt-10 border-t border-black/4 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="footer-copyright text-center md:text-left">
              <p className="text-[0.8rem] text-gray-400 tracking-wide font-medium">&copy; {mounted ? new Date().getFullYear() : '2026'} TRENDORAZ. CRAFTED FOR EXCELLENCE.</p>
            </div>
            <div className="footer-legal flex gap-6 md:gap-10">
              <Link href="#" className="text-[0.8rem] text-gray-400 font-medium hover:text-black transition-all">Privacy</Link>
              <Link href="#" className="text-[0.8rem] text-gray-400 font-medium hover:text-black transition-all">Terms</Link>
              <Link href="#" className="text-[0.8rem] text-gray-400 font-medium hover:text-black transition-all">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
    <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
  </>
  );
};

export default StoreLayout;
