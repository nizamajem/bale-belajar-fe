"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AlertTriangle, ArrowLeft, Bookmark, Check, Clock3, Flag, Loader2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { apiFetch, ApiError } from "@/lib/api";
import { ProgressBar, StudentShell } from "../../_components/student-shell";

type Option = { id: string; optionKey: string; optionText: string; imageUrl?: string; orderNumber: number };
type Question = {
  id: string;
  orderNumber: number;
  questionText: string;
  imageUrl?: string;
  options: Option[];
};
type Answer = { questionId: string; selectedOptionId?: string; isMarkedForReview: boolean };
type AttemptDetail = {
  id: string;
  status: string;
  durationMinutes?: number;
  startedAt: string;
  serverTime: string;
  assessment: { id: string; title: string };
  answers: Answer[];
  questions: Question[];
};

export default function AttemptPage() {
  const params = useParams<{ attemptId: string }>();
  const router = useRouter();
  const [attempt, setAttempt] = useState<AttemptDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const [submitting, setSubmitting] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);

  useEffect(() => {
    apiFetch<AttemptDetail>(`/student/attempts/${params.attemptId}`)
      .then(({ data }) => {
        if (data.status !== "IN_PROGRESS") {
          router.replace(`/student/results/${data.id}`);
          return;
        }
        const sorted = [...data.questions].sort((a, b) => a.orderNumber - b.orderNumber);
        setAttempt({ ...data, questions: sorted });
        const answerMap: Record<string, Answer> = {};
        data.answers.forEach((a) => {
          answerMap[a.questionId] = a;
        });
        setAnswers(answerMap);

        if (data.durationMinutes) {
          const startedAt = new Date(data.startedAt).getTime();
          const serverNow = new Date(data.serverTime).getTime();
          const elapsedSec = Math.floor((serverNow - startedAt) / 1000);
          const totalSec = data.durationMinutes * 60;
          setRemainingSeconds(Math.max(totalSec - elapsedSec, 0));
        }
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : "Gagal memuat asesmen."))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.attemptId]);

  const timerActive = remainingSeconds !== null;
  useEffect(() => {
    if (!timerActive) return;
    const interval = setInterval(() => {
      setRemainingSeconds((value) => (value !== null && value > 0 ? value - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive]);

  const currentQuestion = attempt?.questions[currentIndex];
  const answeredCount = useMemo(
    () => Object.values(answers).filter((a) => a.selectedOptionId).length,
    [answers],
  );

  async function selectOption(optionId: string) {
    if (!currentQuestion || !attempt) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        questionId: currentQuestion.id,
        selectedOptionId: optionId,
        isMarkedForReview: prev[currentQuestion.id]?.isMarkedForReview ?? false,
      },
    }));
    setSaveState("saving");
    try {
      await apiFetch(`/student/attempts/${attempt.id}/answers/${currentQuestion.id}`, {
        method: "PUT",
        body: { selectedOptionId: optionId },
      });
      setSaveState("saved");
    } catch {
      setSaveState("idle");
    }
  }

  async function toggleMark() {
    if (!currentQuestion || !attempt) return;
    const nextMarked = !(answers[currentQuestion.id]?.isMarkedForReview ?? false);
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        questionId: currentQuestion.id,
        selectedOptionId: prev[currentQuestion.id]?.selectedOptionId,
        isMarkedForReview: nextMarked,
      },
    }));
    try {
      await apiFetch(`/student/attempts/${attempt.id}/mark/${currentQuestion.id}`, {
        method: "POST",
        body: { isMarkedForReview: nextMarked },
      });
    } catch {
      // local state already reflects the intent; ignore transient failure
    }
  }

  async function handleSubmit() {
    if (!attempt) return;
    setSubmitting(true);
    try {
      await apiFetch(`/student/attempts/${attempt.id}/submit`, { method: "POST" });
      router.push(`/student/results/${attempt.id}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Gagal mengumpulkan jawaban.");
      setSubmitting(false);
    }
  }

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  if (loading) {
    return (
      <StudentShell>
        <div className="grid place-items-center py-20">
          <Loader2 className="animate-spin text-slate-400" size={28} />
        </div>
      </StudentShell>
    );
  }

  if (error || !attempt || !currentQuestion) {
    return (
      <StudentShell>
        <div className="mx-auto max-w-xl px-4 py-10 text-center">
          <p className="font-bold text-[#e11d48]">{error ?? "Asesmen tidak ditemukan."}</p>
          <Link className="mt-4 inline-block font-heading font-black text-[#2563eb]" href="/student/dashboard">
            Kembali ke beranda
          </Link>
        </div>
      </StudentShell>
    );
  }

  const total = attempt.questions.length;
  const currentAnswer = answers[currentQuestion.id];
  const marked = currentAnswer?.isMarkedForReview ?? false;
  const progressPct = Math.round(((currentIndex + 1) / total) * 100);
  const unansweredCount = total - answeredCount;

  return (
    <StudentShell>
      <section className="mx-auto grid max-w-6xl gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[1fr_320px] lg:py-8">
        <div className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <Link
              className="inline-flex items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-600 shadow-[0_4px_0_#d8e2ef] active:translate-y-1 active:shadow-none"
              href="/student/dashboard"
            >
              <ArrowLeft size={17} />
              Keluar
            </Link>
            {remainingSeconds !== null ? (
              <div className="flex items-center gap-2 rounded-full bg-[#eff6ff] px-4 py-2 font-heading font-black text-[#2563eb]">
                <Clock3 size={18} />
                {formatTime(remainingSeconds)}
              </div>
            ) : null}
          </div>

          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between text-sm font-black text-slate-500">
              <span>Soal {currentIndex + 1} dari {total}</span>
              <span>{progressPct}%</span>
            </div>
            <ProgressBar color="bg-[#2563eb]" value={progressPct} />
          </div>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[8px] bg-[#f8fafc] p-5 sm:p-6"
            initial={{ opacity: 0, y: 12 }}
            key={currentQuestion.id}
          >
            <p className="mb-3 text-sm font-black uppercase text-[#22c55e]">
              {attempt.assessment.title}
            </p>
            <h1 className="font-heading text-2xl font-black leading-tight text-[#172033] sm:text-3xl">
              {currentQuestion.questionText}
            </h1>
          </motion.div>

          <div className="mt-5 grid gap-3">
            {currentQuestion.options.map((option) => {
              const active = currentAnswer?.selectedOptionId === option.id;

              return (
                <motion.button
                  animate={{ opacity: 1, x: 0 }}
                  className={[
                    "flex min-h-16 items-center gap-3 rounded-[8px] border-2 px-4 py-3 text-left font-heading text-lg font-black transition active:translate-y-1",
                    active
                      ? "border-[#22c55e] bg-[#f0fdf4] shadow-[0_6px_0_#bbf7d0]"
                      : "border-slate-200 bg-white shadow-[0_6px_0_#e2e8f0] hover:-translate-y-0.5 hover:border-[#93c5fd]",
                  ].join(" ")}
                  initial={{ opacity: 0, x: -14 }}
                  key={option.id}
                  onClick={() => selectOption(option.id)}
                  type="button"
                >
                  <span
                    className={[
                      "grid size-10 shrink-0 place-items-center rounded-[8px] border-2",
                      active
                        ? "border-[#22c55e] bg-[#22c55e] text-white"
                        : "border-slate-200 bg-slate-50 text-slate-500",
                    ].join(" ")}
                  >
                    {option.optionKey}
                  </span>
                  <span className="min-w-0 text-base leading-6 sm:text-lg">{option.optionText}</span>
                </motion.button>
              );
            })}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              className={[
                "inline-flex items-center justify-center gap-2 rounded-[8px] border-2 px-4 py-3 font-heading font-black shadow-[0_5px_0_#d8e2ef] transition active:translate-y-1 active:shadow-none",
                marked
                  ? "border-[#f9c74f] bg-[#fffbeb] text-[#92400e]"
                  : "border-slate-200 bg-white text-slate-600",
              ].join(" ")}
              onClick={toggleMark}
              type="button"
            >
              <Bookmark size={18} fill={marked ? "#f9c74f" : "none"} />
              Tandai
            </button>

            <span className="inline-flex items-center justify-center gap-2 text-sm font-black text-slate-500">
              <span
                className={[
                  "size-2 rounded-full",
                  saveState === "saving" ? "bg-[#f9c74f]" : "bg-[#22c55e]",
                ].join(" ")}
              />
              {saveState === "saving" ? "Menyimpan..." : saveState === "saved" ? "Tersimpan" : ""}
            </span>

            {currentIndex < total - 1 ? (
              <button
                className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#2563eb] px-5 py-3 font-heading font-black text-white shadow-[0_6px_0_#1d4ed8] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
                onClick={() => setCurrentIndex((i) => Math.min(i + 1, total - 1))}
                type="button"
              >
                Berikutnya
              </button>
            ) : (
              <button
                className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#2563eb] px-5 py-3 font-heading font-black text-white shadow-[0_6px_0_#1d4ed8] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none disabled:opacity-70"
                disabled={submitting}
                onClick={() => setConfirmSubmit(true)}
                type="button"
              >
                {submitting ? <Loader2 className="animate-spin" size={18} /> : null}
                Selesai
              </button>
            )}
          </div>
        </div>

        <aside className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-heading text-xl font-black">Navigator</h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#dcfce7] px-3 py-1 text-xs font-black text-[#166534]">
              <Check size={14} />
              {answeredCount} dijawab
            </span>
          </div>
          <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 lg:grid-cols-5">
            {attempt.questions.map((question, index) => {
              const isCurrent = index === currentIndex;
              const isAnswered = Boolean(answers[question.id]?.selectedOptionId);

              return (
                <button
                  className={[
                    "aspect-square rounded-[8px] font-heading font-black transition active:scale-95",
                    isCurrent && "bg-[#2563eb] text-white shadow-[0_5px_0_#1d4ed8]",
                    !isCurrent &&
                      isAnswered &&
                      "bg-[#dcfce7] text-[#166534] shadow-[0_4px_0_#bbf7d0]",
                    !isCurrent &&
                      !isAnswered &&
                      "bg-slate-100 text-slate-400 shadow-[0_4px_0_#e2e8f0]",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  key={question.id}
                  onClick={() => setCurrentIndex(index)}
                  type="button"
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
          <div className="mt-5 rounded-[8px] bg-[#fff7ed] p-4 text-sm font-bold leading-6 text-[#9a3412]">
            <Flag className="mb-2" size={20} />
            Soal yang ditandai bisa kamu buka lagi lewat navigator sebelum menekan Selesai.
          </div>
        </aside>
      </section>

      {confirmSubmit ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4">
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-[8px] bg-white p-5 shadow-2xl"
            initial={{ opacity: 0, scale: 0.96 }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="grid size-11 place-items-center rounded-[8px] bg-[#fffbeb] text-[#92400e]">
                  <AlertTriangle size={22} />
                </span>
                <h2 className="font-heading mt-4 text-2xl font-black">
                  Selesaikan asesmen?
                </h2>
              </div>
              <button
                className="grid size-9 place-items-center rounded-[8px] bg-slate-100 text-slate-600"
                onClick={() => setConfirmSubmit(false)}
                type="button"
              >
                <X size={19} />
              </button>
            </div>
            <p className="mt-3 font-semibold leading-7 text-slate-600">
              Kamu sudah menjawab {answeredCount} dari {total} soal.
              {unansweredCount > 0
                ? ` Masih ada ${unansweredCount} soal yang belum dijawab.`
                : " Semua soal sudah terjawab."}
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button
                className="rounded-[8px] border-2 border-slate-200 bg-white px-4 py-3 font-heading font-black text-slate-600 shadow-[0_5px_0_#e2e8f0] active:translate-y-1 active:shadow-none"
                onClick={() => setConfirmSubmit(false)}
                type="button"
              >
                Periksa lagi
              </button>
              <button
                className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#2563eb] px-4 py-3 font-heading font-black text-white shadow-[0_5px_0_#1d4ed8] disabled:opacity-70"
                disabled={submitting}
                onClick={handleSubmit}
                type="button"
              >
                {submitting ? <Loader2 className="animate-spin" size={18} /> : null}
                Ya, kumpulkan
              </button>
            </div>
          </motion.div>
        </div>
      ) : null}
    </StudentShell>
  );
}
