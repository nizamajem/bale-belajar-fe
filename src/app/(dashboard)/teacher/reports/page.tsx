"use client";

import { AlertTriangle, FileText, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { DashboardShell } from "../../_components/dashboard-shell";
import { Assessment } from "@/lib/types";

export default function TeacherReportsPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<unknown[]>([]);
  const [resultsLoading, setResultsLoading] = useState(false);

  useEffect(() => {
    apiFetch<Assessment[]>("/assessments", { query: { page: 1, limit: 100 } })
      .then(({ data }) => {
        setAssessments(data);
        const firstClosed = data.find((a) => a.status === "CLOSED" || a.status === "ACTIVE");
        if (firstClosed) setSelectedId(firstClosed.id);
      })
      .catch(() => setAssessments([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    setResultsLoading(true);
    apiFetch<unknown[]>(`/assessments/${selectedId}/results`)
      .then(({ data }) => setResults(data))
      .catch(() => setResults([]))
      .finally(() => setResultsLoading(false));
  }, [selectedId]);

  return (
    <DashboardShell role="teacher" title="Laporan Siswa">
      <section className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase text-[#22c55e]">
              Parent report
            </p>
            <h2 className="font-heading text-2xl font-black">
              Ringkasan hasil siswa
            </h2>
          </div>
          {loading ? null : (
            <select
              className="rounded-[8px] border-2 border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-600"
              onChange={(event) => setSelectedId(event.target.value)}
              value={selectedId}
            >
              <option value="">Pilih asesmen</option>
              {assessments.map((assessment) => (
                <option key={assessment.id} value={assessment.id}>
                  {assessment.title}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="mt-5">
          {loading || resultsLoading ? (
            <div className="grid place-items-center py-10">
              <Loader2 className="animate-spin text-slate-400" size={28} />
            </div>
          ) : !selectedId ? (
            <p className="py-10 text-center font-bold text-slate-500">
              Pilih asesmen untuk melihat hasil siswa.
            </p>
          ) : results.length === 0 ? (
            <div className="flex items-start gap-3 rounded-[8px] bg-[#fffbeb] p-5 text-sm font-bold text-[#92400e]">
              <AlertTriangle className="mt-0.5 shrink-0" size={20} />
              <p>
                Laporan agregat per siswa belum tersedia dari backend untuk asesmen
                ini (endpoint hasil masih dalam pengembangan). Hasil individual
                bisa dilihat langsung oleh siswa masing-masing setelah mengerjakan.
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {results.map((result, index) => (
                <div
                  className="flex items-center gap-3 rounded-[8px] bg-[#f8fafc] p-4"
                  key={index}
                >
                  <span className="grid size-11 place-items-center rounded-[8px] bg-white text-[#2563eb]">
                    <FileText size={20} />
                  </span>
                  <pre className="text-xs">{JSON.stringify(result)}</pre>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </DashboardShell>
  );
}
