"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle2, Loader2, Sparkles, Trophy, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { MissionSubmitResult, TodayMission } from "@/lib/types";
import { StudentShell } from "../../../_components/student-shell";
import { MasteryBadge } from "../../../_components/mastery-badge";
import { LoadingEvidence, MentorDialogue } from "../../../_components/motion-kit";

export default function MissionRunnerPage() {
  const params = useParams<{ worldKey: string }>();
  const router = useRouter();
  const worldKey = params.worldKey;

  const [mission, setMission] = useState<TodayMission | null>(null);
  const [answers, setAnswers] = useState<Record<string, string | null>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<MissionSubmitResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const { data: today } = await apiFetch<TodayMission>("/student/missions/today", {
          query: { worldKey },
        });

        if (today.attempt?.status === "SUBMITTED" || today.attempt?.status === "AUTO_SUBMITTED") {
          router.replace(`/student/world/${worldKey}/misi/hasil`);
          return;
        }

        let current = today;
        if (!current.attempt) {
          await apiFetch(`/student/missions/${current.assignmentId}/start`, { method: "POST" });
          const refreshed = await apiFetch<TodayMission>("/student/missions/today", {
            query: { worldKey },
          });
          current = refreshed.data;
        }

        if (cancelled) return;
        setMission(current);
        setAnswers(
          Object.fromEntries(
            current.activities.map((activity) => [activity.id, activity.selectedOptionId ?? null]),
          ),
        );
      } catch {
        if (!cancelled) setError("Misi tidak dapat dimuat. Silakan coba lagi.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [worldKey, router]);

  function selectOption(activityId: string, optionId: string) {
    if (!mission || submitting) return;
    setAnswers((prev) => ({ ...prev, [activityId]: optionId }));

    const attemptId = mission.attempt?.id;
    if (!attemptId) return;

    apiFetch(`/student/mission-attempts/${attemptId}/answers/${activityId}`, {
      method: "PUT",
      body: { selectedOptionId: optionId },
    }).catch(() => {
      // Autosave gagal secara diam-diam; siswa masih bisa melanjutkan dan submit ulang.
    });
  }

  async function handleSubmit() {
    if (!mission?.attempt) return;
    setSubmitting(true);
    setError(null);
    try {
      const { data } = await apiFetch<MissionSubmitResult>(
        `/student/mission-attempts/${mission.attempt.id}/submit`,
        { method: "POST" },
      );
      setResult(data);
    } catch {
      setError("Misi gagal disubmit. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <StudentShell>
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
          <LoadingEvidence label="Misi sedang disusun untukmu..." />
        </div>
      </StudentShell>
    );
  }

  if (error && !mission) {
    return (
      <StudentShell>
        <section className="mx-auto max-w-3xl px-4 py-10 text-center sm:px-6">
          <div className="rounded-[8px] border border-slate-200 bg-white p-8 shadow-sm">
            <Sparkles className="mx-auto text-[#f9c74f]" size={34} />
            <p className="mt-4 font-heading text-2xl font-black">Misi belum bisa dibuka.</p>
            <p className="mt-2 font-bold leading-7 text-slate-500">
              {error} Progresmu tetap aman.
            </p>
            <Link
              className="mt-5 inline-flex rounded-[8px] bg-[#2563eb] px-5 py-4 font-heading font-black text-white shadow-[0_6px_0_#1e40af]"
              href={`/student/world/${worldKey}`}
            >
              Kembali ke Dunia
            </Link>
          </div>
        </section>
      </StudentShell>
    );
  }

  if (!mission) return null;

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
              Misi selesai!
            </span>
            <h1 className="font-heading mt-4 text-3xl font-black">
              {result.correctCount}/{result.totalActivities} benar
            </h1>
            <p className="mt-2 font-bold text-white/90">+{result.xpGained} XP diperoleh</p>
            {result.gameProfile.accountLeveledUp ? (
              <p className="mt-1 font-black text-white">
                Naik level ke {result.gameProfile.accountLevel}!
              </p>
            ) : null}
          </motion.div>

          {result.mastery ? (
            <div className="mt-5 rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-black uppercase text-[#2563eb]">Mastery Kompetensi</p>
              <div className="mt-2">
                <MasteryBadge confidence={result.mastery.confidence} status={result.mastery.status} />
              </div>
            </div>
          ) : null}

          <div className="mt-5 space-y-3">
            {result.activities.map((activity, index) => (
              <div className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm" key={activity.activityId}>
                <div className="flex items-center gap-2">
                  {activity.isCorrect ? (
                    <CheckCircle2 className="text-[#16a34a]" size={20} />
                  ) : (
                    <XCircle className="text-[#e11d48]" size={20} />
                  )}
                  <p className="font-heading font-black">Aktivitas {index + 1}</p>
                </div>
                {activity.explanation ? (
                  <p className="mt-2 text-sm font-bold leading-6 text-slate-600">{activity.explanation}</p>
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
            {mission.mission.title}
          </span>
          <p className="mt-3 font-bold leading-6 text-white/90">{mission.mission.narrative}</p>
          <div className="mt-4">
            <MentorDialogue>
              Pilih jawaban terbaik. Kalau ragu, cari petunjuk di kalimat soal sebelum lanjut.
            </MentorDialogue>
          </div>
        </motion.div>

        {error ? (
          <p className="mt-4 rounded-[8px] border border-[#fed7aa] bg-[#fff7ed] p-3 text-sm font-bold text-[#c2410c]">
            {error} Coba kirim ulang saat koneksi stabil.
          </p>
        ) : null}

        <div className="mt-5 space-y-4">
          {mission.activities.map((activity, index) => (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="interactive-card rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm"
              initial={{ opacity: 0, y: 16 }}
              key={activity.id}
              transition={{ delay: index * 0.05 }}
            >
              <p className="font-heading text-lg font-black">
                {index + 1}. {activity.prompt}
              </p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {activity.options.map((option) => {
                  const selected = answers[activity.id] === option.id;
                  return (
                    <button
                      className={[
                        "min-h-12 rounded-[8px] border-2 px-4 py-3 text-left font-bold transition focus:outline-none focus:ring-4 focus:ring-[#ddd6fe]",
                        selected
                          ? "border-[#6d28d9] bg-[#f5f3ff] text-[#4c1d95]"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300",
                      ].join(" ")}
                      key={option.id}
                      onClick={() => selectOption(activity.id, option.id)}
                      type="button"
                    >
                      <span className="mr-2 font-black">{option.optionKey}.</span>
                      {option.optionText}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        <button
          className="light-trail mt-6 inline-flex items-center gap-2 rounded-[8px] bg-[#22c55e] px-6 py-4 font-heading font-black text-white shadow-[0_6px_0_#129447] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none disabled:opacity-60"
          disabled={submitting}
          onClick={handleSubmit}
          type="button"
        >
          {submitting ? <Loader2 className="animate-spin" size={18} /> : null}
          Selesaikan Misi
        </button>
      </section>
    </StudentShell>
  );
}
