"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Clock3, Loader2, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { StudentAssignment } from "@/lib/types";
import { StudentShell } from "../_components/student-shell";

function formatDate(iso?: string) {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function StudentHistoryPage() {
  const [assignments, setAssignments] = useState<StudentAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<StudentAssignment[]>("/student/assessments")
      .then(({ data }) => setAssignments(data))
      .catch(() => setAssignments([]))
      .finally(() => setLoading(false));
  }, []);

  const history = assignments.filter(
    (a) => a.attempts?.[0]?.status === "SUBMITTED" || a.attempts?.[0]?.status === "AUTO_SUBMITTED",
  );

  return (
    <StudentShell>
      <section className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <p className="text-sm font-black uppercase text-[#2563eb]">
          Riwayat belajar
        </p>
        <h1 className="font-heading text-3xl font-black">Hasil asesmen</h1>

        {loading ? (
          <div className="grid place-items-center py-10">
            <Loader2 className="animate-spin text-slate-400" size={28} />
          </div>
        ) : history.length === 0 ? (
          <p className="mt-5 rounded-[8px] border border-slate-200 bg-white p-8 text-center font-bold text-slate-500 shadow-sm">
            Belum ada asesmen yang selesai dikerjakan.
          </p>
        ) : (
          <div className="mt-5 grid gap-4">
            {history.map((assignment, index) => {
              const attempt = assignment.attempts![0];
              return (
                <motion.article
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm"
                  initial={{ opacity: 0, y: 12 }}
                  key={assignment.id}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex gap-4">
                      <span className="grid size-12 shrink-0 place-items-center rounded-[8px] bg-[#fff7ed] text-[#c2410c]">
                        <Trophy size={23} fill="#f9c74f" />
                      </span>
                      <div>
                        <h2 className="font-heading text-xl font-black">
                          {assignment.assessment.title}
                        </h2>
                        <p className="mt-1 flex items-center gap-2 text-sm font-bold text-slate-500">
                          <Clock3 size={15} />
                          {formatDate(attempt.submittedAt)}
                        </p>
                      </div>
                    </div>
                    <Link
                      className="grid size-10 place-items-center rounded-[8px] bg-[#eff6ff] text-[#2563eb]"
                      href={`/student/results/${attempt.id}`}
                    >
                      <ArrowRight size={20} />
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </section>
    </StudentShell>
  );
}
