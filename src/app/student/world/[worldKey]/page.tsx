"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight, MapPinned, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { CurrentCase, DETECTIVE_WORLD_KEY, TodayMission, WorldSummary } from "@/lib/types";
import { StudentShell } from "../../_components/student-shell";
import { XpBar } from "../../_components/xp-bar";
import { LoadingEvidence, MentorDialogue } from "../../_components/motion-kit";

export default function WorldHomePage() {
  const params = useParams<{ worldKey: string }>();
  const worldKey = params.worldKey;
  const isCaseWorld = worldKey === DETECTIVE_WORLD_KEY;

  const [world, setWorld] = useState<WorldSummary | null>(null);
  const [mission, setMission] = useState<TodayMission | null>(null);
  const [currentCase, setCurrentCase] = useState<CurrentCase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const { data: worldsData } = await apiFetch<WorldSummary[]>("/student/worlds");
        const found = worldsData.find((item) => item.key === worldKey) ?? null;

        if (isCaseWorld) {
          const { data } = await apiFetch<CurrentCase>("/student/cases/current", {
            query: { worldKey },
          });
          if (cancelled) return;
          setWorld(found);
          setCurrentCase(data);
        } else {
          const { data } = await apiFetch<TodayMission>("/student/missions/today", {
            query: { worldKey },
          });
          if (cancelled) return;
          setWorld(found);
          setMission(data);
        }
      } catch {
        if (!cancelled) {
          setError(
            isCaseWorld
              ? "Dunia tidak ditemukan atau belum ada kasus aktif."
              : "Dunia tidak ditemukan atau belum ada misi aktif.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [worldKey, isCaseWorld]);

  if (loading) {
    return (
      <StudentShell>
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
          <LoadingEvidence label={isCaseWorld ? "Menyusun papan analisis kasus..." : "Membangun misi hari ini..."} />
        </div>
      </StudentShell>
    );
  }

  if (error || !world || (isCaseWorld ? !currentCase : !mission)) {
    return (
      <StudentShell>
        <section className="mx-auto max-w-3xl px-4 py-10 text-center sm:px-6">
          <div className="rounded-[8px] border border-slate-200 bg-white p-8 shadow-sm">
            <Sparkles className="mx-auto text-[#f9c74f]" size={34} />
            <p className="mt-4 font-heading text-2xl font-black text-[#172033]">
              Dunia belum bisa dibuka.
            </p>
            <p className="mt-2 font-bold leading-7 text-slate-500">
              {error ?? "Dunia tidak ditemukan."} Progresmu tetap aman.
            </p>
            <Link
              className="mt-5 inline-flex items-center gap-2 rounded-[8px] bg-[#2563eb] px-5 py-4 font-heading font-black text-white shadow-[0_6px_0_#1e40af]"
              href="/student/dashboard"
            >
              Kembali ke Dashboard
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </StudentShell>
    );
  }

  const missionDone = mission?.attempt?.status === "SUBMITTED" || mission?.attempt?.status === "AUTO_SUBMITTED";
  const missionInProgress = mission?.attempt?.status === "IN_PROGRESS";
  const caseDone = currentCase?.attempt?.status === "SUBMITTED";
  const caseInProgress = currentCase?.attempt?.status === "IN_PROGRESS";

  return (
    <StudentShell>
      <section className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:py-8">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[8px] bg-[#6d28d9] p-5 text-white shadow-[0_10px_0_#4c1d95] sm:p-7"
          initial={{ opacity: 0, y: 16 }}
        >
          <div className="absolute inset-0 surface-detective opacity-20" />
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/18 px-3 py-2 text-sm font-black">
              <Sparkles size={17} />
              {world.characterClass}
            </span>
            <h1 className="font-heading mt-4 text-3xl font-black leading-tight sm:text-5xl">
              {world.name}
            </h1>
            <p className="mt-3 max-w-lg font-bold leading-7 text-white/88">
              {world.themeDescription}
            </p>
            <div className="mt-5 max-w-md">
              <MentorDialogue>
                {isCaseWorld
                  ? "Baca bukti pelan-pelan. Tugasmu bukan menebak, tapi menemukan hubungan yang masuk akal."
                  : "Misi hari ini pendek. Fokus ke satu kompetensi dulu, lalu lihat XP bergerak."}
              </MentorDialogue>
            </div>
          </div>
          <div className="relative z-10 mt-6 max-w-xs rounded-[8px] bg-white/10 p-4">
            <XpBar
              level={world.worldLevel}
              levelLabel="Level Dunia"
              xpIntoLevel={world.worldXp % 100}
              xpRequired={100}
            />
          </div>
        </motion.div>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
          initial={{ opacity: 0, y: 16 }}
          transition={{ delay: 0.08 }}
        >
          {isCaseWorld && currentCase ? (
            <>
              <p className="text-sm font-black uppercase text-[#6d28d9]">Kasus Hari Ini</p>
              <h2 className="font-heading text-2xl font-black">{currentCase.case.title}</h2>
              <p className="mt-3 font-bold leading-6 text-slate-600">{currentCase.case.openingStory}</p>
              <p className="mt-3 text-sm font-bold text-slate-400">
                {currentCase.questions.length} pertanyaan penalaran - sekitar {currentCase.case.estimatedMinutes} menit
              </p>
            </>
          ) : mission ? (
            <>
              <p className="text-sm font-black uppercase text-[#6d28d9]">Misi Hari Ini</p>
              <h2 className="font-heading text-2xl font-black">{mission.mission.title}</h2>
              <p className="mt-3 font-bold leading-6 text-slate-600">{mission.mission.narrative}</p>
              <p className="mt-3 text-sm font-bold text-slate-400">
                Kompetensi fokus: {mission.mission.competency.name} - sekitar {mission.mission.estimatedMinutes} menit
              </p>
            </>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            {isCaseWorld ? (
              caseDone ? (
                <Link
                  className="light-trail inline-flex items-center gap-2 rounded-[8px] bg-[#22c55e] px-5 py-4 font-heading font-black text-white shadow-[0_6px_0_#129447] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
                  href={`/student/world/${worldKey}/kasus/hasil`}
                >
                  Lihat Hasil Kasus
                  <ArrowRight size={18} />
                </Link>
              ) : (
                <Link
                  className="light-trail inline-flex items-center gap-2 rounded-[8px] bg-[#6d28d9] px-5 py-4 font-heading font-black text-white shadow-[0_6px_0_#4c1d95] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
                  href={`/student/world/${worldKey}/kasus`}
                >
                  {caseInProgress ? "Lanjutkan Kasus" : "Mulai Kasus Hari Ini"}
                  <ArrowRight size={18} />
                </Link>
              )
            ) : missionDone ? (
              <Link
                className="light-trail inline-flex items-center gap-2 rounded-[8px] bg-[#22c55e] px-5 py-4 font-heading font-black text-white shadow-[0_6px_0_#129447] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
                href={`/student/world/${worldKey}/misi/hasil`}
              >
                Lihat Hasil Misi
                <ArrowRight size={18} />
              </Link>
            ) : (
              <Link
                className="light-trail inline-flex items-center gap-2 rounded-[8px] bg-[#6d28d9] px-5 py-4 font-heading font-black text-white shadow-[0_6px_0_#4c1d95] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
                href={`/student/world/${worldKey}/misi`}
              >
                {missionInProgress ? "Lanjutkan Misi" : "Mulai Misi Hari Ini"}
                <ArrowRight size={18} />
              </Link>
            )}
            <Link
              className="inline-flex items-center gap-2 rounded-[8px] border-2 border-slate-200 bg-white px-5 py-4 font-heading font-black text-slate-700 shadow-[0_6px_0_#d8e2ef] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
              href={`/student/growth-map?worldKey=${worldKey}`}
            >
              <MapPinned size={18} />
              Peta Tumbuh
            </Link>
          </div>
        </motion.div>
      </section>
    </StudentShell>
  );
}
