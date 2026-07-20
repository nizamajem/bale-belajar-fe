"use client";

import { motion } from "framer-motion";
import { ArrowRight, GraduationCap, UsersRound } from "lucide-react";
import { DashboardShell } from "../../_components/dashboard-shell";

const classrooms = [
  ["VI A", "36 siswa", "82% selesai", "Perbandingan"],
  ["VI B", "34 siswa", "76% selesai", "Pecahan"],
  ["V A", "31 siswa", "64% selesai", "Bangun Datar"],
];

export default function TeacherClassroomsPage() {
  return (
    <DashboardShell role="teacher" title="Kelas Saya">
      <section className="grid gap-4 md:grid-cols-3">
        {classrooms.map(([name, students, progress, focus], index) => (
          <motion.article
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm"
            initial={{ opacity: 0, y: 12 }}
            key={name}
            transition={{ delay: index * 0.05 }}
          >
            <span className="grid size-12 place-items-center rounded-[8px] bg-[#eff6ff] text-[#2563eb]">
              <GraduationCap size={24} />
            </span>
            <h2 className="font-heading mt-5 text-3xl font-black">{name}</h2>
            <div className="mt-4 space-y-2 text-sm font-bold text-slate-600">
              <p className="flex items-center gap-2">
                <UsersRound size={17} />
                {students}
              </p>
              <p>{progress}</p>
              <p>Fokus: {focus}</p>
            </div>
            <button className="mt-5 inline-flex items-center gap-2 font-heading font-black text-[#2563eb]">
              Lihat kelas
              <ArrowRight size={18} />
            </button>
          </motion.article>
        ))}
      </section>
    </DashboardShell>
  );
}

