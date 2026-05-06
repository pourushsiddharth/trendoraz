"use client";
import { login } from "@/app/actions/auth";
import { useState } from "react";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 font-outfit">
      <div className="w-full max-w-md bg-[#161616] border border-white/5 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Admin Login</h1>
          <p className="text-white/40 text-sm">Enter your credentials to access the panel</p>
        </div>

        <form action={async (formData) => {
          const result = await login(formData);
          if (result?.error) {
            setError(result.error);
          }
        }} className="space-y-6">
          <div>
            <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">
              Username
            </label>
            <input
              name="username"
              type="text"
              required
              className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#d4a853] transition-colors"
              placeholder="admin"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#d4a853] transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-red-400/10 border border-red-400/20 text-red-400 text-xs p-3 rounded-lg text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#d4a853] text-black font-semibold py-2 rounded-lg hover:bg-[#e0b96a] transition-colors"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
