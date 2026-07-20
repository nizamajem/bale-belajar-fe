"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Check, Clock3, Play, Sparkles } from "lucide-react";
import { missions, quickStats } from "../_components/student-data";
import { ProgressBar, StudentShell } from "../_components/student-shell";

const toneClass = {
  blue: "bg-[#dbeafe] text-[#1d4ed8]",
  green: "bg-[#dcfce7] text-[#166534]",
  red: "bg-[#ffe4e6] text-[#9f1239]",
  yellow: "bg-[#fef3c7] text-[#92400e]",
};

export default function StudentDashboardPage() {
  return (
    <StudentShell>
      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-8">
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-[8px] bg-[#22c55e] p-5 text-white shadow-[0_10px_0_#129447] sm:p-7"
            initial={{ opacity: 0, y: 16 }}
          >
            <div className="relative z-10 max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/18 px-3 py-2 text-sm font-black">
                <Sparkles size={17} />
                Misi hari ini siap
              </span>
              <h1 className="font-heading mt-4 text-3xl font-black leading-tight sm:text-5xl">
                Halo, Aulia. Lanjutkan satu langkah lagi.
              </h1>
              <p className="mt-4 max-w-lg font-bold leading-7 text-white/88">
                Kamu sudah menyelesaikan 6 dari 10 soal. Jawaban tersimpan
                otomatis, jadi kamu bisa fokus membaca soal dengan tenang.
              </p>
              <Link
                className="mt-6 inline-flex items-center gap-2 rounded-[8px] bg-white px-5 py-4 font-heading font-black text-[#15803d] shadow-[0_6px_0_#d9f99d] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
                href="/student/attempts/demo"
              >
                Lanjutkan Misi
                <Play size={18} fill="#15803d" />
              </Link>
            </div>
            <div className="absolute -right-8 bottom-0 hidden h-44 w-44 rounded-[28px] bg-white/20 sm:block" />
            <div className="absolute right-10 top-8 hidden rounded-[8px] bg-white px-4 py-3 text-sm font-black text-[#15803d] shadow-xl sm:block">
              <Check className="mr-2 inline" size={17} />
              64% progress
            </div>
          </motion.div>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
            initial={{ opacity: 0, y: 16 }}
            transition={{ delay: 0.08 }}
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-black uppercase text-[#2563eb]">
                  Ringkasan
                </p>
                <h2 className="font-heading text-2xl font-black">
                  Progress minggu ini
                </h2>
              </div>
              <span className="rounded-full bg-[#fff7ed] px-3 py-1 text-sm font-black text-[#c2410c]">
                +120 XP
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {quickStats.map((stat, index) => {
                const Icon = stat.icon;

                return (
                  <motion.div
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-[8px] bg-[#f8fafc] p-4"
                    initial={{ opacity: 0, scale: 0.96 }}
                    key={stat.label}
                    transition={{ delay: 0.12 + index * 0.05 }}
                  >
                    <Icon className="mb-3 text-[#2563eb]" size={22} />
                    <p className="font-heading text-2xl font-black">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-xs font-bold text-slate-500">
                      {stat.label}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-sm font-black uppercase text-[#22c55e]">
                Jalur belajar
              </p>
              <h2 className="font-heading text-2xl font-black">
                Pilih misi berikutnya
              </h2>
            </div>
            <span className="hidden items-center gap-2 text-sm font-black text-slate-500 sm:inline-flex">
              <Clock3 size={16} />
              12 menit tersisa
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {missions.map((mission, index) => {
              const Icon = mission.icon;

              return (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm"
                  initial={{ opacity: 0, y: 18 }}
                  key={mission.title}
                  transition={{ delay: index * 0.06 }}
                >
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <span
                      className={`grid size-12 place-items-center rounded-[8px] ${toneClass[mission.tone]}`}
                    >
                      <Icon size={24} />
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                      {mission.status}
                    </span>
                  </div>
                  <h3 className="font-heading text-xl font-black">
                    {mission.title}
                  </h3>
                  <p className="mt-2 min-h-10 text-sm font-bold leading-5 text-slate-500">
                    {mission.subtitle}
                  </p>
                  <div className="mt-5">
                    <ProgressBar value={mission.progress} />
                    <p className="mt-2 text-right text-xs font-black text-slate-500">
                      {mission.progress}%
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        <Link
          className="mt-6 flex items-center justify-between rounded-[8px] border-2 border-slate-200 bg-white px-5 py-4 font-heading font-black text-slate-700 shadow-[0_6px_0_#d8e2ef] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
          href="/student/results/demo"
        >
          Lihat hasil terakhir
          <ArrowRight size={20} />
        </Link>
      </section>
    </StudentShell>
  );
}

