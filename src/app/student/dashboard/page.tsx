"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, BookOpen, ClipboardCheck, Loader2, Play, Sparkles, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { getStoredUser } from "@/lib/auth";
import { StudentAssignment } from "@/lib/types";
import { ProgressBar, StudentShell } from "../_components/student-shell";

const toneByStatus = {
  ASSIGNED: "bg-[#fef3c7] text-[#92400e]",
  STARTED: "bg-[#dbeafe] text-[#1d4ed8]",
  COMPLETED: "bg-[#dcfce7] text-[#166534]",
  EXPIRED: "bg-[#ffe4e6] text-[#9f1239]",
};

const statusLabel = {
  ASSIGNED: "Belum dimulai",
  STARTED: "Sedang dikerjakan",
  COMPLETED: "Selesai",
  EXPIRED: "Kedaluwarsa",
};

function progressForStatus(status: keyof typeof statusLabel) {
  if (status === "COMPLETED") return 100;
  if (status === "STARTED") return 50;
  return 0;
}

export default function StudentDashboardPage() {
  const router = useRouter();
  const [assignments, setAssignments] = useState<StudentAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const user = getStoredUser();

  useEffect(() => {
    apiFetch<StudentAssignment[]>("/student/assessments")
      .then(({ data }) => setAssignments(data))
      .catch(() => setAssignments([]))
      .finally(() => setLoading(false));
  }, []);

  const active = assignments.find((a) => a.status === "ASSIGNED" || a.status === "STARTED");
  const completedCount = assignments.filter((a) => a.status === "COMPLETED").length;
  const lastSubmitted = assignments.find(
    (a) => a.attempts?.[0]?.status === "SUBMITTED" || a.attempts?.[0]?.status === "AUTO_SUBMITTED",
  );

  async function handleStartOrContinue(assignment: StudentAssignment) {
    const existingAttempt = assignment.attempts?.[0];
    if (existingAttempt && existingAttempt.status === "IN_PROGRESS") {
      router.push(`/student/attempts/${existingAttempt.id}`);
      return;
    }
    setStarting(true);
    try {
      const { data } = await apiFetch<{ id: string }>(
        `/student/assessments/${assignment.assessment.id}/start`,
        { method: "POST" },
      );
      router.push(`/student/attempts/${data.id}`);
    } catch {
      setStarting(false);
    }
  }

  return (
    <StudentShell>
      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-8">
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-[8px] bg-[#22c55e] p-5 text-white shadow-[0_10px_0_#129447] sm:p-7"
            initial={{ opacity: 0, y: 16 }}
          >
            <div className="relative z-10 max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/18 px-3 py-2 text-sm font-black">
                <Sparkles size={17} />
                {active ? "Misi hari ini siap" : "Belum ada misi aktif"}
              </span>
              <h1 className="font-heading mt-4 text-3xl font-black leading-tight sm:text-5xl">
                Halo, {user?.name ?? "Siswa"}.
              </h1>
              <p className="mt-4 max-w-lg font-bold leading-7 text-white/88">
                {active
                  ? `Asesmen "${active.assessment.title}" menunggumu. Jawaban tersimpan otomatis.`
                  : "Belum ada asesmen yang ditugaskan untukmu saat ini. Cek lagi nanti."}
              </p>
              {active ? (
                <button
                  className="mt-6 inline-flex items-center gap-2 rounded-[8px] bg-white px-5 py-4 font-heading font-black text-[#15803d] shadow-[0_6px_0_#d9f99d] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none disabled:opacity-70"
                  disabled={starting}
                  onClick={() => handleStartOrContinue(active)}
                  type="button"
                >
                  {starting ? <Loader2 className="animate-spin" size={18} /> : null}
                  {active.status === "STARTED" ? "Lanjutkan Misi" : "Mulai Misi"}
                  <Play size={18} fill="#15803d" />
                </button>
              ) : null}
            </div>
          </motion.div>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
            initial={{ opacity: 0, y: 16 }}
            transition={{ delay: 0.08 }}
          >
            <p className="text-sm font-black uppercase text-[#2563eb]">
              Ringkasan
            </p>
            <h2 className="font-heading text-2xl font-black">
              Progress kamu
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-[8px] bg-[#f8fafc] p-4">
                <ClipboardCheck className="mb-3 text-[#2563eb]" size={22} />
                <p className="font-heading text-2xl font-black">{completedCount}</p>
                <p className="mt-1 text-xs font-bold text-slate-500">Misi selesai</p>
              </div>
              <div className="rounded-[8px] bg-[#f8fafc] p-4">
                <Target className="mb-3 text-[#2563eb]" size={22} />
                <p className="font-heading text-2xl font-black">{assignments.length}</p>
                <p className="mt-1 text-xs font-bold text-slate-500">Total misi</p>
              </div>
            </div>
          </motion.div>
        </div>

        <section className="mt-8">
          <div className="mb-4">
            <p className="text-sm font-black uppercase text-[#22c55e]">
              Jalur belajar
            </p>
            <h2 className="font-heading text-2xl font-black">
              Misi kamu
            </h2>
          </div>

          {loading ? (
            <div className="grid place-items-center py-10">
              <Loader2 className="animate-spin text-slate-400" size={28} />
            </div>
          ) : assignments.length === 0 ? (
            <p className="rounded-[8px] border border-slate-200 bg-white p-8 text-center font-bold text-slate-500 shadow-sm">
              Belum ada asesmen yang ditugaskan.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {assignments.map((assignment, index) => (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm"
                  initial={{ opacity: 0, y: 18 }}
                  key={assignment.id}
                  transition={{ delay: index * 0.06 }}
                >
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <span className={`grid size-12 place-items-center rounded-[8px] ${toneByStatus[assignment.status]}`}>
                      <BookOpen size={24} />
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                      {statusLabel[assignment.status]}
                    </span>
                  </div>
                  <h3 className="font-heading text-xl font-black">
                    {assignment.assessment.title}
                  </h3>
                  <p className="mt-2 min-h-10 text-sm font-bold leading-5 text-slate-500">
                    {assignment.assessment.subject.name} - {assignment.assessment._count.questions} soal
                  </p>
                  <div className="mt-5">
                    <ProgressBar value={progressForStatus(assignment.status)} />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {lastSubmitted?.attempts?.[0] ? (
          <Link
            className="mt-6 flex items-center justify-between rounded-[8px] border-2 border-slate-200 bg-white px-5 py-4 font-heading font-black text-slate-700 shadow-[0_6px_0_#d8e2ef] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
            href={`/student/results/${lastSubmitted.attempts[0].id}`}
          >
            Lihat hasil terakhir
            <ArrowRight size={20} />
          </Link>
        ) : null}
      </section>
    </StudentShell>
  );
}
