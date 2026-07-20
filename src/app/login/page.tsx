"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, GraduationCap, Loader2, Lock, Mail, School } from "lucide-react";
import { FormEvent, useState } from "react";
import { ApiError } from "@/lib/api";
import { dashboardPathForRole, login } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("guru@balebelajar.id");
  const [password, setPassword] = useState("Guru123!");
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
      setError(err instanceof ApiError ? err.message : "Gagal masuk. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
      <section className="flex items-center px-4 py-8 sm:px-8 lg:px-12">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto w-full max-w-md"
          initial={{ opacity: 0, y: 16 }}
        >
          <Link className="mb-8 flex items-center gap-3" href="/">
            <span className="grid size-11 place-items-center rounded-[8px] bg-[#22c55e] text-white shadow-[0_6px_0_#129447]">
              <BookOpen size={24} strokeWidth={3} />
            </span>
            <span className="font-heading text-xl font-black">BaleBelajar</span>
          </Link>

          <p className="text-sm font-black uppercase text-[#2563eb]">
            Masuk platform
          </p>
          <h1 className="font-heading mt-2 text-3xl font-black leading-tight sm:text-4xl">
            Kelola asesmen dan lihat perkembangan siswa.
          </h1>
          <p className="mt-3 font-semibold leading-7 text-slate-600">
            Gunakan akun admin atau guru untuk masuk ke dashboard sekolah.
          </p>

          <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-2 block text-sm font-black text-slate-600">
                Email
              </span>
              <span className="flex items-center gap-3 rounded-[8px] border-2 border-slate-200 bg-white px-4 py-3 shadow-[0_5px_0_#e2e8f0]">
                <Mail className="text-slate-400" size={20} />
                <input
                  className="w-full border-0 bg-transparent font-bold outline-none"
                  onChange={(event) => setEmail(event.target.value)}
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
              <span className="flex items-center gap-3 rounded-[8px] border-2 border-slate-200 bg-white px-4 py-3 shadow-[0_5px_0_#e2e8f0]">
                <Lock className="text-slate-400" size={20} />
                <input
                  className="w-full border-0 bg-transparent font-bold outline-none"
                  onChange={(event) => setPassword(event.target.value)}
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
              className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#2563eb] px-5 py-4 font-heading font-black text-white shadow-[0_7px_0_#1d4ed8] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none disabled:opacity-70"
              disabled={loading}
              type="submit"
            >
              {loading ? <Loader2 className="animate-spin" size={19} /> : null}
              Masuk
              {!loading ? <ArrowRight size={19} /> : null}
            </button>
          </form>

          <div className="mt-5">
            <Link
              className="block rounded-[8px] border-2 border-[#bbf7d0] bg-[#f0fdf4] px-4 py-3 text-center font-heading font-black text-[#166534] shadow-[0_5px_0_#bbf7d0] active:translate-y-1 active:shadow-none"
              href="/student/login"
            >
              Masuk Siswa
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="hidden min-h-screen items-center bg-[#172033] px-12 text-white lg:flex">
        <div className="mx-auto max-w-lg">
          <div className="grid gap-4">
            {[
              [School, "Admin melihat sekolah, guru, siswa, dan asesmen aktif."],
              [GraduationCap, "Guru melihat peta kelas dan rekomendasi remedial."],
              [BookOpen, "Siswa mengerjakan asesmen dengan alur yang ringan."],
            ].map(([Icon, text], index) => (
              <motion.div
                animate={{ opacity: 1, x: 0 }}
                className="rounded-[8px] border border-white/12 bg-white/8 p-5"
                initial={{ opacity: 0, x: 16 }}
                key={text as string}
                transition={{ delay: index * 0.08 }}
              >
                <Icon className="mb-4 text-[#f9c74f]" size={30} />
                <p className="font-heading text-xl font-black leading-8">
                  {text as string}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
