"use client";

import { AlertTriangle, FileText, Loader2, Target, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { DashboardShell, MetricCard } from "../../_components/dashboard-shell";
import { Assessment } from "@/lib/types";

type AssessmentResultRow = {
  attemptId: string;
  studentId: string;
  studentName: string;
  participantCode: string;
  totalScore: number;
  correctAnswers: number;
  wrongAnswers: number;
  unanswered: number;
  lowestCompetency: {
    competencyName: string;
    score: number;
    masteryStatus: string;
  } | null;
  recommendations: {
    title: string;
    description: string;
    competencyName: string;
    recommendedDays: number;
  }[];
};

type AssessmentResultsResponse = {
  assessmentId: string;
  assessmentTitle: string;
  submittedCount: number;
  averageScore: number;
  results: AssessmentResultRow[];
  note: string;
};

export default function TeacherReportsPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<AssessmentResultsResponse | null>(null);
  const [note, setNote] = useState("");
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
    setNote("");
    apiFetch<AssessmentResultsResponse>(`/assessments/${selectedId}/results`)
      .then(({ data }) => {
        setReport(data);
        setNote(data.note);
      })
      .catch(() => {
        setReport(null);
        setNote("Laporan belum bisa dimuat dari backend.");
      })
      .finally(() => setResultsLoading(false));
  }, [selectedId]);

  const remedialCount =
    report?.results.filter((result) => result.recommendations.length > 0).length ?? 0;

  return (
    <DashboardShell role="teacher" title="Laporan Siswa">
      <section className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase text-[#22c55e]">
              Laporan kelas
            </p>
            <h2 className="font-heading text-2xl font-black">
              Hasil asesmen dan rekomendasi remedial
            </h2>
            <p className="mt-1 text-sm font-bold text-slate-500">
              Dipakai guru untuk menentukan pengulangan materi, kelompok kecil, dan tindak lanjut siswa.
            </p>
          </div>
          {loading ? null : (
            <select
              className="w-full rounded-[8px] border-2 border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-600 sm:w-auto"
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
            <EmptyState text="Pilih asesmen untuk melihat hasil siswa." />
          ) : !report || report.results.length === 0 ? (
            <div className="flex items-start gap-3 rounded-[8px] bg-[#fffbeb] p-5 text-sm font-bold leading-6 text-[#92400e]">
              <AlertTriangle className="mt-0.5 shrink-0" size={20} />
              <p>
                {note ||
                  "Belum ada siswa yang submit. Laporan akan otomatis muncul setelah attempt selesai."}
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-3">
                <MetricCard label="Siswa submit" value={String(report.submittedCount)} />
                <MetricCard label="Rata-rata kelas" tone="green" value={`${report.averageScore}%`} />
                <MetricCard label="Perlu remedial" tone="yellow" value={String(remedialCount)} />
              </div>

              <div className="mt-5 grid gap-3">
                {report.results.map((result) => (
                  <article className="rounded-[8px] bg-[#f8fafc] p-4" key={result.attemptId}>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex gap-3">
                        <span className="grid size-11 shrink-0 place-items-center rounded-[8px] bg-white text-[#2563eb]">
                          <FileText size={20} />
                        </span>
                        <div>
                          <h3 className="font-heading text-lg font-black">{result.studentName}</h3>
                          <p className="text-sm font-bold text-slate-500">
                            Kode {result.participantCode} - benar {result.correctAnswers}, salah {result.wrongAnswers}, kosong {result.unanswered}
                          </p>
                        </div>
                      </div>
                      <span className="rounded-[8px] bg-white px-4 py-2 font-heading text-xl font-black text-[#172033]">
                        {Math.round(result.totalScore)}%
                      </span>
                    </div>

                    {result.lowestCompetency ? (
                      <div className="mt-4 rounded-[8px] bg-white p-4">
                        <div className="flex items-start gap-3">
                          <Target className="mt-1 shrink-0 text-[#eab308]" size={20} />
                          <div>
                            <p className="text-xs font-black uppercase text-slate-400">Prioritas belajar</p>
                            <p className="font-heading font-black">
                              {result.lowestCompetency.competencyName} - {Math.round(result.lowestCompetency.score)}%
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {result.recommendations.length ? (
                      <div className="mt-3 grid gap-2">
                        {result.recommendations.map((recommendation) => (
                          <div className="rounded-[8px] border border-[#bbf7d0] bg-[#f0fdf4] p-3 text-sm font-bold leading-6 text-[#166534]" key={`${result.attemptId}-${recommendation.title}`}>
                            <p className="font-heading font-black">{recommendation.title}</p>
                            <p>{recommendation.description}</p>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </DashboardShell>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="grid place-items-center rounded-[8px] bg-[#f8fafc] px-4 py-10 text-center">
      <UsersRound className="text-slate-300" size={34} />
      <p className="mt-3 font-heading font-black text-slate-600">{text}</p>
    </div>
  );
}
