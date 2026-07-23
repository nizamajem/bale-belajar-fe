"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, KeyRound, Loader2, Mail, Sparkles } from "lucide-react";
import { FormEvent, useState } from "react";
import { GoogleAuthButton } from "@/components/google-auth-button";
import { ApiError } from "@/lib/api";
import { dashboardPathForRole, login, loginWithGoogle, studentLogin } from "@/lib/auth";

type LoginMethod = "email" | "code";

export default function StudentLoginPage() {
  const router = useRouter();
  const [method, setMethod] = useState<LoginMethod>("email");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [participantCode, setParticipantCode] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleEmailSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await login(email, password);
      router.push(dashboardPathForRole(user.role));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Email atau password salah.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCodeSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await studentLogin(participantCode);
      router.push("/student/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Kode peserta belum sesuai. Periksa kembali kode dari guru.");
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
      setError(err instanceof ApiError ? err.message : "Gagal masuk dengan Google. Silakan coba lagi.");
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
        <div className="bg-[#22c55e] p-6 text-white sm:p-8">
          <Link className="flex items-center gap-3" href="/">
            <span className="grid size-11 place-items-center rounded-[8px] bg-white text-[#16a34a] shadow-[0_6px_0_#bbf7d0]">
              <BookOpen size={24} strokeWidth={3} />
            </span>
            <span className="font-heading text-xl font-black">BaleBelajar</span>
          </Link>

          <div className="book-buddy mx-auto mt-10 max-w-[250px]">
            <div className="relative aspect-square rounded-[28px] bg-white/18">
              <div className="absolute inset-x-[18%] top-[18%] h-[62%] rounded-[24px] bg-white shadow-[0_10px_0_#bbf7d0]" />
              <div className="absolute left-[31%] top-[38%] size-7 rounded-full bg-[#172033]" />
              <div className="absolute right-[31%] top-[38%] size-7 rounded-full bg-[#172033]" />
              <div className="absolute left-1/2 top-[58%] h-5 w-16 -translate-x-1/2 rounded-b-full border-b-[7px] border-[#172033]" />
            </div>
          </div>

          <h1 className="font-heading mt-8 text-3xl font-black leading-tight">
            Masuk dengan email, lalu lanjutkan misi belajar.
          </h1>
          <p className="mt-3 font-bold leading-7 text-white/86">
            Punya kode peserta dari sekolah? Bisa dipakai juga di bawah.
          </p>
        </div>

        <div className="p-6 sm:p-8 lg:p-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#eff6ff] px-3 py-2 text-sm font-black text-[#2563eb]">
            <Sparkles size={17} />
            Login siswa
          </span>
          <h2 className="font-heading mt-5 text-3xl font-black">
            Siap mulai?
          </h2>

          <div className="mt-6 grid grid-cols-2 gap-2 rounded-[8px] bg-slate-100 p-1">
            <button
              className={[
                "rounded-[6px] py-2 font-heading font-black transition",
                method === "email" ? "bg-white text-[#22c55e] shadow-sm" : "text-slate-500",
              ].join(" ")}
              onClick={() => setMethod("email")}
              type="button"
            >
              Email
            </button>
            <button
              className={[
                "rounded-[6px] py-2 font-heading font-black transition",
                method === "code" ? "bg-white text-[#22c55e] shadow-sm" : "text-slate-500",
              ].join(" ")}
              onClick={() => setMethod("code")}
              type="button"
            >
              Kode Peserta
            </button>
          </div>

          {method === "email" ? (
            <form className="mt-6 space-y-4" onSubmit={handleEmailSubmit}>
              <label className="block">
                <span className="mb-2 block text-sm font-black text-slate-600">Email</span>
                <input
                  className="w-full rounded-[8px] border-2 border-slate-200 px-4 py-3 font-bold outline-none focus:border-[#22c55e]"
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
                  className="w-full rounded-[8px] border-2 border-slate-200 px-4 py-3 font-bold outline-none focus:border-[#22c55e]"
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Password kamu"
                  required
                  type="password"
                  value={password}
                />
              </label>

              {error ? (
                <p className="rounded-[8px] bg-[#fff1f2] px-4 py-3 text-sm font-bold text-[#e11d48]">
                  {error}
                </p>
              ) : null}

              <button
                className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#22c55e] px-5 py-4 font-heading font-black text-white shadow-[0_7px_0_#129447] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none disabled:opacity-70"
                disabled={loading}
                type="submit"
              >
                {loading ? <Loader2 className="animate-spin" size={19} /> : <Mail size={19} />}
                Masuk
                {!loading ? <ArrowRight size={19} /> : null}
              </button>
            </form>
          ) : (
            <form className="mt-6 space-y-5" onSubmit={handleCodeSubmit}>
              <label className="block">
                <span className="mb-2 block text-sm font-black text-slate-600">
                  Kode peserta
                </span>
                <span className="flex items-center gap-3 rounded-[8px] border-2 border-slate-200 px-4 py-4 shadow-[0_6px_0_#e2e8f0]">
                  <KeyRound className="text-[#22c55e]" size={22} />
                  <input
                    className="w-full border-0 bg-transparent font-heading text-xl font-black uppercase tracking-[0.08em] outline-none"
                    onChange={(event) => setParticipantCode(event.target.value)}
                    placeholder="KODE PESERTA"
                    required
                    value={participantCode}
                  />
                </span>
              </label>

              {error ? (
                <p className="rounded-[8px] bg-[#fff1f2] px-4 py-3 text-sm font-bold text-[#e11d48]">
                  {error}
                </p>
              ) : null}

              <button
                className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#22c55e] px-5 py-4 font-heading font-black text-white shadow-[0_7px_0_#129447] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none disabled:opacity-70"
                disabled={loading}
                type="submit"
              >
                {loading ? <Loader2 className="animate-spin" size={19} /> : null}
                Masuk dan lanjut
                {!loading ? <ArrowRight size={19} /> : null}
              </button>
            </form>
          )}

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

          <p className="mt-5 text-center text-sm font-bold text-slate-400">
            Belum punya akun?{" "}
            <Link className="text-[#6d28d9] hover:underline" href="/daftar">
              Daftar sekarang
            </Link>
          </p>
        </div>
      </motion.section>
    </main>
  );
}
