"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { addToCart } from "@/app/actions/cart";

export const dynamic = "force-dynamic";

const HERO_SLIDES = [
  {
    id: 0,
    subtitle: "THE GENTLEMAN'S CODE",
    title: "BY ORDER OF THE\nPEAKY BLINDERS",
    description: "Tailored luxury meets Birmingham grit. Explore our exclusive heritage collection inspired by the 1920s elite.",
    image: "/hero1.png",
    accent: "#D4FF00",
    cta: "Explore Collection",
    font: "Bebas Neue, sans-serif"
  },
  {
    id: 1,
    subtitle: "URBAN ESSENTIALS",
    title: "STREETWEAR\nREDEFINED",
    description: "Crafted for comfort, designed for the streets. The ultimate denim collection is here.",
    image: "/hero2.png",
    accent: "#FFFFFF",
    cta: "Shop Now",
    font: "Bebas Neue, sans-serif"
  },
  {
    id: 2,
    subtitle: "MAGIC IN EVERY STITCH",
    title: "EXPECTO\nPATRONUM",
    description: "Authentically crafted robes for every wizard. Discover the wizarding world's finest couture.",
    image: "/hero3.png",
    accent: "#8A2BE2",
    cta: "Explore Magic",
    font: "Playfair Display, serif"
  }
];

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mounted, setMounted] = useState(false);
  const totalSlides = HERO_SLIDES.length;
  const sliderRef = useRef<HTMLDivElement>(null);
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setDbProducts(data.filter((p: any) => p.status === 'active'));
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    }
    fetchProducts();
  }, []);

  // Grab-to-scroll state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [addingId, setAddingId] = useState<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const handleAddToCart = async (productId: number) => {
    setAddingId(productId);
    try {
      const res = await addToCart(productId);
      if (!res.success) {
        alert("Failed to add to cart");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while adding to cart");
    } finally {
      setTimeout(() => setAddingId(null), 2000);
    }
  };

  const scrollSlider = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = 500;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2; // scroll-speed
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(nextSlide, 8000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  useEffect(() => {
    if (!mounted) return;

    const observerOptions = { 
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px' 
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          if (id) {
            setRevealed((prev) => ({ ...prev, [id]: true }));
            observer.unobserve(entry.target);
          }
        }
      });
    }, observerOptions);

    const timer = setTimeout(() => {
      const animatedElements = document.querySelectorAll('.fade-in-section');
      animatedElements.forEach((el) => observer.observe(el));
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [mounted]);

  const firstMarquee = ['NIKE', 'AIR JORDANS', 'YEEZYS', 'ZEGNA', 'LORO PIANA', 'NEW BALANCE', 'ON RUNNING', 'GOLDEN GOOSE', 'CARTIER', 'ROLEX', 'FRANCK MULLER', 'PATEK PHILIPPE', 'WHOOP'];
  const secondMarquee = ['OFF-WHITE', 'VALENTINO', 'COLE HAAN', 'XERJOFF', 'TOM FORD', 'AZZARO', 'ESSENTIALS', 'DREW HOUSE', 'PALM ANGELS', 'AMIRI', 'ALL SAINTS', 'POLO RALPH LAUREN', 'BURBERRY', 'GUCCI'];

  return (
    <div className="w-full">
      {/* ════════ NEW CINEMATIC HERO ════════ */}
      <section className="relative w-full h-[85vh] sm:h-screen min-h-[600px] overflow-hidden bg-black">
        {/* Background Layer */}
        {HERO_SLIDES.map((slide, i) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out flex items-center justify-center p-4 sm:p-8 ${
              currentSlide === i ? "opacity-100 z-0" : "opacity-0 z-0"
            }`}
          >
            <div
              className={`relative w-full h-full max-w-[95%] max-h-[90%] overflow-hidden rounded-[2rem] sm:rounded-[3rem] transition-all duration-1000 ease-out ${
                currentSlide === i ? "scale-100" : "scale-95"
              }`}
            >
              <img 
                src={slide.image} 
                alt={slide.title} 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
          </div>
        ))}

        {/* Content Layer */}
        <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-16 lg:px-24 max-w-[1600px] mx-auto text-white">
          <div className="max-w-[800px]">
            {HERO_SLIDES.map((slide, i) => (
              <div
                key={slide.id}
                className={currentSlide === i ? "block" : "hidden"}
              >
                <p className="overflow-hidden mb-4">
                  <span className="inline-block text-[0.7rem] sm:text-[0.9rem] tracking-[0.5em] uppercase font-medium text-[#D4FF00] animate-fade-up">
                    {slide.subtitle}
                  </span>
                </p>
                <h1 
                  className="text-[clamp(2.5rem,8vw,6.5rem)] font-black leading-[0.9] mb-8 uppercase whitespace-pre-line animate-fade-up"
                  style={{ fontFamily: slide.font, animationDelay: '200ms' }}
                >
                  {slide.title}
                </h1>
                <p 
                  className="text-base sm:text-lg text-gray-300 max-w-md mb-12 opacity-0 animate-fade-up"
                  style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
                >
                  {slide.description}
                </p>
                <div 
                  className="flex flex-wrap gap-5 opacity-0 animate-fade-up"
                  style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}
                >
                  <Link 
                    href="#shop" 
                    className="group relative flex items-center gap-3 bg-[#D4FF00] text-black px-8 py-4 rounded-full text-xs sm:text-sm font-bold uppercase tracking-widest transition-all hover:bg-white overflow-hidden"
                  >
                    <span className="relative z-10">{slide.cta}</span>
                    <svg className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Side Indicators */}
        <div className="absolute right-6 sm:right-12 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-8 items-center">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className="group flex items-center gap-4 focus:outline-none"
            >
              <span className={`text-[0.7rem] font-bold transition-all duration-300 ${currentSlide === i ? 'text-[#D4FF00] opacity-100' : 'text-white opacity-0 group-hover:opacity-60'}`}>
                0{i + 1}
              </span>
              <div className={`h-12 w-[2px] transition-all duration-500 relative bg-white/20 overflow-hidden`}>
                <div 
                  className={`absolute top-0 left-0 w-full bg-[#D4FF00] transition-all duration-[8000ms] linear ${currentSlide === i ? 'h-full' : 'h-0'}`}
                />
              </div>
            </button>
          ))}
        </div>

        {/* Bottom Nav Hint */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-white rounded-full" />
          </div>
        </div>
      </section>

      {/* ═══════ FEATURED SECTION ═══════ */}
      <section className="featured-section relative px-0 py-8 bg-[#FAFAFA] text-center overflow-hidden" id="shop">
        <div id="reveal-featured-header" className={`section-header max-w-[800px] mx-auto px-6 md:px-16 transition-all duration-1000 fade-in-section ${revealed['reveal-featured-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[30px]'}`}>
          <h2 className="section-title text-[clamp(1.4rem,4vw,3rem)] font-semibold mb-6 md:mb-16 text-black uppercase tracking-wide">New In: Collections</h2>
        </div>
        
        <div className="relative group">
          {/* Navigation Arrows */}
          <button 
            onClick={() => scrollSlider('left')}
            className="absolute -left-6 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-white border border-black/10 shadow-[0_10px_30px_rgba(0,0,0,0.1)] flex items-center justify-center text-black transition-all duration-300 hover:bg-[#D4FF00] hover:scale-110 opacity-0 group-hover:opacity-100"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button 
            onClick={() => scrollSlider('right')}
            className="absolute -right-6 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-white border border-black/10 shadow-[0_10px_30px_rgba(0,0,0,0.1)] flex items-center justify-center text-black transition-all duration-300 hover:bg-[#D4FF00] hover:scale-110 opacity-0 group-hover:opacity-100"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6 6-6"/></svg>
          </button>

          <div 
            id="reveal-featured-slider"
            ref={sliderRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className={`slider-container w-full overflow-x-auto overflow-y-hidden scroll-smooth px-6 md:px-16 py-8 transition-all duration-1000 no-scrollbar select-none fade-in-section snap-x snap-mandatory ${
              revealed['reveal-featured-slider'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[30px]'
            } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          >
            <div className="horizontal-slider flex gap-6 md:gap-8 w-max pr-6 md:pr-16">
            {dbProducts.length > 0 ? (
              dbProducts.map((p) => (
                <div key={p.id} className="slider-card flex-shrink-0 w-[80vw] sm:w-[320px] md:w-[400px] rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all duration-400 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] bg-white cursor-pointer group relative snap-center">
                  <div className="aspect-[4/5] overflow-hidden bg-[#f0f0f0] flex items-center justify-center">
                    {p.images && p.images.length > 0 ? (
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <span className="text-black/20 font-bold uppercase tracking-widest">{p.name}</span>
                    )}
                  </div>
                  <div className="card-overlay absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-white text-[1.1rem] font-bold tracking-widest uppercase mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>{p.name}</h3>
                    <p className="text-[#D4FF00] font-bold mb-4">₹{p.price}</p>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddToCart(p.id);
                      }}
                      className={`btn btn-primary inline-flex items-center justify-center gap-2 px-6 py-2 rounded-full text-[0.75rem] font-bold uppercase tracking-widest transition-all duration-300 w-max ${
                        addingId === p.id ? 'bg-green-500 text-white' : 'bg-white text-black hover:bg-[#D4FF00]'
                      }`}
                    >
                      <span>{addingId === p.id ? 'Added!' : 'Shop Now'}</span>
                      <span className="btn-icon">{addingId === p.id ? '✓' : '→'}</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              [
                { id: 1, title: 'LAUNDA LUXE EDIT', btn: 'Act Fast' },
                { id: 2, title: 'VIBRANT GEOMETRIC PRINTS', btn: 'Try Lens now' },
                { id: 3, title: 'SPRING STYLE SEARCH', btn: 'Search Now' },
                { id: 4, title: 'DENIM VERSE BADDIE', btn: 'Find Your Look' },
                { id: 5, title: 'PREMIUM STREETWEAR', btn: 'Shop Now' }
              ].map((card) => (
                <div key={card.id} className="slider-card flex-shrink-0 w-[clamp(280px,30vw,400px)] rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all duration-400 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] bg-white cursor-pointer group relative">
                  <img src={`/card${card.id}.png`} alt={card.title} className="w-full h-auto block object-cover aspect-[4/5] group-hover:scale-105 transition-transform duration-700" />
                  <div className="card-overlay absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-white text-[1.1rem] font-bold tracking-widest uppercase mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>{card.title}</h3>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddToCart(card.id);
                      }}
                      className={`btn btn-primary inline-flex items-center justify-center gap-2 px-6 py-2 rounded-full text-[0.75rem] font-bold uppercase tracking-widest transition-all duration-300 w-max ${
                        addingId === card.id ? 'bg-green-500 text-white' : 'bg-white text-black hover:bg-[#D4FF00]'
                      }`}
                    >
                      <span>{addingId === card.id ? 'Added!' : card.btn}</span>
                      <span className="btn-icon">{addingId === card.id ? '✓' : '→'}</span>
                    </button>
                  </div>
                </div>
              ))
            )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ BRANDS MARQUEE ═══════ */}
      <section className="brands-marquee-section py-8 bg-black overflow-hidden relative text-white flex flex-col gap-6" id="brands">
        <div className="marquee-wrapper flex whitespace-nowrap overflow-hidden relative w-screen">
          <div className="marquee-content flex items-center pr-8 animate-marquee">
            {firstMarquee.map((brand, i) => (
              <React.Fragment key={i}>
                <span className={`brand-item text-[clamp(2rem,4vw,3.5rem)] font-black tracking-[-0.02em] uppercase text-transparent transition-all cursor-pointer leading-[1] hover:text-white hover:scale-105 ${mounted ? 'visible' : ''}`} style={{ fontFamily: 'Outfit, sans-serif', WebkitTextStroke: '1px rgba(255,255,255,0.4)' }}>{brand}</span>
                <span className="brand-separator inline-block w-8 relative">
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#D4FF00] rounded-full"></span>
                </span>
              </React.Fragment>
            ))}
          </div>
          <div className="marquee-content flex items-center pr-8 animate-marquee" aria-hidden="true">
            {firstMarquee.map((brand, i) => (
              <React.Fragment key={i}>
                <span className={`brand-item text-[clamp(2rem,4vw,3.5rem)] font-black tracking-[-0.02em] uppercase text-transparent transition-all cursor-pointer leading-[1] hover:text-white hover:scale-105 ${mounted ? 'visible' : ''}`} style={{ fontFamily: 'Outfit, sans-serif', WebkitTextStroke: '1px rgba(255,255,255,0.4)' }}>{brand}</span>
                <span className="brand-separator inline-block w-8 relative">
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#D4FF00] rounded-full"></span>
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>
        
        <div className="marquee-wrapper wrapper-reverse flex whitespace-nowrap overflow-hidden relative w-screen mt-8">
          <div className="marquee-content marquee-reverse flex items-center pr-8 animate-marquee-reverse">
            {secondMarquee.map((brand, i) => (
              <React.Fragment key={i}>
                <span className="brand-item text-[clamp(2rem,4vw,3.5rem)] font-black tracking-[-0.02em] uppercase text-transparent transition-all cursor-pointer leading-[1] hover:text-[#D4FF00] hover:scale-105" style={{ fontFamily: 'Outfit, sans-serif', WebkitTextStroke: '1px rgba(212,255,0,0.4)' }}>{brand}</span>
                <span className="brand-separator inline-block w-8 relative">
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#8A2BE2] rounded-full"></span>
                </span>
              </React.Fragment>
            ))}
          </div>
          <div className="marquee-content marquee-reverse flex items-center pr-8 animate-marquee-reverse" aria-hidden="true">
            {secondMarquee.map((brand, i) => (
              <React.Fragment key={i}>
                <span className="brand-item text-[clamp(2rem,4vw,3.5rem)] font-black tracking-[-0.02em] uppercase text-transparent transition-all cursor-pointer leading-[1] hover:text-[#D4FF00] hover:scale-105" style={{ fontFamily: 'Outfit, sans-serif', WebkitTextStroke: '1px rgba(212,255,0,0.4)' }}>{brand}</span>
                <span className="brand-separator inline-block w-8 relative">
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#8A2BE2] rounded-full"></span>
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ MEN'S COLLECTION ═══════ */}
      <section id="men-collection" className={`gender-section men-section py-16 transition-all duration-1000 fade-in-section ${revealed['men-collection'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[30px]'}`}>
        <div className="gender-hero-banner relative h-[70vh] bg-cover bg-center bg-fixed flex items-center justify-center mb-8" style={{ backgroundImage: "url('/mens_collection_bg.png')" }}>
          <div className="gender-hero-overlay absolute inset-0 bg-gradient-to-br from-black/70 to-black/30"></div>
          <div className="gender-hero-content relative z-10 text-center text-white max-w-[700px] px-8">
            <span className="gender-label text-[0.9rem] tracking-[0.4em] text-[#D4FF00] mb-4 block">THE MODERN GENTLEMAN</span>
            <h2 className="gender-title text-[clamp(3rem,6vw,5.5rem)] leading-[1] mb-6 font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>MEN'S<br/>ESSENTIALS</h2>
            <p className="gender-desc text-[1.2rem] mb-8 opacity-90">Redefining streetwear with precision and purpose. Explore the latest in menswear.</p>
            <Link href="#" className="btn btn-secondary inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-[clamp(0.7rem,1vw,0.85rem)] font-medium uppercase tracking-wide bg-transparent border border-white text-white hover:bg-white hover:text-black transition-all">Explore All Men</Link>
          </div>
        </div>
        <div className="category-grid-container max-w-[1400px] mx-auto px-6 md:px-16">
          <div className="category-grid grid grid-cols-2 sm:grid-cols-4 md:grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4 md:gap-6">
            {['T-Shirts', 'Shirts', 'Hoodies', 'Jackets', 'Joggers', 'Jeans', 'Shorts', 'Co-Ords'].map((cat) => (
              <div key={cat} className="category-item bg-white/80 backdrop-blur border border-black/3 rounded-2xl p-5 text-center transition-all duration-400 flex items-center justify-center min-h-[80px] relative overflow-hidden hover:-translate-y-2 hover:border-[#D4FF00] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
                <Link href="#" className="text-[0.85rem] font-medium uppercase tracking-widest text-black z-10 hover:font-bold">{cat}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ WOMEN'S COLLECTION ═══════ */}
      <section id="women-collection" className={`gender-section women-section py-16 transition-all duration-1000 fade-in-section ${revealed['women-collection'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[30px]'}`}>
        <div className="gender-hero-banner relative h-[70vh] bg-cover bg-center bg-fixed flex items-center justify-center mb-8" style={{ backgroundImage: "url('/womens_collection_bg.png')" }}>
          <div className="gender-hero-overlay absolute inset-0 bg-gradient-to-br from-black/70 to-black/30"></div>
          <div className="gender-hero-content relative z-10 text-center text-white max-w-[700px] px-8">
            <span className="gender-label text-[0.9rem] tracking-[0.4em] text-[#D4FF00] mb-4 block">THE STREETWEAR DIVA</span>
            <h2 className="gender-title text-[clamp(3rem,6vw,5.5rem)] leading-[1] mb-6 font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>WOMEN'S<br/>CURATION</h2>
            <p className="gender-desc text-[1.2rem] mb-8 opacity-90">Effortless style meets bold expression. Discover your next favorite fit.</p>
            <Link href="#" className="btn btn-secondary inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-[clamp(0.7rem,1vw,0.85rem)] font-medium uppercase tracking-wide bg-transparent border border-white text-white hover:bg-white hover:text-black transition-all">Explore All Women</Link>
          </div>
        </div>
        <div className="category-grid-container max-w-[1400px] mx-auto px-6 md:px-16">
          <div className="category-grid grid grid-cols-2 sm:grid-cols-4 md:grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4 md:gap-6">
            {['T-Shirts', 'Tops', 'Dresses', 'Hoodies', 'Jackets', 'Jeans', 'Skirts', 'Co-Ords'].map((cat) => (
              <div key={cat} className="category-item bg-white/80 backdrop-blur border border-black/3 rounded-2xl p-5 text-center transition-all duration-400 flex items-center justify-center min-h-[80px] relative overflow-hidden hover:-translate-y-2 hover:border-[#D4FF00] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
                <Link href="#" className="text-[0.85rem] font-medium uppercase tracking-widest text-black z-10 hover:font-bold">{cat}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ WATCH HEADER ═══════ */}
      <section className="watch-header-section py-8 bg-[#FAFAFA] text-center" id="watches">
        <div id="reveal-watch-header" className={`section-header max-w-[800px] mx-auto px-6 md:px-16 transition-all duration-1000 fade-in-section ${revealed['reveal-watch-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[30px]'}`}>
          <h2 className="section-title text-[clamp(1.4rem,4vw,3rem)] font-semibold mb-8 md:mb-16 text-black uppercase tracking-wide">The Watch Collection</h2>
        </div>
      </section>

      {/* ═══════ WATCH SECTION ═══════ */}
      <section id="reveal-watch-main" className={`watch-section bg-black relative py-20 md:py-32 px-6 md:px-16 text-white flex justify-center lg:justify-start overflow-hidden min-h-[60vh] transition-all duration-1000 fade-in-section ${revealed['reveal-watch-main'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[30px]'}`}>
        <div className="watch-bg-slider absolute inset-0 z-0">
          <div className="watch-bg-slide absolute inset-0 bg-cover bg-center opacity-100 transition-opacity duration-1200" style={{ backgroundImage: "linear-gradient(to right, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.6) 45%, rgba(0, 0, 0, 0) 80%), url('/watch.png')" }}></div>
        </div>
        
        <div className="watch-container z-10 relative max-w-[1200px] w-full flex items-center justify-center lg:justify-start">
          <div className="watch-content flex-0-1 max-w-[600px] flex flex-col justify-center text-center lg:text-left pr-0 lg:pr-8">
            <p className="watch-subtitle text-[0.8rem] md:text-[clamp(0.8rem,1vw,1rem)] tracking-[0.3em] text-[#D4FF00] mb-4 uppercase" style={{ fontFamily: 'Outfit, sans-serif' }}>TIMELESS PRESTIGE</p>
            <h2 className="watch-title text-[clamp(1.8rem,4vw,4rem)] font-bold leading-[1.1] mb-6 md:mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>THE SIGNATURE<br/>WATCH SERIES</h2>
            <p className="watch-desc text-[0.95rem] md:text-[1.1rem] text-[#b0b0b0] mb-10 md:mb-16 max-w-full lg:max-w-[100%]" style={{ fontFamily: 'Outfit, sans-serif' }}>Precision engineering meets premium aesthetics. Elevate your wrist game with our meticulously crafted timepieces.</p>
          </div>
        </div>
      </section>

      {/* ═══════ WATCH CARDS ═══════ */}
      <section id="reveal-watch-cards" className={`watch-cards-section relative z-10 -mt-10 md:-mt-[120px] pb-20 md:pb-32 bg-transparent transition-all duration-1000 fade-in-section ${revealed['reveal-watch-cards'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[30px]'}`}>
        <div className="watch-cards-container max-w-[1200px] mx-auto flex flex-nowrap md:flex-wrap justify-start md:justify-center gap-6 md:gap-10 px-6 overflow-x-auto md:overflow-hidden no-scrollbar snap-x snap-mandatory">
            {[
              { id: 101, img: 'watch_card1.png', title: 'Apex Crimson Edition', price: '₹2,499' },
              { id: 102, img: 'watch_card2.png', title: 'Aurelius Sovereign', price: '₹3,299' },
              { id: 103, img: 'watch_card3.png', title: 'Oceanic Horizon', price: '₹2,199' }
            ].map((watch, i) => (
            <div key={i} className="watch-card relative shrink-0 w-[85vw] sm:w-[340px] h-[450px] md:h-[480px] rounded-[2rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.15)] transition-all duration-700 hover:-translate-y-5 group border border-black/[0.03] snap-center">
              {/* Background Image as the Card */}
              <img 
                src={`/${watch.img}`} 
                alt={watch.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-10 text-white">
                <p className="text-[0.6rem] tracking-[0.3em] text-[#D4FF00] uppercase mb-2 font-bold">Limited Series</p>
                <h4 className="text-[1.6rem] font-bold mb-3 leading-tight uppercase tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>{watch.title}</h4>
                <p className="text-gray-300 text-sm mb-6 font-light italic leading-relaxed">Exquisite craftsmanship meeting timeless elegance. Designed for those who lead.</p>
                <p className="text-white font-bold text-[1.3rem] mb-8">{watch.price}</p>
                <button 
                  onClick={() => handleAddToCart(watch.id)}
                  className={`inline-block w-full py-4 rounded-xl text-[0.7rem] font-bold uppercase tracking-[0.2em] text-center transition-all duration-300 ${
                    addingId === watch.id ? 'bg-green-500 text-white' : 'bg-white text-black hover:bg-[#D4FF00]'
                  }`}
                >
                  {addingId === watch.id ? 'Added!' : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
