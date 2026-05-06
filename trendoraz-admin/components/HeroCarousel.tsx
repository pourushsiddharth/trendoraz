"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const SLIDES = [
  {
    image: "/watch.png",
    tag: "Limited Edition",
    title: "TIMELESS PRECISION",
    description: "Discover our curated collection of luxury timepieces and sartorial essentials for the modern pioneer.",
    primaryBtn: { text: "Shop Watches", href: "/watches" },
    secondaryBtn: { text: "View Lookbook", href: "/collections" },
  },
  {
    image: "/hero1.png",
    tag: "New Arrival",
    title: "SARTORIAL EXCELLENCE",
    description: "Explore the intersection of traditional craftsmanship and contemporary urban style.",
    primaryBtn: { text: "Shop Men's", href: "/shop/men" },
    secondaryBtn: { text: "Explore Women's", href: "/shop/women" },
  },
  {
    image: "/hero2.png",
    tag: "Seasonal Edit",
    title: "AUTUMN ELEGANCE",
    description: "Premium layers and rich textures designed to elevate your presence in every season.",
    primaryBtn: { text: "View Collection", href: "/collections" },
    secondaryBtn: { text: "Style Guide", href: "/lookbook" },
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % SLIDES.length);
  const prev = () => setCurrent((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));

  const slide = SLIDES[current];

  return (
    <section className="relative w-full h-[716px] min-h-[500px] overflow-hidden bg-slate-900">
      {/* Background Images with transition */}
      {SLIDES.map((s, i) => (
        <div 
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${i === current ? "opacity-100" : "opacity-0"}`}
        >
          <img 
            className="w-full h-full object-cover opacity-80" 
            alt={s.title} 
            src={s.image}
          />
        </div>
      ))}

      {/* Content */}
      <div className="relative h-full max-w-[1440px] mx-auto px-8 flex flex-col justify-center items-start">
        <div className={`transition-all duration-500 transform ${current === 0 ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"} absolute`}>
          {/* This is tricky with multiple slides. Let's just render the current one and use a key for animation */}
        </div>
        
        {/* Actual content with key for simple re-animation on change */}
        <div key={current} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="bg-primary text-on-primary px-3 py-1 text-xs font-bold tracking-widest uppercase rounded mb-4 inline-block">
            {slide.tag}
          </span>
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter max-w-2xl leading-[0.9] mb-6">
            {slide.title}
          </h1>
          <p className="text-slate-300 text-lg md:text-xl max-w-md font-light mb-8 leading-relaxed">
            {slide.description}
          </p>
          <div className="flex gap-4">
            <Link href={slide.primaryBtn.href} className="bg-primary hover:bg-primary-container text-on-primary px-8 py-4 font-bold tracking-tight rounded-md transition-all duration-300 flex items-center gap-2">
              {slide.primaryBtn.text} <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
            <Link href={slide.secondaryBtn.href} className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/20 px-8 py-4 font-bold tracking-tight rounded-md transition-all duration-300">
              {slide.secondaryBtn.text}
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={prev}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all active:scale-90 border border-white/20"
      >
        <span className="material-symbols-outlined">chevron_left</span>
      </button>
      <button 
        onClick={next}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all active:scale-90 border border-white/20"
      >
        <span className="material-symbols-outlined">chevron_right</span>
      </button>

      {/* Carousel Dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {SLIDES.map((_, i) => (
          <div 
            key={i} 
            className={`w-12 h-1 rounded-full transition-all duration-300 ${i === current ? "bg-white" : "bg-white/30"}`}
          />
        ))}
      </div>
    </section>
  );
}
