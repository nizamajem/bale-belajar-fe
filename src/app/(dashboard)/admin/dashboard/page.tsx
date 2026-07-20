"use client";

import { motion } from "framer-motion";
import { Clock3, School, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import {
  DashboardShell,
  MetricCard,
} from "../../_components/dashboard-shell";
import { Assessment, pilotStatusProgress, School as SchoolType, SchoolLead } from "@/lib/types";

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Baru saja";
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  return `${Math.floor(hours / 24)} hari lalu`;
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [totalSchools, setTotalSchools] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [activeAssessments, setActiveAssessments] = useState(0);
  const [totalAssessments, setTotalAssessments] = useState(0);
  const [schools, setSchools] = useState<SchoolType[]>([]);
  const [leads, setLeads] = useState<SchoolLead[]>([]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [schoolsRes, studentsRes, assessmentsRes, leadsRes] = await Promise.all([
          apiFetch<SchoolType[]>("/schools", { query: { page: 1, limit: 5 } }),
          apiFetch<unknown[]>("/students", { query: { page: 1, limit: 1 } }),
          apiFetch<Assessment[]>("/assessments", { query: { page: 1, limit: 100 } }),
          apiFetch<SchoolLead[]>("/leads", { query: { page: 1, limit: 5 } }),
        ]);
        setSchools(schoolsRes.data);
        setTotalSchools(schoolsRes.meta?.total ?? schoolsRes.data.length);
        setTotalStudents(studentsRes.meta?.total ?? 0);
        setTotalAssessments(assessmentsRes.meta?.total ?? assessmentsRes.data.length);
        setActiveAssessments(assessmentsRes.data.filter((a) => a.status === "ACTIVE").length);
        setLeads(leadsRes.data);
      } catch {
        // metrics stay at 0 if the request fails; page remains usable
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  return (
    <DashboardShell role="admin" title="Dashboard Admin">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total sekolah" value={loading ? "-" : String(totalSchools)} />
        <MetricCard label="Total siswa" tone="green" value={loading ? "-" : String(totalStudents)} />
        <MetricCard label="Asesmen aktif" tone="yellow" value={loading ? "-" : String(activeAssessments)} />
        <MetricCard label="Total asesmen" tone="red" value={loading ? "-" : String(totalAssessments)} />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <motion.section
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm"
          initial={{ opacity: 0, y: 14 }}
        >
          <div className="mb-5">
            <p className="text-sm font-black uppercase text-[#2563eb]">
              Ringkasan
            </p>
            <h2 className="font-heading text-2xl font-black">
              {totalSchools} sekolah terdaftar di platform
            </h2>
          </div>

          <div className="grid gap-3">
            {schools.length === 0 && !loading ? (
              <p className="rounded-[8px] bg-[#f8fafc] p-5 text-sm font-bold text-slate-500">
                Belum ada sekolah terdaftar.
              </p>
            ) : null}
            {schools.map((school, index) => {
              const progress = pilotStatusProgress(school.pilotStatus);
              return (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-[8px] bg-[#f8fafc] p-4"
                  initial={{ opacity: 0, y: 10 }}
                  key={school.id}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="grid size-10 place-items-center rounded-[8px] bg-white text-[#2563eb]">
                        <School size={19} />
                      </span>
                      <div>
                        <p className="font-heading font-black">{school.name}</p>
                        <p className="text-xs font-bold text-slate-500">{school.pilotStatus}</p>
                      </div>
                    </div>
                    <span className="font-heading font-black">{progress}%</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-[#22c55e]"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </motion.div>
              );
            })}
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
          <h2 className="font-heading text-2xl font-black">Pengajuan terbaru</h2>
          <div className="mt-5 space-y-3">
            {leads.length === 0 && !loading ? (
              <p className="rounded-[8px] bg-[#f8fafc] p-4 text-sm font-bold text-slate-500">
                Belum ada pengajuan pilot masuk.
              </p>
            ) : null}
            {leads.map(({ id, schoolName, contactName, status }) => (
              <div className="rounded-[8px] bg-[#f8fafc] p-4" key={id}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-heading font-black">{schoolName}</p>
                    <p className="text-xs font-bold text-slate-500">{contactName}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-600">
                    {status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      </div>

      <div className="mt-5">
        <section className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <UsersRound className="text-[#2563eb]" size={24} />
            <h2 className="font-heading text-xl font-black">Aktivitas lead terbaru</h2>
          </div>
          <div className="space-y-3">
            {leads.length === 0 && !loading ? (
              <p className="rounded-[8px] bg-[#f8fafc] p-4 text-sm font-bold text-slate-500">
                Belum ada aktivitas.
              </p>
            ) : null}
            {leads.map(({ id, schoolName, createdAt }) => (
              <div
                className="flex items-center justify-between gap-4 rounded-[8px] bg-[#f8fafc] p-4"
                key={id}
              >
                <div>
                  <p className="font-heading font-black">{schoolName}</p>
                  <p className="text-sm font-bold text-slate-500">Mengirim pengajuan pilot baru</p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-black text-slate-400">
                  <Clock3 size={14} />
                  {timeAgo(createdAt)}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
