export interface Product {
  id: number;
  name: string;
  category: string;
  gender: string;
  price: number;
  original_price: number | null;
  sku: string | null;
  description: string | null;
  material: string | null;
  fit: string | null;
  sizes: string[];
  colors: { name: string; hex: string }[];
  tags: string[];
  images: string[];
  status: string;
  quantity: number;
  featured: boolean;
  new_arrival: boolean;
  created_at: string;
}

export type ProductInput = Omit<Product, "id" | "created_at">;
