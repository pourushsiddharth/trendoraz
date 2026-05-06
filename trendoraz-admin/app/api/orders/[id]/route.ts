import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const sql = getDb();
  const { id } = await params;
  
  try {
    const orderItems = await sql`
      SELECT oi.*, p.name as product_name 
      FROM order_items oi 
      JOIN products p ON oi.product_id = p.id 
      WHERE oi.order_id = ${id}
    `;
    return NextResponse.json(orderItems);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
