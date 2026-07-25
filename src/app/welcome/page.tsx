"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, GraduationCap, HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";

const roles = [
  {
    href: "/register/student",
    label: "Saya Siswa",
    description: "Daftar cepat, pilih dunia, lalu coba misi pertama.",
    icon: Sparkles,
    primary: true,
  },
  {
    href: "/register/parent",
    label: "Saya Orang Tua",
    description: "Nanti bisa melihat ringkasan saat anak mengundangmu.",
    icon: HeartHandshake,
    primary: false,
  },
  {
    href: "/register/mentor",
    label: "Saya Guru atau Mentor",
    description: "Bantu siswa lewat misi, review, dan feedback.",
    icon: GraduationCap,
    primary: false,
  },
];

export default function WelcomePage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-5 sm:px-6">
      <section className="mx-auto grid min-h-[calc(100vh-40px)] max-w-6xl gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <Link className="flex items-center gap-3" href="/welcome">
            <span className="grid size-12 place-items-center rounded-[8px] bg-[#22c55e] text-white shadow-[0_6px_0_#129447]">
              <BookOpen size={26} strokeWidth={3} />
            </span>
            <span className="font-heading text-xl font-black text-[#172033]">BaleBelajar</span>
          </Link>

          <motion.div animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 16 }}>
            <p className="mt-10 text-sm font-black uppercase text-[#2563eb]">Belajar sebagai petualangan</p>
            <h1 className="font-heading mt-3 text-4xl font-black leading-tight text-[#172033] sm:text-6xl">
              Pilih dunia, selesaikan misi, tumbuhkan kemampuanmu.
            </h1>
            <p className="mt-4 max-w-xl text-lg font-bold leading-8 text-slate-600">
              Mulai sebagai siswa tanpa menunggu sekolah, orang tua, atau mentor. Kamu bisa mengundang mereka setelah misi pertama selesai.
            </p>
          </motion.div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              className="light-trail inline-flex min-h-12 items-center gap-2 rounded-[8px] bg-[#22c55e] px-5 py-4 font-heading font-black text-white shadow-[0_7px_0_#129447] transition active:translate-y-1 active:shadow-none"
              href="/register/student"
            >
              Mulai sebagai Siswa
              <ArrowRight size={18} />
            </Link>
            <Link
              className="inline-flex min-h-12 items-center rounded-[8px] border-2 border-slate-200 bg-white px-5 py-4 font-heading font-black text-slate-700 shadow-[0_7px_0_#d8e2ef] transition active:translate-y-1 active:shadow-none"
              href="/student/login"
            >
              Masuk akun
            </Link>
          </div>
        </div>

        <div className="grid gap-3">
          {roles.map((role, index) => {
            const Icon = role.icon;
            return (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 18 }}
                key={role.label}
                transition={{ delay: index * 0.06 }}
              >
                <Link
                  className={[
                    "interactive-card flex min-h-28 items-center gap-4 rounded-[8px] border-2 p-4 shadow-sm transition focus:outline-none focus:ring-4 focus:ring-[#bfdbfe]",
                    role.primary
                      ? "border-[#22c55e] bg-[#f0fdf4]"
                      : "border-slate-200 bg-white",
                  ].join(" ")}
                  href={role.href}
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-[8px] bg-white text-[#2563eb] shadow-sm">
                    <Icon size={24} />
                  </span>
                  <span className="min-w-0">
                    <span className="font-heading text-xl font-black text-[#172033]">{role.label}</span>
                    <span className="mt-1 block text-sm font-bold leading-6 text-slate-500">{role.description}</span>
                  </span>
                  <ArrowRight className="ml-auto shrink-0 text-slate-400" size={20} />
                </Link>
              </motion.div>
            );
          })}
          <div className="rounded-[8px] border border-[#bfdbfe] bg-white p-4 text-sm font-bold leading-6 text-slate-600">
            <ShieldCheck className="mb-2 text-[#2563eb]" size={20} />
            Chat AI siswa bersifat pribadi secara default. Orang tua dan mentor hanya melihat progres sesuai izin.
          </div>
        </div>
      </section>
    </main>
  );
}
