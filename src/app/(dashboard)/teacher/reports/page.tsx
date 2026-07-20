"use client";

import { motion } from "framer-motion";
import { Download, FileText, MessageCircle } from "lucide-react";
import { DashboardShell } from "../../_components/dashboard-shell";

const reports = [
  ["Aulia Rahman", "76", "Sedang Berkembang"],
  ["Bima Saputra", "58", "Perlu Latihan"],
  ["Citra Lestari", "88", "Dikuasai"],
  ["Dimas Pratama", "52", "Perlu Latihan"],
];

export default function TeacherReportsPage() {
  return (
    <DashboardShell role="teacher" title="Laporan Siswa">
      <section className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase text-[#22c55e]">
              Parent report
            </p>
            <h2 className="font-heading text-2xl font-black">
              Ringkasan hasil siswa
            </h2>
          </div>
          <button className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#2563eb] px-4 py-3 font-heading font-black text-white shadow-[0_5px_0_#1d4ed8]">
            <Download size={18} />
            Export Excel
          </button>
        </div>

        <div className="mt-5 grid gap-3">
          {reports.map(([name, score, status], index) => (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-4 rounded-[8px] bg-[#f8fafc] p-4 sm:flex-row sm:items-center sm:justify-between"
              initial={{ opacity: 0, y: 10 }}
              key={name}
              transition={{ delay: index * 0.04 }}
            >
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-[8px] bg-white text-[#2563eb]">
                  <FileText size={20} />
                </span>
                <div>
                  <p className="font-heading font-black">{name}</p>
                  <p className="text-sm font-bold text-slate-500">{status}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-heading text-2xl font-black">{score}</span>
                <button className="grid size-10 place-items-center rounded-[8px] bg-[#f0fdf4] text-[#166534]">
                  <MessageCircle size={19} />
                </button>
                <button className="grid size-10 place-items-center rounded-[8px] bg-[#eff6ff] text-[#2563eb]">
                  <Download size={19} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </DashboardShell>
  );
}

