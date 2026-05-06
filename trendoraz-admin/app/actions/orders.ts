"use server";

import { getDb } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(orderId: number, status: string) {
  const sql = getDb();
  
  await sql`
    UPDATE orders 
    SET status = ${status} 
    WHERE id = ${orderId}
  `;

  revalidatePath("/admin/orders");
  return { success: true };
}
