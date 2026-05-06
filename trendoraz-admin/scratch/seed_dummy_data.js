const { neon } = require('@neondatabase/serverless');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const sql = neon(process.env.DATABASE_URL);

async function seed() {
  const dummyProducts = [
    // SNEAKERS
    {
      name: "Nike Air Max Pro",
      description: "Limited edition premium sneakers with superior comfort and style.",
      price: 18900,
      images: ["/dummy/nike.png"],
      category: "SNEAKERS Nike",
      gender: "unisex",
      quantity: 50,
      status: "active"
    },
    {
      name: "Air Jordan 1 Retro",
      description: "The classic silhouette that started it all. Premium leather finish.",
      price: 24500,
      images: ["/dummy/nike.png"],
      category: "SNEAKERS Air Jordans",
      gender: "unisex",
      quantity: 25,
      status: "active"
    },
    // PERFORMANCE
    {
      name: "Tom Ford Ombré Leather",
      description: "A signature scent that captures the essence of luxury performance.",
      price: 15500,
      images: ["/dummy/watch.png"], // Just as a placeholder for fragrance
      category: "PERFORMANCE Tom Ford",
      gender: "unisex",
      quantity: 30,
      status: "active"
    },
    // APPAREL
    {
      name: "Essentials Logo Hoodie",
      description: "Minimalist streetwear essential with a relaxed fit and premium feel.",
      price: 9500,
      images: ["/dummy/hoodie.png"],
      category: "APPAREL Essentials",
      gender: "unisex",
      quantity: 100,
      status: "active"
    },
    {
      name: "Off-White Industrial Belt",
      description: "The iconic streetwear accessory that defines modern fashion.",
      price: 12000,
      images: ["/dummy/hoodie.png"],
      category: "APPAREL Off-White",
      gender: "unisex",
      quantity: 40,
      status: "active"
    },
    // WATCHES
    {
      name: "Cartier Santos de Cartier",
      description: "Timeless elegance and precision engineering. A masterpiece for your wrist.",
      price: 750000,
      images: ["/dummy/watch.png"],
      category: "WATCHES Cartier",
      gender: "unisex",
      quantity: 5,
      status: "active"
    },
    {
      name: "Rolex Submariner Date",
      description: "The quintessential diver's watch, recognized for its robustness and clarity.",
      price: 1250000,
      images: ["/dummy/watch.png"],
      category: "WATCHES Rolex",
      gender: "unisex",
      quantity: 3,
      status: "active"
    }
  ];

  console.log("Seeding dummy products...");

  for (const p of dummyProducts) {
    try {
      await sql`
        INSERT INTO products (name, description, price, images, category, gender, quantity, status)
        VALUES (${p.name}, ${p.description}, ${p.price}, ${p.images}, ${p.category}, ${p.gender}, ${p.quantity}, ${p.status})
      `;
      console.log(`Inserted: ${p.name}`);
    } catch (err) {
      console.error(`Error inserting ${p.name}:`, err.message);
    }
  }

  console.log("Seeding complete!");
}

seed();
