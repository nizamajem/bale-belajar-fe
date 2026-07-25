"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight, BookOpen, CheckCircle2, MapPinned, Search, Sparkles } from "lucide-react";
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
              ? "Dunia ini belum punya kasus yang bisa dibuka."
              : "Dunia ini belum punya latihan yang bisa dibuka.",
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
          <LoadingEvidence label={isCaseWorld ? "Menyiapkan papan bukti..." : "Menyiapkan latihan hari ini..."} />
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
              Kembali ke Beranda
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
                  : "Latihan hari ini pendek. Fokus ke satu kemampuan dulu, lalu lihat hasilmu."}
              </MentorDialogue>
            </div>
          </div>
          <div className="relative z-10 mt-6 max-w-xs rounded-[8px] bg-white/10 p-4">
            <XpBar
              level={world.worldLevel}
              levelLabel="Tingkat Dunia"
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
            <DetectiveSimplePlan currentCase={currentCase} />
          ) : mission ? (
            <>
              <p className="text-sm font-black uppercase text-[#6d28d9]">Latihan hari ini</p>
              <h2 className="font-heading text-2xl font-black">{mission.mission.title}</h2>
              <p className="mt-3 font-bold leading-6 text-slate-600">{mission.mission.narrative}</p>
              <p className="mt-3 text-sm font-bold text-slate-400">
                Kemampuan yang dilatih: {mission.mission.competency.name} - sekitar {mission.mission.estimatedMinutes} menit
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
                  Lihat hasil kasus
                  <ArrowRight size={18} />
                </Link>
              ) : (
                <Link
                  className="light-trail inline-flex items-center gap-2 rounded-[8px] bg-[#6d28d9] px-5 py-4 font-heading font-black text-white shadow-[0_6px_0_#4c1d95] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
                  href={`/student/world/${worldKey}/kasus`}
                >
                  {caseInProgress ? "Lanjutkan kasus" : "Mulai kasus hari ini"}
                  <ArrowRight size={18} />
                </Link>
              )
            ) : missionDone ? (
              <Link
                className="light-trail inline-flex items-center gap-2 rounded-[8px] bg-[#22c55e] px-5 py-4 font-heading font-black text-white shadow-[0_6px_0_#129447] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
                href={`/student/world/${worldKey}/misi/hasil`}
              >
                Lihat hasil latihan
                <ArrowRight size={18} />
              </Link>
            ) : (
              <Link
                className="light-trail inline-flex items-center gap-2 rounded-[8px] bg-[#6d28d9] px-5 py-4 font-heading font-black text-white shadow-[0_6px_0_#4c1d95] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
                href={`/student/world/${worldKey}/misi`}
              >
                {missionInProgress ? "Lanjutkan latihan" : "Mulai latihan hari ini"}
                <ArrowRight size={18} />
              </Link>
            )}
            <Link
              className="inline-flex items-center gap-2 rounded-[8px] border-2 border-slate-200 bg-white px-5 py-4 font-heading font-black text-slate-700 shadow-[0_6px_0_#d8e2ef] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
              href={`/student/growth-map?worldKey=${worldKey}`}
            >
              <MapPinned size={18} />
              Kemampuanku
            </Link>
          </div>
        </motion.div>

        {isCaseWorld && currentCase ? <DetectiveLearningMap currentCase={currentCase} /> : null}
      </section>
    </StudentShell>
  );
}

