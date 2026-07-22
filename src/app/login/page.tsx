"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  School,
  Sparkles,
  UserRound,
} from "lucide-react";
import { FormEvent, useState } from "react";
import { GoogleAuthButton } from "@/components/google-auth-button";
import { ApiError } from "@/lib/api";
import {
  dashboardPathForRole,
  login,
  loginWithGoogle,
  studentLogin,
} from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [participantCode, setParticipantCode] = useState("");
  const [studentError, setStudentError] = useState<string | null>(null);
  const [studentLoading, setStudentLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [staffError, setStaffError] = useState<string | null>(null);
  const [staffLoading, setStaffLoading] = useState(false);

  async function handleStudentSubmit(event: FormEvent) {
    event.preventDefault();
    setStudentError(null);
    setStudentLoading(true);
    try {
      await studentLogin(participantCode);
      router.push("/student/dashboard");
    } catch (err) {
      setStudentError(
        err instanceof ApiError
          ? err.message
          : "Kode peserta belum sesuai. Cek lagi kode dari guru.",
      );
    } finally {
      setStudentLoading(false);
    }
  }

  async function handleGoogleSuccess(idToken: string) {
    setStudentError(null);
    setGoogleLoading(true);
    try {
      const { isNewUser } = await loginWithGoogle(idToken);
      router.push(isNewUser ? "/student/onboarding" : "/student/dashboard");
    } catch (err) {
      setStudentError(
        err instanceof ApiError
          ? err.message
          : "Gagal masuk dengan Google. Silakan coba lagi.",
      );
      setGoogleLoading(false);
    }
  }

  async function handleStaffSubmit(event: FormEvent) {
    event.preventDefault();
    setStaffError(null);
    setStaffLoading(true);
    try {
      const user = await login(email, password);
      router.push(dashboardPathForRole(user.role));
    } catch (err) {
      setStaffError(
        err instanceof ApiError
          ? err.message
          : "Email atau password belum sesuai. Periksa kembali akun sekolah.",
      );
    } finally {
      setStaffLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7fbff] px-3 py-3 sm:px-6 sm:py-4 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-32px)] w-full max-w-6xl flex-col justify-center">
        <Link className="mb-3 flex w-fit items-center gap-3 sm:mb-5" href="/">
          <span className="grid size-11 place-items-center rounded-[8px] bg-[#22c55e] text-white shadow-[0_6px_0_#129447]">
            <BookOpen size={24} strokeWidth={3} />
          </span>
          <span className="font-heading text-xl font-black">BaleBelajar</span>
        </Link>

        <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
          <motion.section
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-xl"
            initial={{ opacity: 0, y: 16 }}
          >
            <div className="bg-[#22c55e] px-4 py-4 text-white sm:px-7 sm:py-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/18 px-3 py-2 text-sm font-black">
                <Sparkles size={17} />
                Masuk siswa
              </span>
              <h1 className="font-heading mt-3 text-[2rem] font-black leading-tight sm:mt-4 sm:text-5xl">
                Masuk pakai kode peserta.
              </h1>
              <p className="mt-2 max-w-2xl text-sm font-bold leading-6 text-white/88 sm:mt-3 sm:text-base sm:leading-7">
                Ini jalur utama untuk siswa. Masukkan kode dari guru, lalu
                lanjutkan misi belajar, hasil, dan peta tumbuhmu.
              </p>
            </div>

            <div className="p-4 sm:p-7">
              <form className="space-y-5" onSubmit={handleStudentSubmit}>
                <label className="block">
                  <span className="mb-2 block text-sm font-black text-slate-600">
                    Kode peserta
                  </span>
                  <span className="flex items-center gap-3 rounded-[8px] border-2 border-[#bbf7d0] bg-[#f0fdf4] px-4 py-4 shadow-[0_6px_0_#bbf7d0]">
                    <KeyRound className="shrink-0 text-[#16a34a]" size={23} />
                    <input
                      autoCapitalize="characters"
                      autoComplete="one-time-code"
                      className="w-full min-w-0 border-0 bg-transparent font-heading text-xl font-black uppercase tracking-[0.08em] text-[#172033] outline-none placeholder:text-slate-400"
                      inputMode="text"
                      onChange={(event) =>
                        setParticipantCode(event.target.value.toUpperCase())
                      }
                      placeholder="KODE PESERTA"
                      required
                      value={participantCode}
                    />
                  </span>
                </label>

                {studentError ? (
                  <p className="rounded-[8px] bg-[#fff1f2] px-4 py-3 text-sm font-bold leading-6 text-[#e11d48]">
                    {studentError}
                  </p>
                ) : null}

                <button
                  className="flex min-h-14 w-full items-center justify-center gap-2 rounded-[8px] bg-[#22c55e] px-5 py-4 font-heading font-black text-white shadow-[0_7px_0_#129447] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none disabled:opacity-70"
                  disabled={studentLoading}
                  type="submit"
                >
                  {studentLoading ? (
                    <Loader2 className="animate-spin" size={19} />
                  ) : null}
                  Lanjut ke Beranda Siswa
                  {!studentLoading ? <ArrowRight size={19} /> : null}
                </button>
              </form>

              <div className="my-6 flex items-center gap-3 text-xs font-black uppercase text-slate-400">
                <span className="h-px flex-1 bg-slate-100" />
                atau daftar mandiri
                <span className="h-px flex-1 bg-slate-100" />
              </div>

              {googleLoading ? (
                <div className="flex min-h-14 items-center justify-center gap-2 rounded-[8px] border-2 border-slate-200 px-4 py-4 font-heading font-black text-slate-500">
                  <Loader2 className="animate-spin" size={20} />
                  Menyiapkan akunmu...
                </div>
              ) : (
                <GoogleAuthButton
                  onError={(message) => setStudentError(message)}
                  onSuccess={handleGoogleSuccess}
                />
              )}

              <p className="mt-5 text-center text-sm font-bold leading-6 text-slate-500">
                Belum punya kode dari sekolah?{" "}
                <Link className="text-[#2563eb] hover:underline" href="/daftar">
                  Daftar siswa dengan Google
                </Link>
              </p>
            </div>
          </motion.section>

          <aside className="grid gap-4">
            <section className="rounded-[8px] bg-[#172033] p-5 text-white shadow-xl sm:p-7">
              <div className="grid gap-3">
                {[
                  [UserRound, "Siswa", "Masuk cepat dengan kode peserta dari guru."],
                  [GraduationCap, "Guru", "Pantau peta kelas dan tindak lanjut belajar."],
                  [School, "Admin", "Kelola sekolah, guru, kelas, siswa, dan asesmen."],
                ].map(([Icon, title, text]) => (
                  <div
                    className="rounded-[8px] border border-white/12 bg-white/8 p-4"
                    key={title as string}
                  >
                    <Icon className="mb-3 text-[#f9c74f]" size={24} />
                    <p className="font-heading text-lg font-black">
                      {title as string}
                    </p>
                    <p className="mt-1 text-sm font-semibold leading-6 text-slate-300">
                      {text as string}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <p className="text-sm font-black uppercase text-[#2563eb]">
                Akun sekolah
              </p>
              <h2 className="font-heading mt-2 text-2xl font-black">
                Admin dan guru masuk di sini.
              </h2>
              <form className="mt-5 space-y-4" onSubmit={handleStaffSubmit}>
                <label className="block">
                  <span className="mb-2 block text-sm font-black text-slate-600">
                    Email
                  </span>
                  <span className="flex items-center gap-3 rounded-[8px] border-2 border-slate-200 bg-white px-4 py-3 shadow-[0_5px_0_#e2e8f0]">
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
                  <span className="flex items-center gap-3 rounded-[8px] border-2 border-slate-200 bg-white px-4 py-3 shadow-[0_5px_0_#e2e8f0]">
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

                {staffError ? (
                  <p className="rounded-[8px] bg-[#fff1f2] px-4 py-3 text-sm font-bold leading-6 text-[#e11d48]">
                    {staffError}
                  </p>
                ) : null}

                <button
                  className="flex min-h-12 w-full items-center justify-center gap-2 rounded-[8px] bg-[#2563eb] px-5 py-3 font-heading font-black text-white shadow-[0_6px_0_#1d4ed8] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none disabled:opacity-70"
                  disabled={staffLoading}
                  type="submit"
                >
                  {staffLoading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : null}
                  Masuk Akun Sekolah
                  {!staffLoading ? <ArrowRight size={18} /> : null}
                </button>
              </form>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
