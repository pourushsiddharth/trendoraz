import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  const sql = getDb();
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";

  // For neon, template tagging is the primary way to handle parameters safely.
  // Since we have dynamic filters, we build the base query.
  // Note: For complex dynamic queries, neon/serverless has limits on string building.
  // We'll use a safer approach for the common filters.
  
  let products;
  if (search && category) {
    products = await sql`
      SELECT * FROM products 
      WHERE (name ILIKE ${'%' + search + '%'} OR description ILIKE ${'%' + search + '%'})
      AND category ILIKE ${'%' + category + '%'}
      ORDER BY created_at DESC
    `;
  } else if (search) {
    products = await sql`
      SELECT * FROM products 
      WHERE (name ILIKE ${'%' + search + '%'} OR description ILIKE ${'%' + search + '%'})
      ORDER BY created_at DESC
    `;
  } else if (category) {
    products = await sql`
      SELECT * FROM products 
      WHERE category ILIKE ${'%' + category + '%'}
      ORDER BY created_at DESC
    `;
  } else {
    products = await sql`SELECT * FROM products ORDER BY created_at DESC`;
  }

  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const sql = getDb();
  try {
    const body = await req.json();

    const {
      name, category, gender, price, original_price, sku,
      description, material, fit, sizes, colors, tags,
      images, status, featured, new_arrival, quantity,
    } = body;

    const result = await sql`
      INSERT INTO products
        (name, category, gender, price, original_price, sku, description, material, fit,
         sizes, colors, tags, images, status, featured, new_arrival, quantity)
      VALUES
        (${name}, ${category}, ${gender}, ${price}, ${original_price ? parseInt(original_price) : null}, ${sku || null},
         ${description || null}, ${material || null}, ${fit || null},
         ${sizes}, ${JSON.stringify(colors)}, ${tags},
         ${images}, ${status}, ${featured}, ${new_arrival}, ${quantity || 0})
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (err: unknown) {
    const error = err as Error;
    console.error("POST Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

