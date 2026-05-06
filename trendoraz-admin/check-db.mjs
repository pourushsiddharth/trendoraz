import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL);

async function main() {
  const res = await sql`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public';
  `;
  console.log("Tables:", res);
}

main().catch(console.error);
