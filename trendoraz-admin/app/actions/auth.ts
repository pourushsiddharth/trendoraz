"use server";

import { cookies } from "next/headers";
import { getDb } from "@/lib/db";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const sql = getDb();
  const [admin] = await sql`SELECT * FROM admins WHERE username = ${username}`;

  if (!admin || admin.password !== password) {
    return { error: "Invalid username or password" };
  }

  // For a real app, use a secure JWT or session token
  const cookieStore = await cookies();
  cookieStore.set("admin_session", "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 1 day
    path: "/",
  });

  redirect("/admin");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/admin/login");
}
