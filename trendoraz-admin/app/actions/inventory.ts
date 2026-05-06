"use server";

import { getDb } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateQuantity(productId: number, newQuantity: number) {
  const sql = getDb();
  
  // Ensure quantity is not negative
  const quantity = Math.max(0, newQuantity);
  
  // Update quantity and automatically set status to 'out-of-stock' if 0
  const status = quantity === 0 ? "out-of-stock" : "active";

  await sql`
    UPDATE products 
    SET quantity = ${quantity}, 
        status = ${status} 
    WHERE id = ${productId}
  `;

  revalidatePath("/admin/inventory");
  revalidatePath("/admin/products");
  revalidatePath("/admin");
  
  return { success: true };
}
