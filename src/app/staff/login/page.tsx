"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Lock, Mail, School, Sparkles } from "lucide-react";
import { FormEvent, useState } from "react";
import { ApiError } from "@/lib/api";
import { dashboardPathForRole, login } from "@/lib/auth";

export default function StaffLoginPage() {
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
      const user = await login(email, password);
      router.push(dashboardPathForRole(user.role));
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Email atau password belum sesuai. Periksa kembali akun sekolah.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center px-4 py-8 sm:px-6">
      <motion.section
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-xl lg:grid-cols-[0.9fr_1.1fr]"
        initial={{ opacity: 0, scale: 0.97 }}
      >
        <div className="bg-[#172033] p-6 text-white sm:p-8">
          <Link className="flex items-center gap-3" href="/staff/login">
            <span className="grid size-11 place-items-center rounded-[8px] bg-[#2563eb] text-white shadow-[0_6px_0_#1d4ed8]">
              <BookOpen size={24} strokeWidth={3} />
            </span>
            <span className="font-heading text-xl font-black">BaleBelajar</span>
          </Link>

          <span className="mt-10 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm font-black">
            <School size={17} />
            Akun sekolah
          </span>

          <h1 className="font-heading mt-6 text-3xl font-black leading-tight">
            Masuk sebagai guru atau admin sekolah.
          </h1>
          <p className="mt-3 font-bold leading-7 text-white/72">
            Pantau peta kelas, kelola sekolah, guru, siswa, dan asesmen dari
            satu dasbor.
          </p>
        </div>

        <div className="p-6 sm:p-8 lg:p-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#eff6ff] px-3 py-2 text-sm font-black text-[#2563eb]">
            <Sparkles size={17} />
            Login guru & admin
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
                  placeholder="nama@sekolah.sch.id"
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
              className="flex min-h-14 w-full items-center justify-center gap-2 rounded-[8px] bg-[#2563eb] px-5 py-4 font-heading font-black text-white shadow-[0_7px_0_#1d4ed8] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none disabled:opacity-70"
              disabled={loading}
              type="submit"
            >
              {loading ? (
                <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              ) : null}
              Masuk Akun Sekolah
              {!loading ? <ArrowRight size={19} /> : null}
            </button>
          </form>

          <p className="mt-6 text-center text-sm font-bold text-slate-400">
            Kamu siswa?{" "}
            <Link className="text-[#2563eb] hover:underline" href="/student/login">
              Masuk di halaman siswa
            </Link>
          </p>
        </div>
      </motion.section>
    </main>
  );
}
