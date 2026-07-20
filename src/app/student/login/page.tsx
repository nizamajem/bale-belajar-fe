"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, KeyRound, Sparkles } from "lucide-react";

export default function StudentLoginPage() {
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
            Masukkan kode peserta, lalu lanjutkan misi belajar.
          </h1>
          <p className="mt-3 font-bold leading-7 text-white/86">
            Kode diberikan oleh guru atau admin sekolah. Tidak perlu email untuk
            masuk sebagai siswa.
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
          <form className="mt-7 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-black text-slate-600">
                Kode peserta
              </span>
              <span className="flex items-center gap-3 rounded-[8px] border-2 border-slate-200 px-4 py-4 shadow-[0_6px_0_#e2e8f0]">
                <KeyRound className="text-[#22c55e]" size={22} />
                <input
                  className="w-full border-0 bg-transparent font-heading text-xl font-black uppercase tracking-[0.08em] outline-none"
                  defaultValue="BB-S001"
                />
              </span>
            </label>

            <Link
              className="flex items-center justify-center gap-2 rounded-[8px] bg-[#22c55e] px-5 py-4 font-heading font-black text-white shadow-[0_7px_0_#129447] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
              href="/student/dashboard"
            >
              Masuk dan lanjut
              <ArrowRight size={19} />
            </Link>
          </form>
        </div>
      </motion.section>
    </main>
  );
}

