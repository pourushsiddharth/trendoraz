import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);

async function main() {
  console.log("Updating orders table schema...");

  try {
    await sql`
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS customer_name VARCHAR(255),
      ADD COLUMN IF NOT EXISTS customer_phone VARCHAR(50),
      ADD COLUMN IF NOT EXISTS customer_address TEXT;
    `;
    console.log("Updated orders table with customer details.");
  } catch (error) {
    console.error("Error updating schema:", error);
  }

  console.log("Done!");
}

main().catch(console.error);
