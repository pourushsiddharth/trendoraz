"use client";

import { useState } from "react";
import { processCheckout } from "@/app/actions/checkout";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const [successId, setSuccessId] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setError(null);
    try {
      const result = await processCheckout(formData);
      if (result.success) {
        setSuccessId(result.orderId);
        // We'll let the user see the success message for a moment before redirecting
        setTimeout(() => {
          router.push("/");
        }, 5000);
      } else {
        setError(result.error || "Something went wrong");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface-container-lowest py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-headline font-bold text-on-surface mb-4">Secure Checkout</h1>
          <p className="text-on-surface-variant">Complete your order details below</p>
        </header>

        {successId ? (
          <div className="bg-surface-container-low p-12 rounded-3xl shadow-xl border border-primary/20 text-center space-y-6 animate-fade-up">
            <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
            </div>
            <h2 className="text-3xl font-headline font-bold text-on-surface">Order Placed!</h2>
            <p className="text-on-surface-variant text-lg">
              Thank you for your purchase. Your Order ID is <span className="font-mono font-bold text-primary">#{successId}</span>
            </p>
            <p className="text-sm text-on-surface-variant/60">Redirecting you to the home page in a few seconds...</p>
            <Link href="/" className="inline-block mt-4 text-primary font-bold hover:underline">Return Home Now</Link>
          </div>
        ) : (
          <form action={handleSubmit} className="bg-surface-container-low p-8 rounded-2xl shadow-sm border border-outline-variant/10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-label text-on-surface-variant uppercase tracking-wider">Full Name</label>
              <input 
                name="name" 
                required 
                className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:border-primary transition-all" 
                placeholder="John Doe" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-label text-on-surface-variant uppercase tracking-wider">Phone Number</label>
              <input 
                name="phone" 
                type="tel" 
                required 
                className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:border-primary transition-all" 
                placeholder="+91 98765 43210" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-label text-on-surface-variant uppercase tracking-wider">Email Address</label>
            <input 
              name="email" 
              type="email" 
              required 
              className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:border-primary transition-all" 
              placeholder="john@example.com" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-label text-on-surface-variant uppercase tracking-wider">Delivery Address</label>
            <textarea 
              name="address" 
              required 
              rows={4} 
              className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:border-primary transition-all" 
              placeholder="House no, Street, Area, City, State, Pincode" 
            />
          </div>

          {error && (
            <div className="p-4 bg-red-400/10 border border-red-400/20 text-red-400 text-sm rounded-lg text-center">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isPending}
            className="w-full bg-primary text-on-primary py-5 rounded-lg font-headline font-bold text-lg hover:bg-primary-container transition-all active:scale-[0.98] shadow-lg disabled:opacity-50"
          >
            {isPending ? "Processing Order..." : "Complete Purchase"}
          </button>
        </form>
        )}
      </div>
    </div>
  );
}
