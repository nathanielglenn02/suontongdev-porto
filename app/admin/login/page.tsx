"use client";

import { useActionState } from "react";
import { loginAdmin } from "./actions";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAdmin, null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] px-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[10%] w-[30%] h-[40%] rounded-full bg-purple-600/10 blur-[120px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-md p-8 rounded-3xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Suontong<span className="text-blue-500">Dev</span>
          </h1>
          <p className="text-slate-400 text-sm mt-2">Dasbor Admin Portofolio</p>
        </div>

        <form action={formAction} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="password">
              Password Admin
            </label>
            <input
              type="password"
              name="password"
              id="password"
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="••••••••"
            />
          </div>

          {state?.error && (
            <div className="bg-red-500/15 border border-red-500/30 text-red-400 px-4 py-2.5 rounded-xl text-sm font-medium animate-pulse">
              {state.error}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-blue-500/20 active:scale-[0.98]"
          >
            {isPending ? "Mencoba Masuk..." : "Masuk ke Panel"}
          </button>
        </form>
      </div>
    </div>
  );
}
