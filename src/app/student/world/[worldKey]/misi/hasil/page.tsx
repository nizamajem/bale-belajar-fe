"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckCircle2, Loader2, Trophy, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { MissionResult, TodayMission } from "@/lib/types";
import { StudentShell } from "../../../../_components/student-shell";
import { MasteryBadge } from "../../../../_components/mastery-badge";

export default function MissionResultPage() {
  const params = useParams<{ worldKey: string }>();
  const worldKey = params.worldKey;

  const [result, setResult] = useState<MissionResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const { data: today } = await apiFetch<TodayMission>("/student/missions/today", {
          query: { worldKey },
        });

        if (!today.attempt || today.attempt.status === "IN_PROGRESS") {
          if (!cancelled) setError("Misi hari ini belum diselesaikan.");
          return;
        }

        const { data } = await apiFetch<MissionResult>(
          `/student/mission-attempts/${today.attempt.id}/result`,
        );
        if (!cancelled) setResult(data);
      } catch {
        if (!cancelled) setError("Hasil misi belum tersedia.");
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
            {result.missionTitle}
          </span>
          <h1 className="font-heading mt-4 text-3xl font-black">
            {result.correctCount}/{result.totalActivities} benar
          </h1>
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
                <p className="font-heading font-black">
                  {index + 1}. {activity.prompt}
                </p>
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
