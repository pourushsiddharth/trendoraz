import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL);

async function main() {
  const products = await sql`
    SELECT id, name, category, brand 
    FROM products 
    LIMIT 10;
  `;
  console.log(JSON.stringify(products, null, 2));
}

main().catch(console.error);
