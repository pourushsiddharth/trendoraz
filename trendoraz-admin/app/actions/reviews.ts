"use server";
import { getDb } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function submitReview(productId: number, email: string, name: string, rating: number, comment: string) {
  const sql = getDb();
  try {
    // 1. Check if the user has bought the item
    // In our order system, an order is tied to an email
    const hasBought = await sql`
      SELECT 1 FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_email = ${email}
      AND oi.product_id = ${productId}
      LIMIT 1;
    `;

    if (hasBought.length === 0) {
      return { success: false, error: "Only verified buyers can leave a review." };
    }

    // 2. Insert the review
    await sql`
      INSERT INTO reviews (product_id, user_name, user_email, rating, comment)
      VALUES (${productId}, ${name}, ${email}, ${rating}, ${comment})
    `;

    revalidatePath(`/p/${productId}`);
    return { success: true };
  } catch(e) {
    console.error("Failed to submit review", e);
    return { success: false, error: "An unexpected error occurred." };
  }
}
