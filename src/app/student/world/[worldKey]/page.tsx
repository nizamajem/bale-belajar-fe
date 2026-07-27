"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight, CheckCircle2, Loader2, MapPinned, Search, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { CurrentCase, DETECTIVE_WORLD_KEY, TodayMission, WorldSummary } from "@/lib/types";
import { StudentShell } from "../../_components/student-shell";

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
          setError("Misi hari ini belum bisa dibuka. Coba lagi sebentar.");
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
        <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
          <div className="grid min-h-48 place-items-center rounded-[8px] bg-white shadow-sm">
            <Loader2 className="animate-spin text-slate-400" size={30} />
          </div>
        </section>
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
              Misi belum tersedia.
            </p>
            <p className="mt-2 font-bold leading-7 text-slate-500">
              {error ?? "Data kelas belum ditemukan."}
            </p>
            <Link
              className="mt-5 inline-flex items-center gap-2 rounded-[8px] bg-[#2563eb] px-5 py-4 font-heading font-black text-white shadow-[0_6px_0_#1e40af]"
              href="/student/dashboard"
            >
              Kembali
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
  const title = isCaseWorld ? currentCase?.case.title : mission?.mission.title;
  const minutes = isCaseWorld ? currentCase?.case.estimatedMinutes : mission?.mission.estimatedMinutes;
  const questionCount = isCaseWorld ? currentCase?.questions.length : mission?.activities.length;

  return (
    <StudentShell>
      <section className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:py-8">
        <motion.article
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[8px] bg-white p-5 shadow-sm sm:p-6"
          initial={{ opacity: 0, y: 14 }}
        >
          <p className="text-sm font-black uppercase text-[#2563eb]">Tujuan kelas ini</p>
          <h1 className="font-heading mt-2 text-3xl font-black leading-tight text-[#172033] sm:text-4xl">
            Belajar berpikir teliti.
          </h1>
          <p className="mt-3 font-bold leading-7 text-slate-600">
            Kamu belajar membaca cerita, memilih bukti, lalu membuat jawaban yang punya alasan.
          </p>

          <div className="mt-5 rounded-[8px] bg-[#172033] p-5 text-white">
            <p className="text-sm font-black uppercase text-[#f9c74f]">Misi hari ini</p>
            <h2 className="font-heading mt-2 text-2xl font-black">{title ?? "Misi hari ini"}</h2>
            <p className="mt-2 text-sm font-bold text-white/65">
              {questionCount ?? 0} soal, sekitar {minutes ?? 0} menit
            </p>
            <StartButton
              caseDone={caseDone}
              caseInProgress={caseInProgress}
              isCaseWorld={isCaseWorld}
              missionDone={missionDone}
              missionInProgress={missionInProgress}
              worldKey={worldKey}
            />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              ["1", "Baca", "Pahami cerita"],
              ["2", "Pilih", "Cari bukti"],
              ["3", "Jawab", "Lihat hasil"],
            ].map(([number, stepTitle, text]) => (
              <div className="rounded-[8px] bg-[#f8fafc] p-4" key={stepTitle}>
                <span className="grid size-9 place-items-center rounded-[8px] bg-[#2563eb] font-heading font-black text-white">
                  {number}
                </span>
                <p className="font-heading mt-3 text-lg font-black">{stepTitle}</p>
                <p className="mt-1 text-sm font-bold text-slate-500">{text}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-[8px] border border-[#bbf7d0] bg-[#f0fdf4] p-4">
            <div className="flex gap-3">
              <CheckCircle2 className="mt-0.5 shrink-0 text-[#166534]" size={20} />
              <div>
                <p className="font-heading font-black text-[#166534]">Kenapa ini penting?</p>
                <p className="mt-1 text-sm font-bold leading-6 text-[#166534]">
                  Supaya kamu tidak asal menebak. Kamu belajar menjawab dengan bukti.
                </p>
              </div>
            </div>
          </div>

          <Link
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[8px] border-2 border-slate-200 bg-white px-5 py-4 font-heading font-black text-slate-700 shadow-[0_6px_0_#d8e2ef] sm:w-auto"
            href={`/student/growth-map?worldKey=${worldKey}`}
          >
            <MapPinned size={18} />
            Lihat kemampuan
          </Link>
        </motion.article>
      </section>
    </StudentShell>
  );
}

function StartButton({
  caseDone,
  caseInProgress,
  isCaseWorld,
  missionDone,
  missionInProgress,
  worldKey,
}: {
  caseDone: boolean;
  caseInProgress: boolean;
  isCaseWorld: boolean;
  missionDone: boolean;
  missionInProgress: boolean;
  worldKey: string;
}) {
  const href = isCaseWorld
    ? caseDone
      ? `/student/world/${worldKey}/kasus/hasil`
      : `/student/world/${worldKey}/kasus`
    : missionDone
      ? `/student/world/${worldKey}/misi/hasil`
      : `/student/world/${worldKey}/misi`;

  const label = isCaseWorld
    ? caseDone
      ? "Lihat hasil"
      : caseInProgress
        ? "Lanjutkan"
        : "Mulai"
    : missionDone
      ? "Lihat hasil"
      : missionInProgress
        ? "Lanjutkan"
        : "Mulai";

  return (
    <Link
      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#22c55e] px-5 py-4 font-heading font-black text-white shadow-[0_6px_0_#129447] sm:w-auto"
      href={href}
    >
      <Search size={18} />
      {label}
      <ArrowRight size={18} />
    </Link>
  );
}
