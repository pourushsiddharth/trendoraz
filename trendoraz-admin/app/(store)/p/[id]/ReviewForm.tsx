"use client";

import { useState } from "react";
import { submitReview } from "@/app/actions/reviews";

export default function ReviewForm({ productId }: { productId: number }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const result = await submitReview(productId, email, name, rating, comment);
      if (result.success) {
        setStatus("success");
        setName("");
        setEmail("");
        setComment("");
        setRating(5);
      } else {
        setStatus("error");
        setErrorMessage(result.error || "Failed to submit review");
      }
    } catch {
      setStatus("error");
      setErrorMessage("An unexpected error occurred.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-surface-container-lowest p-8 border border-outline-variant/20 rounded-xl space-y-6 mt-12 shadow-sm">
      <h3 className="text-2xl font-headline font-bold">Leave a Review</h3>
      <p className="text-on-surface-variant text-sm">You must have purchased this item to leave a review.</p>

      {status === "success" && (
        <div className="bg-green-50 text-green-800 p-4 rounded text-sm font-medium border border-green-200">
          Your review has been successfully submitted and verified!
        </div>
      )}
      {status === "error" && (
        <div className="bg-red-50 text-red-800 p-4 rounded text-sm font-medium border border-red-200">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="font-label font-bold text-sm tracking-wide block mb-2 uppercase">Full Name</label>
          <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-surface-container-low border border-outline-variant/30 rounded p-3 focus:ring-2 ring-primary outline-none transition-all" placeholder="E.g. Eleanor A." />
        </div>
        <div>
          <label className="font-label font-bold text-sm tracking-wide block mb-2 uppercase">Order Email</label>
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-surface-container-low border border-outline-variant/30 rounded p-3 focus:ring-2 ring-primary outline-none transition-all" placeholder="Enter the email you used to buy this item" />
        </div>
      </div>

      <div>
        <label className="font-label font-bold text-sm tracking-wide block mb-2 uppercase">Rating</label>
        <div className="flex gap-2">
          {[1,2,3,4,5].map((star) => (
            <button type="button" key={star} onClick={() => setRating(star)} className={`material-symbols-outlined text-2xl transition-colors ${rating >= star ? 'text-primary outline-none' : 'text-outline-variant hover:text-primary'}`} style={{ fontVariationSettings: "'FILL' 1" }}>
              star
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="font-label font-bold text-sm tracking-wide block mb-2 uppercase">Your Thoughts</label>
        <textarea required value={comment} onChange={(e) => setComment(e.target.value)} className="w-full bg-surface-container-low border border-outline-variant/30 rounded p-3 focus:ring-2 ring-primary outline-none transition-all min-h-[120px]" placeholder="Tell us about the fit, quality, and your overall impression..."></textarea>
      </div>

      <button disabled={status === "loading"} type="submit" className="bg-primary text-on-primary py-4 px-8 rounded font-headline font-bold text-lg hover:bg-primary-container transition-all active:scale-[0.98] disabled:opacity-50">
        {status === "loading" ? "Verifying Purchase..." : "Submit Verified Review"}
      </button>
    </form>
  );
}
