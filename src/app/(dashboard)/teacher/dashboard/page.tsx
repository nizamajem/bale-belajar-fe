"use client";

import { motion } from "framer-motion";
import { AlertCircle, ClipboardCheck, UsersRound } from "lucide-react";
import {
  DashboardShell,
  MetricCard,
} from "../../_components/dashboard-shell";

const students = ["Aulia", "Bima", "Citra", "Dimas", "Eka", "Fajar"];
const competencies = ["Pecahan", "Perbandingan", "Soal Cerita", "Bangun Datar"];
const heatmap = [
  [92, 76, 62, 84],
  [84, 58, 54, 72],
  [88, 80, 74, 90],
  [70, 48, 52, 64],
  [95, 86, 80, 88],
  [78, 60, 58, 76],
];

const remedial = [
  ["Dimas", "Perbandingan senilai", "48%"],
  ["Bima", "Soal cerita", "54%"],
  ["Fajar", "Soal cerita", "58%"],
];

function statusColor(score: number) {
  if (score >= 80) return "bg-[#22c55e]";
  if (score >= 60) return "bg-[#f9c74f]";
  return "bg-[#ff6b6b]";
}

export default function TeacherDashboardPage() {
  return (
    <DashboardShell role="teacher" title="Dashboard Guru">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Jumlah kelas" value="4" />
        <MetricCard label="Total siswa" tone="green" value="126" />
        <MetricCard label="Sudah mengerjakan" tone="yellow" value="82%" />
        <MetricCard label="Butuh remedial" tone="red" value="18" />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <motion.section
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm"
          initial={{ opacity: 0, y: 14 }}
        >
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-black uppercase text-[#2563eb]">
                Heatmap kelas
              </p>
              <h2 className="font-heading text-2xl font-black">
                Matematika VI A
              </h2>
            </div>
            <select className="rounded-[8px] border-2 border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-600">
              <option>Asesmen Perbandingan</option>
              <option>Asesmen Pecahan</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[640px]">
              <div className="grid grid-cols-[120px_repeat(4,1fr)] gap-2">
                <div />
                {competencies.map((item) => (
                  <div
                    className="rounded-[8px] bg-[#f8fafc] px-3 py-2 text-center text-xs font-black text-slate-500"
                    key={item}
                  >
                    {item}
                  </div>
                ))}
                {students.map((student, row) => (
                  <div className="contents" key={student}>
                    <div className="rounded-[8px] bg-[#f8fafc] px-3 py-3 font-heading font-black">
                      {student}
                    </div>
                    {heatmap[row].map((score, column) => (
                      <motion.div
                        animate={{ opacity: 1, scale: 1 }}
                        className={`${statusColor(score)} rounded-[8px] px-3 py-3 text-center font-heading font-black text-white`}
                        initial={{ opacity: 0, scale: 0.92 }}
                        key={`${student}-${column}`}
                        transition={{ delay: (row + column) * 0.025 }}
                      >
                        {score}
                      </motion.div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm"
          initial={{ opacity: 0, y: 14 }}
          transition={{ delay: 0.08 }}
        >
          <div className="mb-5 flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-[8px] bg-[#fff1f2] text-[#e11d48]">
              <AlertCircle size={23} />
            </span>
            <div>
              <p className="text-sm font-black uppercase text-[#e11d48]">
                Remedial
              </p>
              <h2 className="font-heading text-2xl font-black">
                Prioritas minggu ini
              </h2>
            </div>
          </div>

          <div className="space-y-3">
            {remedial.map(([name, topic, score]) => (
              <div className="rounded-[8px] bg-[#f8fafc] p-4" key={name}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-heading font-black">{name}</p>
                    <p className="text-sm font-bold text-slate-500">{topic}</p>
                  </div>
                  <span className="rounded-full bg-[#ffe4e6] px-3 py-1 text-sm font-black text-[#9f1239]">
                    {score}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <section className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <ClipboardCheck className="text-[#22c55e]" size={24} />
            <h2 className="font-heading text-xl font-black">Asesmen aktif</h2>
          </div>
          <div className="rounded-[8px] bg-[#f0fdf4] p-5">
            <p className="font-heading text-xl font-black">
              Diagnostik Perbandingan VI A
            </p>
            <p className="mt-2 font-semibold text-slate-600">
              31 dari 36 siswa sudah mengerjakan. 5 siswa belum mulai.
            </p>
            <div className="mt-4 h-4 overflow-hidden rounded-full bg-white">
              <div className="h-full w-[82%] rounded-full bg-[#22c55e]" />
            </div>
          </div>
        </section>

        <section className="rounded-[8px] border border-slate-200 bg-[#172033] p-5 text-white shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <UsersRound className="text-[#f9c74f]" size={24} />
            <h2 className="font-heading text-xl font-black">
              Rekomendasi kelompok
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {["Perbandingan", "Soal Cerita", "Pengayaan"].map((group, index) => (
              <div className="rounded-[8px] bg-white/10 p-4" key={group}>
                <p className="font-heading text-lg font-black">{group}</p>
                <p className="mt-2 text-sm font-bold text-slate-300">
                  {index === 0 ? "8 siswa" : index === 1 ? "6 siswa" : "12 siswa"}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}

