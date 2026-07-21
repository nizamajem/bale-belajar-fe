"use client";

import { motion } from "framer-motion";
import { ClipboardCheck, GraduationCap, Loader2, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import {
  DashboardShell,
  MetricCard,
} from "../../_components/dashboard-shell";
import { Assessment, Classroom } from "@/lib/types";

type ProgressRow = { status: string; count: number };

const statusLabel: Record<string, string> = {
  ASSIGNED: "Ditugaskan",
  STARTED: "Sedang mengerjakan",
  COMPLETED: "Selesai",
  EXPIRED: "Kedaluwarsa",
};

export default function TeacherDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [activeAssessment, setActiveAssessment] = useState<Assessment | null>(null);
  const [progress, setProgress] = useState<ProgressRow[]>([]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [classroomsRes, assessmentsRes] = await Promise.all([
          apiFetch<Classroom[]>("/classrooms", { query: { page: 1, limit: 100 } }),
          apiFetch<Assessment[]>("/assessments", { query: { page: 1, limit: 100 } }),
        ]);
        setClassrooms(classroomsRes.data);
        setAssessments(assessmentsRes.data);

        const firstActive = assessmentsRes.data.find((a) => a.status === "ACTIVE") ?? null;
        setActiveAssessment(firstActive);
        if (firstActive) {
          const { data } = await apiFetch<ProgressRow[]>(
            `/assessments/${firstActive.id}/progress`,
          );
          setProgress(data);
        }
      } catch {
        // keep empty state on failure
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  const totalStudents = classrooms.reduce((sum, c) => sum + (c._count?.students ?? 0), 0);
  const activeCount = assessments.filter((a) => a.status === "ACTIVE").length;
  const totalAssigned = progress.reduce((sum, p) => sum + p.count, 0);

  return (
    <DashboardShell role="teacher" title="Dashboard Guru">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Jumlah kelas" value={loading ? "-" : String(classrooms.length)} />
        <MetricCard label="Total siswa" tone="green" value={loading ? "-" : String(totalStudents)} />
        <MetricCard label="Asesmen aktif" tone="yellow" value={loading ? "-" : String(activeCount)} />
        <MetricCard label="Total asesmen" tone="red" value={loading ? "-" : String(assessments.length)} />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <motion.section
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
          initial={{ opacity: 0, y: 14 }}
        >
          <div className="mb-5">
            <p className="text-sm font-black uppercase text-[#2563eb]">
              Progress pengerjaan
            </p>
            <h2 className="font-heading text-2xl font-black">
              {activeAssessment ? activeAssessment.title : "Belum ada asesmen aktif"}
            </h2>
          </div>

          {loading ? (
            <div className="grid place-items-center py-10">
              <Loader2 className="animate-spin text-slate-400" size={28} />
            </div>
          ) : !activeAssessment ? (
            <p className="rounded-[8px] bg-[#f8fafc] p-5 text-sm font-bold text-slate-500">
              Belum ada asesmen berstatus aktif saat ini.
            </p>
          ) : (
            <div className="space-y-3">
              {progress.map((row) => (
                <div className="rounded-[8px] bg-[#f8fafc] p-4" key={row.status}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-heading font-black">
                      {statusLabel[row.status] ?? row.status}
                    </span>
                    <span className="font-heading font-black">{row.count}</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-[#2563eb]"
                      style={{
                        width: totalAssigned ? `${(row.count / totalAssigned) * 100}%` : "0%",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.section>

        <motion.section
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
          initial={{ opacity: 0, y: 14 }}
          transition={{ delay: 0.08 }}
        >
          <div className="mb-5 flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-[8px] bg-[#eff6ff] text-[#2563eb]">
              <GraduationCap size={23} />
            </span>
            <div>
              <p className="text-sm font-black uppercase text-[#2563eb]">
                Kelas saya
              </p>
              <h2 className="font-heading text-2xl font-black">Ringkasan</h2>
            </div>
          </div>

          <div className="space-y-3">
            {classrooms.length === 0 && !loading ? (
              <p className="rounded-[8px] bg-[#f8fafc] p-4 text-sm font-bold text-slate-500">
                Belum ada kelas terdaftar.
              </p>
            ) : null}
            {classrooms.slice(0, 5).map((classroom) => (
              <div className="rounded-[8px] bg-[#f8fafc] p-4" key={classroom.id}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-heading font-black">{classroom.name}</p>
                    <p className="text-sm font-bold text-slate-500">Kelas {classroom.gradeLevel}</p>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-black text-slate-600">
                    <UsersRound size={15} />
                    {classroom._count?.students ?? 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      </div>

      <div className="mt-5">
        <section className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex items-center gap-3">
            <ClipboardCheck className="text-[#22c55e]" size={24} />
            <h2 className="font-heading text-xl font-black">Ringkasan asesmen</h2>
          </div>
          {loading ? (
            <div className="grid place-items-center py-6">
              <Loader2 className="animate-spin text-slate-400" size={24} />
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-3">
              {(["DRAFT", "ACTIVE", "CLOSED"] as const).map((status) => (
                <div className="rounded-[8px] bg-[#f8fafc] p-4 text-center" key={status}>
                  <p className="font-heading text-2xl font-black">
                    {assessments.filter((a) => a.status === status).length}
                  </p>
                  <p className="mt-1 text-xs font-black uppercase text-slate-500">{status}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </DashboardShell>
  );
}
