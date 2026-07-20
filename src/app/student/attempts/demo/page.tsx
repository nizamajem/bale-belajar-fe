"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Bookmark, Check, Clock3, Flag } from "lucide-react";
import { useMemo, useState } from "react";
import { ProgressBar, StudentShell } from "../../_components/student-shell";

const questionNumbers = Array.from({ length: 10 }, (_, index) => index + 1);

const options = [
  "2 : 5",
  "5 : 2",
  "10 : 25",
  "25 : 10",
];

export default function DemoAttemptPage() {
  const [selected, setSelected] = useState(0);
  const [marked, setMarked] = useState(false);
  const [saveState, setSaveState] = useState<"saving" | "saved">("saved");

  const answered = useMemo(() => new Set([1, 2, 3, 4, 5, 6]), []);

  function selectOption(index: number) {
    setSelected(index);
    setSaveState("saving");
    window.setTimeout(() => setSaveState("saved"), 600);
  }

  return (
    <StudentShell>
      <section className="mx-auto grid max-w-6xl gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[1fr_320px] lg:py-8">
        <div className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <Link
              className="inline-flex items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-600 shadow-[0_4px_0_#d8e2ef] active:translate-y-1 active:shadow-none"
              href="/student/dashboard"
            >
              <ArrowLeft size={17} />
              Keluar
            </Link>
            <div className="flex items-center gap-2 rounded-full bg-[#eff6ff] px-4 py-2 font-heading font-black text-[#2563eb]">
              <Clock3 size={18} />
              09:42
            </div>
          </div>

          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between text-sm font-black text-slate-500">
              <span>Soal 6 dari 10</span>
              <span>64%</span>
            </div>
            <ProgressBar color="bg-[#2563eb]" value={64} />
          </div>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[8px] bg-[#f8fafc] p-5 sm:p-6"
            initial={{ opacity: 0, y: 12 }}
          >
            <p className="mb-3 text-sm font-black uppercase text-[#22c55e]">
              Perbandingan senilai
            </p>
            <h1 className="font-heading text-2xl font-black leading-tight text-[#172033] sm:text-3xl">
              Rina membeli 10 buku dan mendapat 25 stiker. Bentuk perbandingan
              buku terhadap stiker yang paling sederhana adalah...
            </h1>
          </motion.div>

          <div className="mt-5 grid gap-3">
            {options.map((option, index) => {
              const active = selected === index;

              return (
                <motion.button
                  animate={{ opacity: 1, x: 0 }}
                  className={[
                    "flex min-h-16 items-center gap-3 rounded-[8px] border-2 px-4 py-3 text-left font-heading text-lg font-black transition active:translate-y-1",
                    active
                      ? "border-[#22c55e] bg-[#f0fdf4] shadow-[0_6px_0_#bbf7d0]"
                      : "border-slate-200 bg-white shadow-[0_6px_0_#e2e8f0] hover:-translate-y-0.5 hover:border-[#93c5fd]",
                  ].join(" ")}
                  initial={{ opacity: 0, x: -14 }}
                  key={option}
                  onClick={() => selectOption(index)}
                  transition={{ delay: index * 0.05 }}
                  type="button"
                >
                  <span
                    className={[
                      "grid size-10 shrink-0 place-items-center rounded-[8px] border-2",
                      active
                        ? "border-[#22c55e] bg-[#22c55e] text-white"
                        : "border-slate-200 bg-slate-50 text-slate-500",
                    ].join(" ")}
                  >
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}
                </motion.button>
              );
            })}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              className={[
                "inline-flex items-center justify-center gap-2 rounded-[8px] border-2 px-4 py-3 font-heading font-black shadow-[0_5px_0_#d8e2ef] transition active:translate-y-1 active:shadow-none",
                marked
                  ? "border-[#f9c74f] bg-[#fffbeb] text-[#92400e]"
                  : "border-slate-200 bg-white text-slate-600",
              ].join(" ")}
              onClick={() => setMarked((value) => !value)}
              type="button"
            >
              <Bookmark size={18} fill={marked ? "#f9c74f" : "none"} />
              Tandai
            </button>

            <span className="inline-flex items-center justify-center gap-2 text-sm font-black text-slate-500">
              <span
                className={[
                  "size-2 rounded-full",
                  saveState === "saving" ? "bg-[#f9c74f]" : "bg-[#22c55e]",
                ].join(" ")}
              />
              {saveState === "saving" ? "Menyimpan..." : "Tersimpan"}
            </span>

            <Link
              className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#2563eb] px-5 py-3 font-heading font-black text-white shadow-[0_6px_0_#1d4ed8] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
              href="/student/results/demo"
            >
              Selesai
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        <aside className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-xl font-black">Navigator</h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#dcfce7] px-3 py-1 text-xs font-black text-[#166534]">
              <Check size={14} />
              6 dijawab
            </span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {questionNumbers.map((number) => {
              const isCurrent = number === 6;
              const isAnswered = answered.has(number);

              return (
                <button
                  className={[
                    "aspect-square rounded-[8px] font-heading font-black transition active:scale-95",
                    isCurrent && "bg-[#2563eb] text-white shadow-[0_5px_0_#1d4ed8]",
                    !isCurrent &&
                      isAnswered &&
                      "bg-[#dcfce7] text-[#166534] shadow-[0_4px_0_#bbf7d0]",
                    !isCurrent &&
                      !isAnswered &&
                      "bg-slate-100 text-slate-400 shadow-[0_4px_0_#e2e8f0]",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  key={number}
                  type="button"
                >
                  {number}
                </button>
              );
            })}
          </div>
          <div className="mt-5 rounded-[8px] bg-[#fff7ed] p-4 text-sm font-bold leading-6 text-[#9a3412]">
            <Flag className="mb-2" size={20} />
            Soal yang ditandai akan muncul lagi di halaman review sebelum submit.
          </div>
        </aside>
      </section>
    </StudentShell>
  );
}

