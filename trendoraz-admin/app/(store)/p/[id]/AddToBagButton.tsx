"use client";

import { useTransition } from "react";
import { addToCart } from "@/app/actions/cart";
import { useRouter } from "next/navigation";

export default function AddToBagButton({ 
  product,
  selectedColor,
  selectedSize 
}: { 
  product: any,
  selectedColor: string,
  selectedSize: string
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleAdd = () => {
    startTransition(async () => {
      await addToCart(product.id, selectedColor, selectedSize);
      router.push("/cart");
    });
  };

  return (
    <button 
      onClick={handleAdd}
      disabled={isPending}
      className={`bg-primary text-on-primary py-5 px-8 rounded-md font-headline font-bold text-lg tracking-wide hover:bg-primary-container transition-all shadow-md active:scale-[0.98] ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isPending ? 'Adding to Bag...' : 'Add to Bag'}
    </button>
  );
}
