"use server";

import { getDb } from "@/lib/db";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function processCheckout(formData: FormData) {
  const customerName = formData.get("name") as string;
  const customerPhone = formData.get("phone") as string;
  const customerEmail = formData.get("email") as string;
  const customerAddress = formData.get("address") as string;

  if (!customerName || !customerPhone || !customerEmail || !customerAddress) {
    return { success: false, error: "All fields are required." };
  }

  const sql = getDb();
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("cart_session")?.value;

  if (!sessionId) {
    return { success: false, error: "Cart session not found." };
  }

  try {
    // 1. Get cart items with their current product data in one query
    const cartItems = await sql`
      SELECT ci.*, p.price, p.quantity as stock
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.session_id = ${sessionId}
    `;

    if (cartItems.length === 0) {
      return { success: false, error: "Your cart is empty or contains unavailable items." };
    }

    // 2. Calculate total locally
    const total = cartItems.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);

    // 3. Create order
    const [order] = await sql`
      INSERT INTO orders (user_email, total_amount, customer_name, customer_phone, customer_address, status)
      VALUES (${customerEmail}, ${total}, ${customerName}, ${customerPhone}, ${customerAddress}, 'pending')
      RETURNING id
    `;

    if (!order) throw new Error("Failed to create order record");

    // 4. Create order items & decrease product stock
    for (const item of cartItems) {
      // Insert order item
      await sql`
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES (${order.id}, ${item.product_id}, ${item.quantity}, ${item.price})
      `;

      // Update product inventory (decrement stock and update status if needed)
      await sql`
        UPDATE products 
        SET quantity = GREATEST(0, quantity - ${item.quantity}),
            status = CASE WHEN (quantity - ${item.quantity}) <= 0 THEN 'out-of-stock' ELSE status END
        WHERE id = ${item.product_id}
      `;
    }

    // 5. Clear cart
    await sql`DELETE FROM cart_items WHERE session_id = ${sessionId}`;

    revalidatePath("/cart");
    revalidatePath("/admin/orders");
    revalidatePath("/admin/inventory");

    return { success: true, orderId: order.id };
  } catch (err: any) {
    console.error("Checkout error:", err);
    return { success: false, error: err.message || "An error occurred during checkout." };
  }
}
