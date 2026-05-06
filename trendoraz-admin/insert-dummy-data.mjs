import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL);

async function main() {
  console.log("Inserting remaining products...");

  try {
      await sql`
        INSERT INTO products
          (name, category, gender, price, original_price, sku, description, material, fit,
           sizes, colors, tags, images, status, featured, new_arrival, quantity)
        VALUES
          ('Classic Chronograph Watch', 'watches', 'unisex', 199, 249, 'WT-001',
           'A timeless classic chronograph watch with genuine leather strap.', 'Stainless Steel & Leather', 'Adjustable',
           ARRAY['One Size']::text[], '["Black", "Silver"]'::jsonb, ARRAY['watch', 'accessories', 'classic']::text[],
           ARRAY['/watch.png']::text[], 'active', true, true, 50)
      `;
      console.log(`Successfully added: Classic Chronograph Watch`);
  } catch (err) {
      console.error(`Error inserting Classic Chronograph Watch:`, err.message);
  }

  try {
      await sql`
        INSERT INTO products
          (name, category, gender, price, original_price, sku, description, material, fit,
           sizes, colors, tags, images, status, featured, new_arrival, quantity)
        VALUES
          ('Luxury Rose Gold Timepiece', 'watches', 'womens', 299, 349, 'WT-002',
           'Elegant rose gold watch perfect for formal occasions.', 'Rose Gold Plated Steel', 'Adjustable',
           ARRAY['One Size']::text[], '["Rose Gold"]'::jsonb, ARRAY['watch', 'luxury', 'womens']::text[],
           ARRAY['/watch2.png']::text[], 'active', true, false, 30)
      `;
      console.log(`Successfully added: Luxury Rose Gold Timepiece`);
  } catch (err) {
      console.error(`Error inserting Luxury Rose Gold Timepiece:`, err.message);
  }

  console.log("Finished inserting remaining dummy data!");
}

main().catch(console.error);
