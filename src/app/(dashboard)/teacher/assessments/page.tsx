"use client";

import { motion } from "framer-motion";
import { ClipboardCheck, Clock3 } from "lucide-react";
import { DashboardShell } from "../../_components/dashboard-shell";

const assessments = [
  ["Diagnostik Perbandingan VI A", "31/36 selesai", "09:42 tersisa", "ACTIVE"],
  ["Cek Pecahan VI B", "34/34 selesai", "Ditutup", "CLOSED"],
  ["Bangun Datar V A", "20/31 selesai", "1 hari lagi", "ACTIVE"],
];

export default function TeacherAssessmentsPage() {
  return (
    <DashboardShell role="teacher" title="Asesmen Guru">
      <section className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-black uppercase text-[#2563eb]">Monitoring</p>
        <h2 className="font-heading text-2xl font-black">Asesmen aktif kelas</h2>

        <div className="mt-5 grid gap-4">
          {assessments.map(([title, progress, time, status], index) => (
            <motion.article
              animate={{ opacity: 1, x: 0 }}
              className="rounded-[8px] bg-[#f8fafc] p-5"
              initial={{ opacity: 0, x: -12 }}
              key={title}
              transition={{ delay: index * 0.05 }}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-4">
                  <span className="grid size-12 shrink-0 place-items-center rounded-[8px] bg-white text-[#22c55e]">
                    <ClipboardCheck size={23} />
                  </span>
                  <div>
                    <h3 className="font-heading text-xl font-black">{title}</h3>
                    <p className="mt-1 font-bold text-slate-500">{progress}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-black text-slate-600">
                    <Clock3 size={16} />
                    {time}
                  </span>
                  <span className="rounded-full bg-[#eff6ff] px-3 py-2 text-xs font-black text-[#2563eb]">
                    {status}
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </DashboardShell>
  );
}

