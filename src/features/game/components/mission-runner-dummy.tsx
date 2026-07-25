"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Gift, Loader2, Sparkles, Trophy, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { DummyFirstMission } from "../data/game-dummy-data";
import { getFirstMission, submitFirstMission } from "../services/game-dummy-service";

export function MissionRunnerDummy() {
  const [mission, setMission] = useState<DummyFirstMission | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [result, setResult] = useState<{
    correct: boolean;
    feedback: string;
    xp: number;
    mastery: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getFirstMission()
      .then(setMission)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid min-h-[55vh] place-items-center">
        <Loader2 className="animate-spin text-slate-400" size={32} />
      </div>
    );
  }

  if (!mission) return null;

  const activity = mission.activities[0];

  if (result) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:py-8">
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className="game-grid-surface relative overflow-hidden rounded-[8px] bg-[#22c55e] p-6 text-white shadow-[0_10px_0_#129447]"
          initial={{ opacity: 0, scale: 0.94 }}
        >
          <div className="game-orbit absolute left-1/2 top-1/2 size-5 rounded-full bg-[#f9c74f]" />
          <div className="game-orbit absolute left-1/2 top-1/2 size-4 rounded-[8px] bg-white/45" style={{ animationDelay: "-4s" }} />
          <span className="inline-flex items-center gap-2 rounded-full bg-white/18 px-3 py-2 text-sm font-black">
            <Trophy size={17} />
            Level Clear
          </span>
          <div className="game-float mx-auto mt-4 grid size-32 place-items-center rounded-[8px] bg-white/20">
            <Gift size={58} />
          </div>
          <h1 className="font-heading mt-4 text-center text-4xl font-black">
            {result.correct ? "Fondasimu mulai terbuka." : "Bagus, kamu sudah mulai mencoba."}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-center font-bold leading-7 text-white/88">{result.feedback}</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="game-pop rounded-[8px] bg-white/14 p-4 text-center">
              <Zap className="mx-auto mb-2 text-[#f9c74f]" size={28} />
              <p className="text-sm font-black uppercase text-white/60">XP</p>
              <p className="font-heading text-3xl font-black">+{result.xp}</p>
            </div>
            <div className="game-pop rounded-[8px] bg-white/14 p-4 text-center" style={{ animationDelay: "0.12s" }}>
              <Sparkles className="mx-auto mb-2 text-[#f9c74f]" size={28} />
              <p className="text-sm font-black uppercase text-white/60">Mastery</p>
              <p className="font-heading text-3xl font-black">+{result.mastery}%</p>
            </div>
          </div>
        </motion.div>

        <div className="mt-5 rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
          <CheckCircle2 className="text-[#22c55e]" size={26} />
          <h2 className="font-heading mt-3 text-2xl font-black">Next: Lingkar Belajar</h2>
          <p className="mt-2 font-bold leading-7 text-slate-500">
            Undang orang tua atau mentor setelah kamu merasakan misi pertama.
          </p>
          <Link
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#2563eb] px-5 py-4 font-heading font-black text-white shadow-[0_7px_0_#1e40af] sm:w-auto"
            href="/student/dashboard"
          >
            Kembali ke Dashboard
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:py-8">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="game-grid-surface relative overflow-hidden rounded-[8px] bg-[#172033] p-5 text-white shadow-[0_10px_0_#020617] sm:p-7"
        initial={{ opacity: 0, y: 16 }}
      >
        <div className="game-float absolute right-5 top-7 hidden size-36 place-items-center rounded-[8px] bg-white/16 md:grid">
          <Sparkles size={58} />
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-white/18 px-3 py-2 text-sm font-black">
          <Sparkles size={17} />
          Level 1
        </span>
        <h1 className="font-heading mt-4 max-w-xl text-4xl font-black leading-tight sm:text-6xl">{mission.title}</h1>
        <p className="mt-3 max-w-lg font-bold leading-7 text-white/86">{mission.story}</p>
      </motion.div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[0.75fr_1.25fr]">
        <div className="game-pop rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="game-float grid size-24 place-items-center rounded-[8px] bg-[#eff6ff] text-[#2563eb]">
            <Zap size={42} />
          </div>
          <p className="mt-4 text-sm font-black uppercase text-[#2563eb]">Power Hint</p>
          <p className="mt-2 font-heading text-2xl font-black">Konsep</p>
          <p className="mt-2 font-bold leading-7 text-slate-600">{mission.concept}</p>
        </div>

        <div className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-black uppercase text-[#6d28d9]">Challenge</p>
          <p className="font-heading mt-1 text-2xl font-black">{activity.prompt}</p>
          <div className="mt-4 grid gap-3">
            {activity.options.map((option, index) => {
              const selected = selectedAnswer === option.id;
              return (
                <button
                  className={[
                    "game-pop flex min-h-16 items-center gap-3 rounded-[8px] border-2 px-4 py-3 text-left font-bold shadow-[0_5px_0_#d8e2ef] transition focus:outline-none focus:ring-4 focus:ring-[#bbf7d0]",
                    selected
                      ? "border-[#22c55e] bg-[#f0fdf4] text-[#166534] shadow-[0_5px_0_#86efac]"
                      : "border-slate-200 bg-white text-slate-600",
                  ].join(" ")}
                  key={option.id}
                  onClick={() => setSelectedAnswer(option.id)}
                  style={{ animationDelay: `${index * 0.08}s` }}
                  type="button"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-[8px] bg-[#eff6ff] font-heading font-black text-[#2563eb]">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <button
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#22c55e] px-5 py-4 font-heading font-black text-white shadow-[0_7px_0_#129447] transition active:translate-y-1 active:shadow-none disabled:opacity-60 sm:w-auto"
        disabled={!selectedAnswer || submitting}
        onClick={async () => {
          if (!selectedAnswer) return;
          setSubmitting(true);
          try {
            const submitted = await submitFirstMission(selectedAnswer);
            setResult(submitted);
          } finally {
            setSubmitting(false);
          }
        }}
        type="button"
      >
        {submitting ? <Loader2 className="animate-spin" size={18} /> : null}
        Selesaikan Misi
      </button>
    </section>
  );
}
