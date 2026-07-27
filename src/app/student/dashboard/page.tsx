"use client";

import Link from "next/link";
import { ArrowRight, Loader2, Star, Trophy, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { getStoredUser } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
import {
  CurrentCase,
  DETECTIVE_WORLD_KEY,
  GameProfileSummary,
} from "@/lib/types";
import { StudentShell } from "../_components/student-shell";

export default function StudentDashboardPage() {
  const user = getStoredUser();
  const [profile, setProfile] = useState<GameProfileSummary | null>(null);
  const [currentCase, setCurrentCase] = useState<CurrentCase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [
          { data: gameProfile },
          { data: caseData },
        ] = await Promise.all([
          apiFetch<GameProfileSummary>("/student/game-profile"),
          apiFetch<CurrentCase>("/student/cases/current", { query: { worldKey: DETECTIVE_WORLD_KEY } }),
        ]);

        if (cancelled) return;
        setProfile(gameProfile);
        setCurrentCase(caseData);
      } catch {
        if (!cancelled) setError("Beranda belum bisa dibuka. Coba ulang sebentar lagi.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <StudentShell>
      <section className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:py-8">
        {loading ? (
          <div className="grid min-h-64 place-items-center rounded-[8px] bg-white shadow-sm">
            <Loader2 className="animate-spin text-slate-400" size={32} />
          </div>
        ) : error ? (
          <div className="rounded-[8px] border border-[#fed7aa] bg-[#fff7ed] p-5 font-bold text-[#c2410c]">
            {error}
          </div>
        ) : (
          <>
            <article className="rounded-[8px] bg-[#172033] p-5 text-white shadow-[0_9px_0_#020617] sm:p-6">
              <p className="text-sm font-black uppercase text-[#f9c74f]">Hari ini</p>
              <h1 className="font-heading mt-2 text-3xl font-black leading-tight sm:text-5xl">
                Hai {user?.name ?? "Siswa"}, lanjut misi.
              </h1>

              <div className="mt-5 rounded-[8px] bg-white/10 p-4">
                <p className="text-xs font-black uppercase text-white/55">Detektif Pemula</p>
                <p className="font-heading mt-1 text-2xl font-black">
                  {currentCase?.case.title ?? "Kasus hari ini"}
                </p>
                <p className="mt-1 text-sm font-bold text-white/65">
                  {currentCase?.questions.length ?? 0} soal, sekitar {currentCase?.case.estimatedMinutes ?? 0} menit
                </p>
              </div>

              <Link
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#22c55e] px-5 py-4 font-heading font-black text-white shadow-[0_6px_0_#129447] sm:w-auto"
                href="/student/world/detectivia/kasus"
              >
                Mulai
                <ArrowRight size={18} />
              </Link>
            </article>

            <section className="mt-5 grid gap-3 sm:grid-cols-3">
              <SmallStat icon={<Star size={18} />} label="Rajin belajar" value={`${profile?.streakCurrent ?? 0} hari`} />
              <SmallStat icon={<Zap size={18} />} label="Poin tenaga" value={String(profile?.dayaBale ?? 0)} />
              <SmallStat icon={<Trophy size={18} />} label="Tingkat akun" value={String(profile?.accountLevel ?? 1)} />
            </section>

            <section className="mt-5 rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-black uppercase text-[#2563eb]">Kelas impian</p>
                  <h2 className="font-heading text-xl font-black">Lihat akademi lain</h2>
                </div>
                <Link
                  className="inline-flex items-center justify-center gap-2 rounded-[8px] border-2 border-slate-200 bg-white px-4 py-3 font-heading font-black text-slate-700 shadow-[0_5px_0_#d8e2ef]"
                  href="/student/careers"
                >
                  Buka
                  <ArrowRight size={17} />
                </Link>
              </div>
            </section>
          </>
        )}
      </section>
    </StudentShell>
  );
}

function SmallStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-[#2563eb]">{icon}</div>
      <p className="font-heading mt-3 text-2xl font-black">{value}</p>
      <p className="text-sm font-bold text-slate-500">{label}</p>
    </div>
  );
}
