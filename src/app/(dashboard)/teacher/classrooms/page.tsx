"use client";

import { motion } from "framer-motion";
import { GraduationCap, Loader2, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { DashboardShell } from "../../_components/dashboard-shell";
import { Classroom } from "@/lib/types";

export default function TeacherClassroomsPage() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<Classroom[]>("/classrooms", { query: { page: 1, limit: 100 } })
      .then(({ data }) => setClassrooms(data))
      .catch(() => setClassrooms([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardShell role="teacher" title="Kelas Saya">
      {loading ? (
        <div className="grid place-items-center py-10">
          <Loader2 className="animate-spin text-slate-400" size={28} />
        </div>
      ) : classrooms.length === 0 ? (
        <p className="rounded-[8px] border border-slate-200 bg-white p-10 text-center font-bold text-slate-500 shadow-sm">
          Belum ada kelas terdaftar.
        </p>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {classrooms.map((classroom, index) => (
            <motion.article
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
              initial={{ opacity: 0, y: 12 }}
              key={classroom.id}
              transition={{ delay: index * 0.05 }}
            >
              <span className="grid size-12 place-items-center rounded-[8px] bg-[#eff6ff] text-[#2563eb]">
                <GraduationCap size={24} />
              </span>
              <h2 className="font-heading mt-5 text-2xl font-black sm:text-3xl">{classroom.name}</h2>
              <div className="mt-4 space-y-2 text-sm font-bold text-slate-600">
                <p className="flex items-center gap-2">
                  <UsersRound size={17} />
                  {classroom._count?.students ?? 0} siswa
                </p>
                <p>Tingkat {classroom.gradeLevel}</p>
                <p>Tahun ajaran: {classroom.academicYear}</p>
                {classroom.homeroomTeacher ? (
                  <p>Wali kelas: {classroom.homeroomTeacher.user.name}</p>
                ) : null}
              </div>
            </motion.article>
          ))}
        </section>
      )}
    </DashboardShell>
  );
}
