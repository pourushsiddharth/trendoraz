import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);

async function main() {
  console.log("Updating database schema...");

  try {
    // Add quantity to products table
    await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS quantity INT NOT NULL DEFAULT 0`;
    console.log("Added quantity column to products table.");

    // Create admins table
    await sql`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log("Created admins table.");

    // Create a default admin if none exists
    // In a real app, password should be hashed. For now, we'll use a simple placeholder
    // and I'll implement hashing later if needed, but let's start with a known password.
    // Default: admin / admin123
    await sql`
      INSERT INTO admins (username, password)
      SELECT 'admin', 'admin123'
      WHERE NOT EXISTS (SELECT 1 FROM admins WHERE username = 'admin');
    `;
    console.log("Ensured default admin exists.");

  } catch (error) {
    console.error("Error updating schema:", error);
  }

  console.log("Done!");
}

main().catch(console.error);
