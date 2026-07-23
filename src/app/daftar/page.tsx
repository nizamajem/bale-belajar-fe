"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, BookOpen, KeyRound, Loader2, Mail, Sparkles } from "lucide-react";
import { FormEvent, useState } from "react";
import { GoogleAuthButton } from "@/components/google-auth-button";
import { ApiError } from "@/lib/api";
import { loginWithGoogle, registerStudent } from "@/lib/auth";

export default function DaftarPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await registerStudent(name, email, password);
      router.push("/student/onboarding");
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Gagal mendaftar. Silakan coba lagi.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSuccess(idToken: string) {
    setError(null);
    setGoogleLoading(true);
    try {
      const { isNewUser } = await loginWithGoogle(idToken);
      router.push(isNewUser ? "/student/onboarding" : "/student/dashboard");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Gagal mendaftar dengan Google. Silakan coba lagi.",
      );
      setGoogleLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center px-4 py-8 sm:px-6">
      <motion.section
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-xl lg:grid-cols-[0.9fr_1.1fr]"
        initial={{ opacity: 0, scale: 0.97 }}
      >
        <div className="bg-[#6d28d9] p-6 text-white sm:p-8">
          <Link className="flex items-center gap-3" href="/">
            <span className="grid size-11 place-items-center rounded-[8px] bg-white text-[#6d28d9] shadow-[0_6px_0_#c4b5fd]">
              <BookOpen size={24} strokeWidth={3} />
            </span>
            <span className="font-heading text-xl font-black">BaleBelajar</span>
          </Link>

          <div className="mx-auto mt-10 max-w-[250px]">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/18 px-3 py-2 text-sm font-black">
              <Sparkles size={17} />
              Gratis untuk mulai
            </span>
          </div>

          <h1 className="font-heading mt-8 text-3xl font-black leading-tight">
            Belajar Matematika jadi misi seru, bukan tugas menakutkan.
          </h1>
          <p className="mt-3 font-bold leading-7 text-white/86">
            Daftar dengan email kamu - tidak perlu menunggu sekolah. Kamu
            bisa menghubungkan akun ke sekolahmu belakangan, kapan saja.
          </p>
        </div>

        <div className="p-6 sm:p-8 lg:p-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#f5f3ff] px-3 py-2 text-sm font-black text-[#6d28d9]">
            <Sparkles size={17} />
            Daftar siswa
          </span>
          <h2 className="font-heading mt-5 text-3xl font-black">
            Mulai dalam hitungan detik
          </h2>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-2 block text-sm font-black text-slate-600">Nama lengkap</span>
              <input
                className="w-full rounded-[8px] border-2 border-slate-200 px-4 py-3 font-bold outline-none focus:border-[#6d28d9]"
                onChange={(event) => setName(event.target.value)}
                placeholder="Dimas Aditya"
                required
                value={name}
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-black text-slate-600">Email</span>
              <input
                className="w-full rounded-[8px] border-2 border-slate-200 px-4 py-3 font-bold outline-none focus:border-[#6d28d9]"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="kamu@email.com"
                required
                type="email"
                value={email}
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-black text-slate-600">Password</span>
              <input
                className="w-full rounded-[8px] border-2 border-slate-200 px-4 py-3 font-bold outline-none focus:border-[#6d28d9]"
                minLength={8}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Minimal 8 karakter"
                required
                type="password"
                value={password}
              />
            </label>

            <button
              className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#6d28d9] px-5 py-4 font-heading font-black text-white shadow-[0_7px_0_#4c1d95] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none disabled:opacity-70"
              disabled={loading}
              type="submit"
            >
              {loading ? <Loader2 className="animate-spin" size={19} /> : <Mail size={19} />}
              Daftar dengan Email
              {!loading ? <ArrowRight size={19} /> : null}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs font-black uppercase text-slate-400">
            <span className="h-px flex-1 bg-slate-100" />
            atau
            <span className="h-px flex-1 bg-slate-100" />
          </div>

          {googleLoading ? (
            <div className="flex items-center justify-center gap-2 rounded-[8px] border-2 border-slate-200 px-4 py-4 font-heading font-black text-slate-500">
              <Loader2 className="animate-spin" size={20} />
              Menyiapkan akunmu...
            </div>
          ) : (
            <GoogleAuthButton
              onError={(message) => setError(message)}
              onSuccess={handleGoogleSuccess}
            />
          )}

          {error ? (
            <p className="mt-4 rounded-[8px] bg-[#fff1f2] px-4 py-3 text-sm font-bold text-[#e11d48]">
              {error}
            </p>
          ) : null}

          <div className="mt-8 border-t border-slate-100 pt-6">
            <Link
              className="flex items-center gap-2 font-bold text-slate-500 hover:text-slate-700"
              href="/student/login"
            >
              <KeyRound size={18} />
              Sudah punya akun? Masuk di sini
            </Link>
          </div>
        </div>
      </motion.section>
    </main>
  );
}
