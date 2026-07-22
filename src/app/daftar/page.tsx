"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, KeyRound, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { GoogleAuthButton } from "@/components/google-auth-button";
import { ApiError } from "@/lib/api";
import { loginWithGoogle } from "@/lib/auth";

export default function DaftarPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGoogleSuccess(idToken: string) {
    setError(null);
    setLoading(true);
    try {
      const { isNewUser } = await loginWithGoogle(idToken);
      router.push(isNewUser ? "/student/onboarding" : "/student/dashboard");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Gagal mendaftar dengan Google. Silakan coba lagi.",
      );
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
            Daftar dengan akun Google kamu - tidak perlu menunggu sekolah.
            Kamu bisa menghubungkan akun ke sekolahmu belakangan, kapan saja.
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
          <p className="mt-3 font-bold leading-6 text-slate-500">
            Nama dan foto profilmu otomatis terisi dari akun Google.
          </p>

          <div className="mt-8">
            {loading ? (
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
          </div>

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
              Sudah punya kode peserta dari sekolah? Masuk di sini
            </Link>
          </div>
        </div>
      </motion.section>
    </main>
  );
}
