"use client";

import React, { useState, useEffect } from "react";
import { Product } from "@/lib/types";

interface WatchSectionProps {
  products: Product[];
}

const backgrounds = [
  "/watch.png",
  "/watch2.png"
];

const WatchSection = ({ products }: WatchSectionProps) => {
  const [currentBg, setCurrentBg] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <section className="watch-section">
        <div className="watch-bg-slider">
          <div 
            className="watch-bg-slide active"
            style={{ backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.6) 45%, rgba(0, 0, 0, 0) 80%), url('${backgrounds[0]}')` }}
          />
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="watch-header-section" id="watches">
        <div className="section-header fade-in-scroll">
          <h2 className="section-title">The Watch Collection</h2>
        </div>
      </section>

      <section className="watch-section fade-in-scroll">
        <div className="watch-bg-slider">
          {backgrounds.map((bg, idx) => (
            <div 
              key={idx} 
              className={`watch-bg-slide ${idx === currentBg ? "active" : ""}`}
              style={{ backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.6) 45%, rgba(0, 0, 0, 0) 80%), url('${bg}')` }}
            />
          ))}
        </div>

        <div className="watch-container">
          <div className="watch-content">
            <p className="watch-subtitle">TIMELESS PRESTIGE</p>
            <h2 className="watch-title">THE SIGNATURE<br />WATCH SERIES</h2>
            <p className="watch-desc">
              Precision engineering meets premium aesthetics. Elevate your wrist game with our meticulously crafted timepieces designed for the modern trailblazer.
            </p>
          </div>
        </div>
      </section>

      <section className="watch-cards-section">
        <div className="watch-cards-container">
          {products.slice(0, 3).map((product) => (
            <div key={product.id.toString()} className="watch-card-item">
              <img src={product.images?.[0] || ""} alt={product.name} />
              <div className="watch-card-info">
                <h3 className="watch-card-title">{product.name}</h3>
                <p className="watch-card-price">₹{product.price.toLocaleString()}</p>
              </div>
            </div>
          ))}
          {products.length === 0 && (
             <p className="text-black/50 text-center w-full">Coming Soon</p>
          )}
        </div>
      </section>
    </>
  );
};

export default WatchSection;
