"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Clock3, School, UsersRound } from "lucide-react";
import {
  DashboardShell,
  MetricCard,
} from "../../_components/dashboard-shell";

const activity = [
  ["SDN 1 Mataram", "Asesmen Matematika dipublikasikan", "08:20"],
  ["SMP Tunas Ilmu", "24 siswa menyelesaikan asesmen", "09:15"],
  ["SDN 4 Ampenan", "Lead pilot baru masuk", "10:05"],
];

const schools = [
  ["SDN 1 Mataram", "92%", "Aktif"],
  ["SMP Tunas Ilmu", "84%", "Pilot"],
  ["SDN 4 Ampenan", "63%", "Demo"],
];

export default function AdminDashboardPage() {
  return (
    <DashboardShell role="admin" title="Dashboard Admin">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total sekolah" value="18" />
        <MetricCard label="Total guru" tone="green" value="74" />
        <MetricCard label="Total siswa" tone="yellow" value="1.248" />
        <MetricCard label="Asesmen aktif" tone="red" value="12" />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <motion.section
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm"
          initial={{ opacity: 0, y: 14 }}
        >
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-black uppercase text-[#2563eb]">
                Aktivitas 7 hari
              </p>
              <h2 className="font-heading text-2xl font-black">
                Completion rate naik stabil
              </h2>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#f0fdf4] px-3 py-1 text-sm font-black text-[#166534]">
              <ArrowUpRight size={16} />
              +12%
            </span>
          </div>

          <div className="flex h-72 items-end gap-3 rounded-[8px] bg-[#f8fafc] p-4">
            {[42, 58, 50, 72, 64, 88, 79].map((height, index) => (
              <motion.div
                animate={{ height: `${height}%` }}
                className="flex-1 rounded-t-[8px] bg-[#2563eb]"
                initial={{ height: "8%" }}
                key={index}
                transition={{ delay: index * 0.05, duration: 0.45 }}
              />
            ))}
          </div>
        </motion.section>

        <motion.section
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm"
          initial={{ opacity: 0, y: 14 }}
          transition={{ delay: 0.08 }}
        >
          <p className="text-sm font-black uppercase text-[#22c55e]">
            Lead pilot
          </p>
          <h2 className="font-heading text-2xl font-black">Prioritas follow up</h2>
          <div className="mt-5 space-y-3">
            {schools.map(([name, progress, status]) => (
              <div className="rounded-[8px] bg-[#f8fafc] p-4" key={name}>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-[8px] bg-white text-[#2563eb]">
                      <School size={19} />
                    </span>
                    <div>
                      <p className="font-heading font-black">{name}</p>
                      <p className="text-xs font-bold text-slate-500">{status}</p>
                    </div>
                  </div>
                  <span className="font-heading font-black">{progress}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-[#22c55e]"
                    style={{ width: progress }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <section className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <UsersRound className="text-[#2563eb]" size={24} />
            <h2 className="font-heading text-xl font-black">Aktivitas terbaru</h2>
          </div>
          <div className="space-y-3">
            {activity.map(([school, text, time]) => (
              <div
                className="flex items-center justify-between gap-4 rounded-[8px] bg-[#f8fafc] p-4"
                key={`${school}-${time}`}
              >
                <div>
                  <p className="font-heading font-black">{school}</p>
                  <p className="text-sm font-bold text-slate-500">{text}</p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-black text-slate-400">
                  <Clock3 size={14} />
                  {time}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[8px] border border-slate-200 bg-[#172033] p-5 text-white shadow-sm">
          <p className="text-sm font-black uppercase text-[#f9c74f]">
            Kompetensi terendah
          </p>
          <h2 className="font-heading mt-1 text-2xl font-black">
            Perbandingan senilai
          </h2>
          <p className="mt-3 max-w-lg font-semibold leading-7 text-slate-300">
            Kompetensi ini muncul sebagai prioritas di 7 sekolah. Sistem bisa
            dipakai untuk membuat kelompok remedial berdasarkan kelas.
          </p>
          <div className="mt-5 grid grid-cols-3 gap-2">
            {["NEEDS_PRACTICE", "42%", "7 sekolah"].map((item) => (
              <div className="rounded-[8px] bg-white/10 p-3 text-center" key={item}>
                <p className="text-sm font-black">{item}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}

