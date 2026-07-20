"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Clock3, Trophy } from "lucide-react";
import { StudentShell } from "../_components/student-shell";

const history = [
  ["Diagnostik Perbandingan", "76", "Sedang Berkembang", "Hari ini"],
  ["Cek Pecahan Dasar", "84", "Dikuasai", "Kemarin"],
  ["Bilangan Bulat", "92", "Dikuasai", "5 hari lalu"],
];

export default function StudentHistoryPage() {
  return (
    <StudentShell>
      <section className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <p className="text-sm font-black uppercase text-[#2563eb]">
          Riwayat belajar
        </p>
        <h1 className="font-heading text-3xl font-black">Hasil asesmen</h1>

        <div className="mt-5 grid gap-4">
          {history.map(([title, score, status, time], index) => (
            <motion.article
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm"
              initial={{ opacity: 0, y: 12 }}
              key={title}
              transition={{ delay: index * 0.05 }}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-4">
                  <span className="grid size-12 shrink-0 place-items-center rounded-[8px] bg-[#fff7ed] text-[#c2410c]">
                    <Trophy size={23} fill="#f9c74f" />
                  </span>
                  <div>
                    <h2 className="font-heading text-xl font-black">
                      {title}
                    </h2>
                    <p className="mt-1 flex items-center gap-2 text-sm font-bold text-slate-500">
                      <Clock3 size={15} />
                      {time} - {status}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <span className="font-heading text-3xl font-black text-[#22c55e]">
                    {score}
                  </span>
                  <Link
                    className="grid size-10 place-items-center rounded-[8px] bg-[#eff6ff] text-[#2563eb]"
                    href="/student/results/demo"
                  >
                    <ArrowRight size={20} />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </StudentShell>
  );
}

