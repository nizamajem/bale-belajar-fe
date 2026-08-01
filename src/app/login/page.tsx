"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Lock, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { FormEvent, useState } from "react";
import { ApiError } from "@/lib/api";
import { dashboardPathForRole, login } from "@/lib/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      router.push(dashboardPathForRole());
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Email atau password belum sesuai. Periksa kembali akun admin.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center bg-[#FFF3E0] px-4 py-8 sm:px-6">
      <motion.section
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-[8px] border border-[#F1D8B4] bg-white shadow-xl lg:grid-cols-[0.9fr_1.1fr]"
        initial={{ opacity: 0, scale: 0.97 }}
      >
        <div className="bg-[#0E3A5F] p-6 text-white sm:p-8">
          <span className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-[8px] bg-[#F4B400] text-[#0E3A5F] shadow-[0_6px_0_#C28F00]">
              <BookOpen size={24} strokeWidth={3} />
            </span>
            <span className="font-heading text-xl font-black">BaleBelajar</span>
          </span>

          <span className="mt-10 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm font-black">
            <ShieldCheck size={17} />
            Admin console
          </span>

          <h1 className="font-heading mt-6 text-3xl font-black leading-tight">
            Masuk sebagai admin BaleBelajar.
          </h1>
          <p className="mt-3 font-bold leading-7 text-white/72">
            Kelola sekolah, siswa, kurikulum, dan asesmen dari satu dasbor
            admin.
          </p>
        </div>

        <div className="p-6 sm:p-8 lg:p-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#FFF3E0] px-3 py-2 text-sm font-black text-[#0E3A5F]">
            <Sparkles size={17} />
            Login admin
          </span>
          <h2 className="font-heading mt-5 text-3xl font-black">Selamat datang kembali</h2>

          <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-2 block text-sm font-black text-slate-600">
                Email
              </span>
              <span className="flex items-center gap-3 rounded-[8px] border-2 border-slate-200 px-4 py-4 shadow-[0_6px_0_#e2e8f0]">
                <Mail className="shrink-0 text-slate-400" size={20} />
                <input
                  className="w-full min-w-0 border-0 bg-transparent font-bold outline-none"
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@balebelajar.com"
                  required
                  type="email"
                  value={email}
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-black text-slate-600">
                Password
              </span>
              <span className="flex items-center gap-3 rounded-[8px] border-2 border-slate-200 px-4 py-4 shadow-[0_6px_0_#e2e8f0]">
                <Lock className="shrink-0 text-slate-400" size={20} />
                <input
                  className="w-full min-w-0 border-0 bg-transparent font-bold outline-none"
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Masukkan password"
                  required
                  type="password"
                  value={password}
                />
              </span>
            </label>

            {error ? (
              <p className="rounded-[8px] bg-[#fff1f2] px-4 py-3 text-sm font-bold text-[#e11d48]">
                {error}
              </p>
            ) : null}

            <button
              className="flex min-h-14 w-full items-center justify-center gap-2 rounded-[8px] bg-[#F4B400] px-5 py-4 font-heading font-black text-[#0E3A5F] shadow-[0_7px_0_#C28F00] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none disabled:opacity-70"
              disabled={loading}
              type="submit"
            >
              {loading ? (
                <span className="size-4 animate-spin rounded-full border-2 border-[#0E3A5F]/30 border-t-[#0E3A5F]" />
              ) : null}
              Masuk Admin
              {!loading ? <ArrowRight size={19} /> : null}
            </button>
          </form>
        </div>
      </motion.section>
    </main>
  );
}
