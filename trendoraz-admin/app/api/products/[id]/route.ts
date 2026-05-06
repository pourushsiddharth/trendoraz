import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const sql = getDb();
  const { id } = await params;
  const result = await sql`SELECT * FROM products WHERE id = ${id}`;
  if (result.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(result[0]);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const sql = getDb();
  const { id } = await params;
  const body = await req.json();

  const {
    name, category, gender, price, original_price, sku,
    description, material, fit, sizes, colors, tags,
    images, status, featured, new_arrival, quantity,
  } = body;

  const result = await sql`
    UPDATE products SET
      name = ${name},
      category = ${category},
      gender = ${gender},
      price = ${price},
      original_price = ${original_price ?? null},
      sku = ${sku ?? null},
      description = ${description ?? null},
      material = ${material ?? null},
      fit = ${fit ?? null},
      sizes = ${sizes},
      colors = ${JSON.stringify(colors)},
      tags = ${tags},
      images = ${images},
      status = ${status},
      featured = ${featured},
      new_arrival = ${new_arrival},
      quantity = ${quantity || 0}
    WHERE id = ${id}
    RETURNING *
  `;

  if (result.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(result[0]);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const sql = getDb();
  const { id } = await params;
  await sql`DELETE FROM products WHERE id = ${id}`;
  return NextResponse.json({ success: true });
}
