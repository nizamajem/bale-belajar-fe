"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Download,
  MessageCircle,
  RotateCcw,
  Sparkles,
  Trophy,
} from "lucide-react";
import {
  competencies,
  weeklyPlan,
} from "../../_components/student-data";
import {
  ProgressBar,
  StatusPill,
  StudentShell,
} from "../../_components/student-shell";

export default function DemoResultPage() {
  return (
    <StudentShell>
      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-8">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[8px] bg-[#2563eb] p-6 text-white shadow-[0_10px_0_#1d4ed8] sm:p-8"
          initial={{ opacity: 0, y: 16 }}
        >
          <div className="relative z-10 grid gap-6 md:grid-cols-[1fr_220px] md:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/16 px-3 py-2 text-sm font-black">
                <Sparkles size={17} />
                Hasil asesmen selesai
              </span>
              <h1 className="font-heading mt-4 text-3xl font-black leading-tight sm:text-5xl">
                Kamu sedang berkembang di Perbandingan.
              </h1>
              <p className="mt-4 max-w-2xl font-bold leading-7 text-white/86">
                Ada materi yang sudah kuat, dan ada beberapa bagian yang perlu
                latihan terarah. Fokus minggu ini dibuat singkat agar mudah
                dikerjakan.
              </p>
            </div>
            <div className="rounded-[8px] bg-white p-5 text-center text-[#172033] shadow-xl">
              <Trophy className="mx-auto text-[#f9c74f]" fill="#f9c74f" size={42} />
              <p className="font-heading mt-3 text-6xl font-black">76</p>
              <p className="mt-1 text-sm font-black text-slate-500">Skor total</p>
            </div>
          </div>
        </motion.div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_360px]">
          <section className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black uppercase text-[#22c55e]">
                  Peta kemampuan
                </p>
                <h2 className="font-heading text-2xl font-black">
                  Ringkasan kompetensi
                </h2>
              </div>
              <span className="rounded-full bg-[#eff6ff] px-3 py-1 text-xs font-black text-[#2563eb]">
                Matematika
              </span>
            </div>

            <div className="space-y-5">
              {competencies.map((item, index) => (
                <motion.div
                  animate={{ opacity: 1, x: 0 }}
                  initial={{ opacity: 0, x: -12 }}
                  key={item.label}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <span className="font-heading font-black">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <StatusPill status={item.status} />
                      <span className="text-sm font-black text-slate-500">
                        {item.score}%
                      </span>
                    </div>
                  </div>
                  <ProgressBar
                    color={
                      item.status === "Dikuasai"
                        ? "bg-[#22c55e]"
                        : item.status === "Sedang Berkembang"
                          ? "bg-[#f9c74f]"
                          : "bg-[#ff6b6b]"
                    }
                    value={item.score}
                  />
                </motion.div>
              ))}
            </div>
          </section>

          <aside className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm font-black uppercase text-[#2563eb]">
              Prioritas belajar
            </p>
            <h2 className="font-heading mt-1 text-2xl font-black">
              Fokus 7 hari
            </h2>
            <div className="mt-5 space-y-3">
              {weeklyPlan.map((item, index) => (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 rounded-[8px] bg-[#f8fafc] p-4"
                  initial={{ opacity: 0, y: 12 }}
                  key={item}
                  transition={{ delay: index * 0.05 }}
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-[8px] bg-[#22c55e] font-heading font-black text-white">
                    {index + 1}
                  </span>
                  <p className="text-sm font-bold leading-6 text-slate-600">
                    {item}
                  </p>
                </motion.div>
              ))}
            </div>
          </aside>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <button className="inline-flex items-center justify-center gap-2 rounded-[8px] border-2 border-slate-200 bg-white px-5 py-4 font-heading font-black text-slate-700 shadow-[0_6px_0_#d8e2ef] transition active:translate-y-1 active:shadow-none">
            <Download size={18} />
            Unduh PDF
          </button>
          <button className="inline-flex items-center justify-center gap-2 rounded-[8px] border-2 border-[#bbf7d0] bg-[#f0fdf4] px-5 py-4 font-heading font-black text-[#166534] shadow-[0_6px_0_#bbf7d0] transition active:translate-y-1 active:shadow-none">
            <MessageCircle size={18} />
            Bagikan
          </button>
          <Link
            className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#2563eb] px-5 py-4 font-heading font-black text-white shadow-[0_6px_0_#1d4ed8] transition active:translate-y-1 active:shadow-none"
            href="/student/dashboard"
          >
            Kembali
            <ArrowRight size={18} />
          </Link>
        </div>

        <Link
          className="mt-5 inline-flex items-center gap-2 text-sm font-black text-slate-500"
          href="/student/attempts/demo"
        >
          <RotateCcw size={16} />
          Lihat ulang contoh pengerjaan
        </Link>
      </section>
    </StudentShell>
  );
}

