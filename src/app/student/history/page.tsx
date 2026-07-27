"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BookOpen, CalendarDays, CheckCircle2, Clock3, Loader2, Trophy } from "lucide-react";
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
        {loading ? (
          <div className="grid place-items-center py-10">
            <Loader2 className="animate-spin text-slate-400" size={28} />
          </div>
        ) : history.length === 0 ? (
          <EmptyHistory />
        ) : (
          <>
            <section className="rounded-[8px] bg-[#172033] p-5 text-white shadow-[0_8px_0_#020617] sm:p-6">
              <p className="text-sm font-black uppercase text-[#f9c74f]">Riwayat belajar</p>
              <h1 className="font-heading mt-2 text-3xl font-black leading-tight sm:text-4xl">
                Misi yang sudah kamu selesaikan.
              </h1>
              <p className="mt-3 max-w-2xl font-bold leading-7 text-white/72">
                Di sini kamu bisa melihat hasil lama dan membuka ulang jawabannya.
              </p>
            </section>

            <section className="mt-5 grid gap-3 sm:grid-cols-3">
              <SummaryCard icon={<CheckCircle2 size={20} />} label="Selesai" value={`${history.length} misi`} />
              <SummaryCard icon={<BookOpen size={20} />} label="Terakhir" value={formatDate(history[0]?.attempts?.[0]?.submittedAt)} />
              <SummaryCard icon={<Trophy size={20} />} label="Status" value="Tersimpan" />
            </section>

            <div className="mt-5 grid gap-4">
              {history.map((assignment, index) => {
                const attempt = assignment.attempts![0];
                return (
                  <motion.article
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
                    initial={{ opacity: 0, y: 12 }}
                    key={assignment.id}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 gap-4">
                        <span className="grid size-12 shrink-0 place-items-center rounded-[8px] bg-[#dcfce7] text-[#166534]">
                          <CheckCircle2 size={24} />
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-black uppercase text-[#2563eb]">Sudah selesai</p>
                          <h2 className="font-heading mt-1 text-xl font-black text-balance-soft">
                            {assignment.assessment.title}
                          </h2>
                          <p className="mt-2 flex items-center gap-2 text-sm font-bold text-slate-500">
                            <CalendarDays size={15} />
                            {formatDate(attempt.submittedAt)}
                          </p>
                        </div>
                      </div>
                      <Link
                        className="inline-flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#2563eb] px-4 py-3 font-heading font-black text-white shadow-[0_5px_0_#1d4ed8] sm:w-auto"
                        href={`/student/results/${attempt.id}`}
                      >
                        Lihat hasil
                        <ArrowRight size={18} />
                      </Link>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </>
        )}
      </section>
    </StudentShell>
  );
}

function SummaryCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-[#2563eb]">{icon}</div>
      <p className="font-heading mt-3 text-2xl font-black">{value}</p>
      <p className="text-sm font-bold text-slate-500">{label}</p>
    </div>
  );
}

function EmptyHistory() {
  return (
    <section className="rounded-[8px] bg-white p-6 text-center shadow-sm sm:p-8">
      <span className="mx-auto grid size-16 place-items-center rounded-[8px] bg-[#eff6ff] text-[#2563eb]">
        <Clock3 size={30} />
      </span>
      <h1 className="font-heading mt-5 text-3xl font-black text-[#172033]">
        Belum ada riwayat.
      </h1>
      <p className="mx-auto mt-3 max-w-md font-bold leading-7 text-slate-500">
        Setelah kamu menyelesaikan satu misi, hasilnya akan muncul di sini.
      </p>
      <Link
        className="mt-5 inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#22c55e] px-5 py-4 font-heading font-black text-white shadow-[0_6px_0_#129447]"
        href="/student/world/detectivia"
      >
        Mulai misi
        <ArrowRight size={18} />
      </Link>
    </section>
  );
}
