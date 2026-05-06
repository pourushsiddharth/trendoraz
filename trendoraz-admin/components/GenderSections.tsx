import React from "react";
import Link from "next/link";

const mensCategories = [
  { name: "T-Shirts", href: "/shop/mens-tshirt" },
  { name: "Shirts", href: "/shop/mens-shirt" },
  { name: "Hoodies", href: "/shop/mens-hoodie" },
  { name: "Jackets", href: "/shop/mens-jacket" },
  { name: "Joggers", href: "/shop/mens-jogger" },
  { name: "Jeans", href: "/shop/mens-jeans" },
  { name: "Shorts", href: "/shop/mens-shorts" },
  { name: "Co-Ords", href: "/shop/mens-cords" }
];

const womensCategories = [
  { name: "T-Shirts", href: "/shop/womens-tshirt" },
  { name: "Tops", href: "/shop/womens-top" },
  { name: "Dresses", href: "/shop/womens-dress" },
  { name: "Hoodies", href: "/shop/womens-hoodie" },
  { name: "Jackets", href: "/shop/womens-jacket" },
  { name: "Jeans", href: "/shop/womens-jeans" },
  { name: "Skirts", href: "/shop/womens-skirt" },
  { name: "Co-Ords", href: "/shop/womens-cords" }
];

const GenderSections = () => {
  return (
    <>
      {/* ════════ MEN'S COLLECTION ════════ */}
      <section id="men" className="gender-section">
        <div className="gender-hero-banner" style={{ backgroundImage: "url('/mens_collection_bg.png')" }}>
          <div className="gender-hero-overlay"></div>
          <div className="gender-hero-content">
            <span className="gender-label fade-up">Modern Gentleman</span>
            <h2 className="gender-title fade-up">Essential<br />Men's Wear</h2>
            <p className="gender-desc fade-up">Redefining precision-crafted urban wear for the modern gentleman.</p>
            <div className="flex justify-center gap-4 fade-up">
              <Link href="/shop/men" className="btn btn-secondary">EXPLORE ALL</Link>
            </div>
          </div>
        </div>

        <div className="category-grid-container">
          <div className="category-grid">
            {mensCategories.map((cat, idx) => (
              <div key={idx} className="category-item fade-in-scroll">
                <Link href={cat.href}>{cat.name}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ WOMEN'S COLLECTION ════════ */}
      <section id="women" className="gender-section">
        <div className="gender-hero-banner" style={{ backgroundImage: "url('/womens_collection_bg.png')" }}>
          <div className="gender-hero-overlay"></div>
          <div className="gender-hero-content">
            <span className="gender-label fade-up">Effortless Elegance</span>
            <h2 className="gender-title fade-up">Premium<br />Women's Edit</h2>
            <p className="gender-desc fade-up">Sophistication meets modern aesthetics. Curated for the bold.</p>
            <div className="flex justify-center gap-4 fade-up">
              <Link href="/shop/women" className="btn btn-secondary">EXPLORE ALL</Link>
            </div>
          </div>
        </div>

        <div className="category-grid-container">
          <div className="category-grid">
            {womensCategories.map((cat, idx) => (
              <div key={idx} className="category-item fade-in-scroll">
                <Link href={cat.href}>{cat.name}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default GenderSections;
