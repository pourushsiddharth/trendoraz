"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const slides = [
  {
    image: "/hero1.png",
    subtitle: "BY ORDER OF THE PEAKY BLINDERS",
    title: "HEIRLOOM HERITAGE",
    desc: "Precision-crafted garments for the modern gentleman, inspired by timeless Birmingham traditions.",
    style: "pb-style",
    link: "/shop/men"
  },
  {
    image: "/hero2.png",
    subtitle: "STREETWEAR COLLECTION 2024",
    title: "DENIM ESSENTIALS",
    desc: "Rugged durability meets urban comfort. The new standard for metropolitan exploration.",
    style: "denim-style",
    link: "/shop/men"
  },
  {
    image: "/hero3.png",
    subtitle: "EXPECTO PATRONUM",
    title: "SIGNATURE WATCHES",
    desc: "Magic in the details. Discover the spellbinding precision of our latest signature series.",
    style: "hp-style",
    link: "/shop/watch"
  }
];

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 8000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <section className="hero-section">
      <div className="carousel-container">
        <div 
          className="carousel-track" 
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div 
              key={index} 
              className={`carousel-slide ${index === currentSlide ? "active" : ""} ${slide.style}`}
            >
              <img src={slide.image} alt={slide.title} />
              <div className="hero-left-content slide-left-anim">
                <span className={`hero-subtitle-ref ${slide.subtitle.toLowerCase().includes('peaky') ? 'pb-subtitle' : slide.subtitle.toLowerCase().includes('denim') ? 'denim-subtitle' : 'hp-subtitle'}`}>
                  {slide.subtitle}
                </span>
                <h1 className={`hero-title-ref ${slide.style === 'pb-style' ? 'pb-title' : slide.style === 'denim-style' ? 'denim-title' : 'hp-title'}`}>
                  {slide.title}
                </h1>
                <p className="hero-desc-ref">{slide.desc}</p>
                <Link href={slide.link} className="btn btn-primary mt-6">
                  <span className="btn-text">EXPLORE COLLECTION</span>
                  <span className="btn-icon">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Indicators */}
        <div className="carousel-indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? "active" : ""}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="carousel-controls">
          <button className="control-btn prev-btn" onClick={prevSlide} aria-label="Previous Slide">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 19l-7-7 7-7"/></svg>
          </button>
          <button className="control-btn next-btn" onClick={nextSlide} aria-label="Next Slide">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Carousel;
