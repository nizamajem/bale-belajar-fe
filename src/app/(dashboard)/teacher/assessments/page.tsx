"use client";

import { motion } from "framer-motion";
import { ClipboardCheck, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { DashboardShell } from "../../_components/dashboard-shell";
import { Assessment } from "@/lib/types";

export default function TeacherAssessmentsPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<Assessment[]>("/assessments", { query: { page: 1, limit: 100 } })
      .then(({ data }) => setAssessments(data))
      .catch(() => setAssessments([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardShell role="teacher" title="Asesmen Guru">
      <section className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-black uppercase text-[#2563eb]">Monitoring</p>
        <h2 className="font-heading text-2xl font-black">Semua asesmen</h2>

        {loading ? (
          <div className="grid place-items-center py-10">
            <Loader2 className="animate-spin text-slate-400" size={28} />
          </div>
        ) : assessments.length === 0 ? (
          <p className="py-10 text-center font-bold text-slate-500">
            Belum ada asesmen dibuat.
          </p>
        ) : (
          <div className="mt-5 grid gap-4">
            {assessments.map((assessment, index) => (
              <motion.article
                animate={{ opacity: 1, x: 0 }}
                className="rounded-[8px] bg-[#f8fafc] p-5"
                initial={{ opacity: 0, x: -12 }}
                key={assessment.id}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex gap-4">
                    <span className="grid size-12 shrink-0 place-items-center rounded-[8px] bg-white text-[#22c55e]">
                      <ClipboardCheck size={23} />
                    </span>
                    <div>
                      <h3 className="font-heading text-xl font-black">{assessment.title}</h3>
                      <p className="mt-1 font-bold text-slate-500">
                        {assessment.subject?.name ?? "-"} - {assessment._count?.questions ?? 0} soal
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-[#eff6ff] px-3 py-2 text-xs font-black text-[#2563eb]">
                      {assessment.status}
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>
    </DashboardShell>
  );
}
