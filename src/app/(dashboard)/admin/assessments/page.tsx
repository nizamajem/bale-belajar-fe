"use client";

import { motion } from "framer-motion";
import { CalendarClock, Plus, Send } from "lucide-react";
import { DashboardShell } from "../../_components/dashboard-shell";

const assessments = [
  ["Diagnostik Perbandingan", "Matematika VI", "ACTIVE", "36 siswa", "82%"],
  ["Cek Pecahan Dasar", "Matematika VI", "CLOSED", "34 siswa", "100%"],
  ["Bangun Datar", "Matematika V", "DRAFT", "0 siswa", "0%"],
];

export default function AdminAssessmentsPage() {
  return (
    <DashboardShell role="admin" title="Manajemen Asesmen">
      <section className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase text-[#2563eb]">
              Assessment engine
            </p>
            <h2 className="font-heading text-2xl font-black">Daftar asesmen</h2>
          </div>
          <button className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#2563eb] px-4 py-3 font-heading font-black text-white shadow-[0_5px_0_#1d4ed8]">
            <Plus size={18} />
            Buat asesmen
          </button>
        </div>

        <div className="mt-5 grid gap-4">
          {assessments.map(([title, subject, status, assigned, progress], index) => (
            <motion.article
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[8px] bg-[#f8fafc] p-5"
              initial={{ opacity: 0, y: 10 }}
              key={title}
              transition={{ delay: index * 0.05 }}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex gap-4">
                  <span className="grid size-12 shrink-0 place-items-center rounded-[8px] bg-white text-[#2563eb]">
                    <CalendarClock size={23} />
                  </span>
                  <div>
                    <h3 className="font-heading text-xl font-black">{title}</h3>
                    <p className="mt-1 font-bold text-slate-500">
                      {subject} - {assigned}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-600">
                    {status}
                  </span>
                  <span className="font-heading font-black text-[#22c55e]">
                    {progress}
                  </span>
                  <button className="inline-flex items-center gap-2 rounded-[8px] bg-[#22c55e] px-4 py-3 font-heading font-black text-white shadow-[0_5px_0_#129447]">
                    <Send size={17} />
                    Publikasi
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </DashboardShell>
  );
}

