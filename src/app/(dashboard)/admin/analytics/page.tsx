"use client";

import { motion } from "framer-motion";
import { BarChart3, ClipboardList, Loader2, School, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Assessment, School as SchoolType, SchoolLead } from "@/lib/types";
import { DashboardShell, MetricCard } from "../../_components/dashboard-shell";

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [schools, setSchools] = useState<SchoolType[]>([]);
  const [leads, setLeads] = useState<SchoolLead[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [totalStudents, setTotalStudents] = useState(0);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [schoolsRes, studentsRes, assessmentsRes, leadsRes] = await Promise.all([
          apiFetch<SchoolType[]>("/schools", { query: { page: 1, limit: 100 } }),
          apiFetch<unknown[]>("/students", { query: { page: 1, limit: 1 } }),
          apiFetch<Assessment[]>("/assessments", { query: { page: 1, limit: 100 } }),
          apiFetch<SchoolLead[]>("/leads", { query: { page: 1, limit: 100 } }),
        ]);
        setSchools(schoolsRes.data);
        setTotalStudents(studentsRes.meta?.total ?? 0);
        setAssessments(assessmentsRes.data);
        setLeads(leadsRes.data);
      } catch {
        setSchools([]);
        setAssessments([]);
        setLeads([]);
        setTotalStudents(0);
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

  const activePilot = schools.filter((school) => school.pilotStatus === "ACTIVE_PILOT").length;
  const activeAssessments = assessments.filter((assessment) => assessment.status === "ACTIVE").length;
  const newLeads = leads.filter((lead) => lead.status === "NEW").length;

  return (
    <DashboardShell role="admin" title="Analitik">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Sekolah pilot" value={loading ? "-" : String(activePilot)} />
        <MetricCard label="Total siswa" tone="green" value={loading ? "-" : String(totalStudents)} />
        <MetricCard label="Asesmen aktif" tone="yellow" value={loading ? "-" : String(activeAssessments)} />
        <MetricCard label="Lead baru" tone="red" value={loading ? "-" : String(newLeads)} />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-5 flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-[8px] bg-[#eff6ff] text-[#2563eb]">
              <BarChart3 size={23} />
            </span>
            <div>
              <p className="text-sm font-black uppercase text-[#2563eb]">Distribusi</p>
              <h2 className="font-heading text-2xl font-black">Status asesmen</h2>
            </div>
          </div>
          {loading ? (
            <div className="grid place-items-center py-10">
              <Loader2 className="animate-spin text-slate-400" size={28} />
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-3">
              {(["DRAFT", "ACTIVE", "CLOSED"] as const).map((status) => (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-[8px] bg-[#f8fafc] p-4"
                  initial={{ opacity: 0, y: 10 }}
                  key={status}
                >
                  <ClipboardList className="mb-3 text-[#22c55e]" size={22} />
                  <p className="font-heading text-2xl font-black">
                    {assessments.filter((assessment) => assessment.status === status).length}
                  </p>
                  <p className="text-xs font-black uppercase text-slate-500">{status}</p>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-5 flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-[8px] bg-[#f0fdf4] text-[#16a34a]">
              <School size={23} />
            </span>
            <div>
              <p className="text-sm font-black uppercase text-[#22c55e]">Sekolah</p>
              <h2 className="font-heading text-2xl font-black">Status pilot</h2>
            </div>
          </div>
          <div className="space-y-3">
            {schools.length === 0 && !loading ? (
              <p className="rounded-[8px] bg-[#f8fafc] p-4 text-sm font-bold text-slate-500">
                Belum ada data sekolah.
              </p>
            ) : null}
            {schools.slice(0, 5).map((school) => (
              <div className="rounded-[8px] bg-[#f8fafc] p-4" key={school.id}>
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-heading font-black">{school.name}</p>
                    <p className="text-sm font-bold text-slate-500">{school.city}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-black text-slate-600">
                    {school.pilotStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-5 rounded-[8px] border border-slate-200 bg-[#172033] p-4 text-white shadow-sm sm:p-5">
        <UsersRound className="text-[#f9c74f]" size={28} />
        <h2 className="font-heading mt-4 text-2xl font-black">Insight operasional</h2>
        <p className="mt-2 max-w-3xl font-semibold leading-7 text-slate-300">
          Halaman ini membaca data live dari sekolah, siswa, asesmen, dan lead pilot.
          Grafik lanjutan bisa ditambahkan di atas struktur data yang sama.
        </p>
      </section>
    </DashboardShell>
  );
}
