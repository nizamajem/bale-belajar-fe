"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { BookOpen, Loader2, Search, ShieldQuestion, Sparkles, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import {
  CaseConfidenceDeclaration,
  CaseSubmitResult,
  confidenceDeclarationLabel,
  CurrentCase,
  evidenceRelevanceLabel,
} from "@/lib/types";
import { StudentShell } from "../../../_components/student-shell";

const CONFIDENCE_OPTIONS: CaseConfidenceDeclaration[] = [
  "HIGH",
  "MEDIUM",
  "LOW",
  "INSUFFICIENT_EVIDENCE",
];

export default function CaseRunnerPage() {
  const params = useParams<{ worldKey: string }>();
  const router = useRouter();
  const worldKey = params.worldKey;

  const [currentCase, setCurrentCase] = useState<CurrentCase | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [conclusionText, setConclusionText] = useState("");
  const [confidenceLevel, setConfidenceLevel] = useState<CaseConfidenceDeclaration | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<CaseSubmitResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const { data: current } = await apiFetch<CurrentCase>("/student/cases/current", {
          query: { worldKey },
        });

        if (current.attempt?.status === "SUBMITTED") {
          router.replace(`/student/world/${worldKey}/kasus/hasil`);
          return;
        }

        let active = current;
        if (!active.attempt) {
          await apiFetch(`/student/cases/${active.assignmentId}/start`, { method: "POST" });
          const { data: refreshed } = await apiFetch<CurrentCase>("/student/cases/current", {
            query: { worldKey },
          });
          active = refreshed;
        }

        if (cancelled) return;
        setCurrentCase(active);
        setAnswers(
          Object.fromEntries(active.questions.map((question) => [question.id, question.answerText ?? ""])),
        );
      } catch {
        if (!cancelled) setError("Kasus tidak dapat dimuat. Silakan coba lagi.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [worldKey, router]);

  function saveAnswer(questionId: string, text: string) {
    if (!currentCase?.attempt) return;
    apiFetch(`/student/case-attempts/${currentCase.attempt.id}/answers/${questionId}`, {
      method: "PUT",
      body: { answerText: text },
    }).catch(() => {
      // Autosave gagal secara diam-diam; siswa masih bisa melanjutkan dan submit ulang.
    });
  }

  async function handleSubmit() {
    if (!currentCase?.attempt || !confidenceLevel || !conclusionText.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const { data } = await apiFetch<CaseSubmitResult>(
        `/student/case-attempts/${currentCase.attempt.id}/submit`,
        { method: "POST", body: { conclusionText, confidenceLevel } },
      );
      setResult(data);
    } catch {
      setError("Kasus gagal disubmit. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <StudentShell>
        <div className="grid min-h-[60vh] place-items-center">
          <Loader2 className="animate-spin text-slate-400" size={32} />
        </div>
      </StudentShell>
    );
  }

  if (error && !currentCase) {
    return (
      <StudentShell>
        <section className="mx-auto max-w-3xl px-4 py-10 text-center sm:px-6">
          <p className="rounded-[8px] border border-slate-200 bg-white p-8 font-bold text-slate-500 shadow-sm">
            {error}
          </p>
        </section>
      </StudentShell>
    );
  }

  if (!currentCase) return null;

  if (result) {
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
              Kasus selesai!
            </span>
            <h1 className="font-heading mt-4 text-3xl font-black">Skor {Math.round(result.overallScore)}</h1>
            <p className="mt-2 font-bold text-white/90">+{result.xpGained} XP diperoleh</p>
            {result.gameProfile.accountLeveledUp ? (
              <p className="mt-1 font-black text-white">
                Naik level ke {result.gameProfile.accountLevel}!
              </p>
            ) : null}
          </motion.div>

          <div className="mt-5 space-y-3">
            {result.questions.map((question, index) => (
              <div className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm" key={question.questionId}>
                <div className="flex items-center justify-between gap-2">
                  <p className="font-heading font-black">
                    {index + 1}. {question.prompt}
                  </p>
                  <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                    {Math.round(question.score)}
                  </span>
                </div>
                {question.expectedReasoning ? (
                  <p className="mt-2 text-sm font-bold leading-6 text-slate-600">
                    {question.expectedReasoning}
                  </p>
                ) : null}
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

  const canSubmit = Boolean(confidenceLevel) && conclusionText.trim().length > 0 && !submitting;

  return (
    <StudentShell>
      <section className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:py-8">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[8px] bg-[#6d28d9] p-5 text-white shadow-[0_10px_0_#4c1d95]"
          initial={{ opacity: 0, y: 16 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white/18 px-3 py-2 text-sm font-black">
            <Sparkles size={17} />
            {currentCase.case.title}
          </span>
          <p className="mt-3 font-bold leading-6 text-white/90">{currentCase.case.openingStory}</p>
        </motion.div>

        {error ? (
          <p className="mt-4 rounded-[8px] border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-600">
            {error}
          </p>
        ) : null}

        <div className="mt-6 flex items-center gap-2">
          <Search className="text-[#6d28d9]" size={20} />
          <h2 className="font-heading text-xl font-black">Papan Bukti</h2>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {currentCase.evidence.map((item, index) => (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm"
              initial={{ opacity: 0, y: 16 }}
              key={item.id}
              transition={{ delay: index * 0.04 }}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full bg-[#ede9fe] px-3 py-1 text-xs font-black text-[#6d28d9]">
                  Bukti {item.orderNumber} - {item.type}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">
                  {evidenceRelevanceLabel(item.relevance)}
                </span>
              </div>
              <p className="mt-3 font-bold leading-6 text-slate-700">{item.content}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 flex items-center gap-2">
          <ShieldQuestion className="text-[#6d28d9]" size={20} />
          <h2 className="font-heading text-xl font-black">Pertanyaan Penalaran</h2>
        </div>
        <div className="mt-3 space-y-4">
          {currentCase.questions.map((question, index) => (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm"
              initial={{ opacity: 0, y: 16 }}
              key={question.id}
              transition={{ delay: index * 0.05 }}
            >
              <p className="font-heading text-lg font-black">
                {index + 1}. {question.prompt}
              </p>
              <p className="mt-1 text-xs font-black uppercase text-slate-400">
                Kompetensi: {question.skill.name}
              </p>
              <textarea
                className="mt-3 w-full rounded-[8px] border-2 border-slate-200 p-3 font-bold text-slate-700 outline-none focus:border-[#6d28d9]"
                onBlur={(event) => saveAnswer(question.id, event.target.value)}
                onChange={(event) =>
                  setAnswers((prev) => ({ ...prev, [question.id]: event.target.value }))
                }
                placeholder="Tuliskan alasan dan analisismu di sini..."
                rows={3}
                value={answers[question.id] ?? ""}
              />
            </motion.div>
          ))}
        </div>

        <div className="mt-8 rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <BookOpen className="text-[#6d28d9]" size={20} />
            <h2 className="font-heading text-xl font-black">Kesimpulan Detektif</h2>
          </div>
          <textarea
            className="mt-3 w-full rounded-[8px] border-2 border-slate-200 p-3 font-bold text-slate-700 outline-none focus:border-[#6d28d9]"
            onChange={(event) => setConclusionText(event.target.value)}
            placeholder="Apa kesimpulanmu dari kasus ini?"
            rows={4}
            value={conclusionText}
          />

          <p className="mt-4 text-sm font-black uppercase text-slate-500">Tingkat Keyakinan</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {CONFIDENCE_OPTIONS.map((option) => {
              const selected = confidenceLevel === option;
              return (
                <button
                  className={[
                    "rounded-[8px] border-2 px-4 py-3 text-left font-bold transition",
                    selected
                      ? "border-[#6d28d9] bg-[#f5f3ff] text-[#4c1d95]"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300",
                  ].join(" ")}
                  key={option}
                  onClick={() => setConfidenceLevel(option)}
                  type="button"
                >
                  {confidenceDeclarationLabel(option)}
                </button>
              );
            })}
          </div>
        </div>

        <button
          className="mt-6 inline-flex items-center gap-2 rounded-[8px] bg-[#22c55e] px-6 py-4 font-heading font-black text-white shadow-[0_6px_0_#129447] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none disabled:opacity-60"
          disabled={!canSubmit}
          onClick={handleSubmit}
          type="button"
        >
          {submitting ? <Loader2 className="animate-spin" size={18} /> : null}
          Selesaikan Kasus
        </button>
      </section>
    </StudentShell>
  );
}
