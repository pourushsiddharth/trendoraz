"use server";
import { getDb } from "@/lib/db";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function getSessionId() {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get("cart_session")?.value;
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15);
    cookieStore.set("cart_session", sessionId, { maxAge: 60 * 60 * 24 * 30 }); // 30 days
  }
  return sessionId;
}

export async function addToCart(productId: number, variant: string = "Default", size: string = "Standard") {
  const sessionId = await getSessionId();
  const sql = getDb();

  try {
    const existing = await sql`SELECT id, quantity FROM cart_items WHERE session_id = ${sessionId} AND product_id = ${productId} AND variant = ${variant} AND size = ${size} LIMIT 1`;
    
    if (existing.length > 0) {
      await sql`UPDATE cart_items SET quantity = quantity + 1 WHERE id = ${existing[0].id}`;
    } else {
      await sql`INSERT INTO cart_items (session_id, product_id, quantity, variant, size) VALUES (${sessionId}, ${productId}, 1, ${variant}, ${size})`;
    }
    revalidatePath("/cart");
    return { success: true };
  } catch (err) {
    console.error("Add to cart error:", err);
    return { success: false, error: "Failed to add to cart" };
  }
}

export async function removeFromCart(cartItemId: number) {
  const sessionId = await getSessionId();
  const sql = getDb();
  try {
    await sql`DELETE FROM cart_items WHERE id = ${cartItemId} AND session_id = ${sessionId}`;
    revalidatePath("/cart");
    return { success: true };
  } catch (err) {
    console.error("Remove from cart error:", err);
    return { success: false };
  }
}

export async function updateCartQuantity(cartItemId: number, quantity: number) {
  const sessionId = await getSessionId();
  const sql = getDb();
  try {
    if (quantity <= 0) {
      await sql`DELETE FROM cart_items WHERE id = ${cartItemId} AND session_id = ${sessionId}`;
    } else {
      await sql`UPDATE cart_items SET quantity = ${quantity} WHERE id = ${cartItemId} AND session_id = ${sessionId}`;
    }
    revalidatePath("/cart");
    return { success: true };
  } catch(e) {
    console.error(e);
    return { success: false };
  }
}

export async function getCartItems() {
  const sessionId = await getSessionId();
  try {
    const sql = getDb();
    // Use LEFT JOIN to ensure items are returned even if product metadata is missing
    const items = await sql`
      SELECT ci.id, ci.product_id, ci.quantity, ci.variant, ci.size, p.name, p.price, p.images
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.session_id = ${sessionId}
    `;
    return items;
  } catch(e) {
    console.error("Get cart items error:", e);
    return [];
  }
}

export async function getCartCount() {
  const sessionId = await getSessionId();
  try {
    const sql = getDb();
    const [{ count }] = await sql`SELECT SUM(quantity) as count FROM cart_items WHERE session_id = ${sessionId}`;
    return Number(count || 0);
  } catch(e) {
    return 0;
  }
}