function DetectiveSimplePlan({ currentCase }: { currentCase: CurrentCase }) {
  return (
    <div>
      <p className="text-sm font-black uppercase text-[#6d28d9]">Hari ini</p>
      <h2 className="font-heading text-2xl font-black">Belajar jadi detektif dari dasar</h2>
      <p className="mt-2 font-bold leading-6 text-slate-600">
        {currentCase.lessonPlan?.simpleGoal ?? currentCase.case.openingStory}
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-4">
        {[
          ["1", "Materi", "Pahami konsep dulu.", BookOpen],
          ["2", "Cerita Kasus", "Bedah kasus contoh.", Search],
          ["3", "Contoh", "Lihat cara jawab.", Sparkles],
          ["4", "Tes", `${currentCase.questions.length} soal penalaran.`, CheckCircle2],
        ].map(([number, title, description, Icon]) => (
          <div className="rounded-[8px] bg-[#f8fafc] p-4" key={String(title)}>
            <span className="grid size-10 place-items-center rounded-[8px] bg-[#172033] font-heading font-black text-white">
              {String(number)}
            </span>
            <Icon className="mt-4 text-[#6d28d9]" size={20} />
            <p className="font-heading mt-2 text-lg font-black">{String(title)}</p>
            <p className="mt-1 text-sm font-bold leading-5 text-slate-500">{String(description)}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-[8px] border border-[#ddd6fe] bg-[#f5f3ff] p-4">
        <p className="font-heading font-black text-[#4c1d95]">Kalau jawaban salah bagaimana?</p>
        <p className="mt-1 text-sm font-bold leading-6 text-[#5b21b6]">
          Tidak langsung dihukum. Bagian yang belum paham akan ditandai, lalu muncul lagi di tes berikutnya
          dengan kasus baru. Jadi kamu belajar ulang bagian yang perlu, bukan mengulang semuanya.
        </p>
      </div>
    </div>
  );
}

function DetectiveLearningMap({ currentCase }: { currentCase: CurrentCase }) {
  const nodes = [
    {
      title: "Baca Materi",
      detail: "Pahami fakta, dugaan, dan bukti pengecoh.",
      state: "done",
    },
    {
      title: "Cerita Kasus",
      detail: `${currentCase.lessonPlan?.caseStudies?.length ?? 0} contoh untuk dibedah.`,
      state: "current",
    },
    {
      title: "Latihan Bukti",
      detail: "Pilih bukti kuat sebelum menulis jawaban.",
      state: "open",
    },
    {
      title: "Tes Detektif",
      detail: `${currentCase.questions.length} soal untuk cek pemahaman.`,
      state: "locked",
    },
  ];

  return (
    <section className="mt-6 overflow-hidden rounded-[8px] bg-[#172033] p-5 text-white shadow-[0_10px_0_#020617] sm:p-6">
      <div className="grid gap-5 lg:grid-cols-[260px_1fr] lg:items-center">
        <div className="relative min-h-64 rounded-[8px] bg-white/8 p-5">
          <div className="detective-avatar mx-auto mt-4">
            <div className="detective-hat" />
            <div className="detective-face">
              <span className="detective-eye left-7" />
              <span className="detective-eye right-7" />
              <span className="detective-smile" />
            </div>
            <div className="detective-coat">
              <span className="detective-lens" />
            </div>
          </div>
          <p className="mt-5 text-center font-heading text-xl font-black">Mode Detektif</p>
          <p className="mt-1 text-center text-sm font-bold text-white/60">
            Ikuti jalur dari atas ke bawah. Jangan lompat ke tes sebelum paham bukti.
          </p>
        </div>

        <div>
          <p className="text-sm font-black uppercase text-[#f9c74f]">Map belajar</p>
          <h2 className="font-heading mt-1 text-3xl font-black">Jalur hari ini</h2>
          <div className="mt-5 grid gap-3">
            {nodes.map((node, index) => (
              <div
                className={[
                  "relative rounded-[8px] border p-4",
                  node.state === "done" && "border-[#86efac] bg-[#f0fdf4] text-[#14532d]",
                  node.state === "current" && "mission-node-active border-[#f9c74f] bg-[#fffbeb] text-[#92400e]",
                  node.state === "open" && "border-white/15 bg-white/10 text-white",
                  node.state === "locked" && "border-white/10 bg-white/5 text-white/45",
                ]
                  .filter(Boolean)
                  .join(" ")}
                key={node.title}
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-[8px] bg-white font-heading font-black text-[#172033]">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-heading text-lg font-black">{node.title}</h3>
                    <p className="text-sm font-bold leading-6 opacity-75">{node.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Link
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#22c55e] px-5 py-4 font-heading font-black text-white shadow-[0_6px_0_#129447] sm:w-auto"
            href="/student/world/detectivia/kasus"
          >
            Masuk ke map
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
