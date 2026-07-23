"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckCircle2, Loader2, Trophy, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { CaseResultView, confidenceDeclarationLabel, CurrentCase } from "@/lib/types";
import { StudentShell } from "../../../../_components/student-shell";

const PASS_THRESHOLD = 60;

export default function CaseResultPage() {
  const params = useParams<{ worldKey: string }>();
  const worldKey = params.worldKey;

  const [result, setResult] = useState<CaseResultView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const { data: current } = await apiFetch<CurrentCase>("/student/cases/current", {
          query: { worldKey },
        });

        if (!current.attempt || current.attempt.status === "IN_PROGRESS") {
          if (!cancelled) setError("Kasus hari ini belum diselesaikan.");
          return;
        }

        const { data } = await apiFetch<CaseResultView>(
          `/student/case-attempts/${current.attempt.id}/result`,
        );
        if (!cancelled) setResult(data);
      } catch {
        if (!cancelled) setError("Hasil kasus belum tersedia.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [worldKey]);

  if (loading) {
    return (
      <StudentShell>
        <div className="grid min-h-[60vh] place-items-center">
          <Loader2 className="animate-spin text-slate-400" size={32} />
        </div>
      </StudentShell>
    );
  }

  if (error || !result) {
    return (
      <StudentShell>
        <section className="mx-auto max-w-3xl px-4 py-10 text-center sm:px-6">
          <p className="rounded-[8px] border border-slate-200 bg-white p-8 font-bold text-slate-500 shadow-sm">
            {error ?? "Hasil tidak ditemukan."}
          </p>
          <Link
            className="mt-4 inline-flex items-center gap-2 rounded-[8px] bg-[#6d28d9] px-5 py-4 font-heading font-black text-white shadow-[0_6px_0_#4c1d95]"
            href={`/student/world/${worldKey}`}
          >
            Kembali ke Dunia
          </Link>
        </section>
      </StudentShell>
    );
  }

  return (
    <StudentShell>
      <section className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:py-8">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[8px] bg-[#22c55e] p-6 text-white shadow-[0_10px_0_#129447]"
          initial={{ opacity: 0, y: 16 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white/18 px-3 py-2 text-sm font-black">
            <Trophy size={17} />
            {result.title}
          </span>
          <h1 className="font-heading mt-4 text-3xl font-black">Skor {Math.round(result.overallScore)}</h1>
        </motion.div>

        <div className="mt-5 rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-black uppercase text-[#6d28d9]">Kesimpulanmu</p>
          <p className="mt-2 font-bold leading-6 text-slate-700">{result.conclusionText}</p>
          {result.confidenceLevel ? (
            <p className="mt-3 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
              {confidenceDeclarationLabel(result.confidenceLevel)}
            </p>
          ) : null}
        </div>

        <div className="mt-5 space-y-3">
          {result.questions.map((question, index) => (
            <div className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm" key={question.questionId}>
              <div className="flex items-center gap-2">
                {question.score >= PASS_THRESHOLD ? (
                  <CheckCircle2 className="text-[#16a34a]" size={20} />
                ) : (
                  <XCircle className="text-[#e11d48]" size={20} />
                )}
                <p className="font-heading font-black">
                  {index + 1}. {question.prompt}
                </p>
              </div>
              <p className="mt-1 text-xs font-black uppercase text-slate-400">
                Kompetensi: {question.skill.name} - Skor {Math.round(question.score)}
              </p>
              {question.answerText ? (
                <p className="mt-3 rounded-[8px] bg-slate-50 p-3 text-sm font-bold leading-6 text-slate-600">
                  {question.answerText}
                </p>
              ) : null}
              <p className="mt-3 text-sm font-bold leading-6 text-slate-500">
                <span className="font-black text-slate-600">Penjelasan: </span>
                {question.expectedReasoning}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            className="inline-flex items-center gap-2 rounded-[8px] bg-[#2563eb] px-5 py-4 font-heading font-black text-white shadow-[0_6px_0_#1e40af] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
            href={`/student/growth-map?worldKey=${worldKey}`}
          >
            Lihat Peta Tumbuh
          </Link>
          <Link
            className="inline-flex items-center gap-2 rounded-[8px] border-2 border-slate-200 bg-white px-5 py-4 font-heading font-black text-slate-700 shadow-[0_6px_0_#d8e2ef] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
            href={`/student/world/${worldKey}`}
          >
            Kembali ke Dunia
          </Link>
        </div>
      </section>
    </StudentShell>
  );
}
