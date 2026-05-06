import { getDb } from "@/lib/db";
import { Product } from "@/lib/types";
import { notFound } from "next/navigation";
import ProductForm from "@/components/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sql = getDb();
  const result = await sql`SELECT * FROM products WHERE id = ${id}`;
  if (result.length === 0) notFound();
  const product = result[0] as Product;
  return <ProductForm initial={product} />;
}
