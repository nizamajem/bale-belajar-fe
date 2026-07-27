"use client";

import Link from "next/link";
import { ArrowRight, Loader2, Search, Star, Trophy, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { getStoredUser } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
import {
  AdaptivePlan,
  CurrentCase,
  DETECTIVE_WORLD_KEY,
  GameProfileSummary,
  WorldCurriculum,
} from "@/lib/types";
import { StudentShell } from "../_components/student-shell";

export default function StudentDashboardPage() {
  const user = getStoredUser();
  const [profile, setProfile] = useState<GameProfileSummary | null>(null);
  const [currentCase, setCurrentCase] = useState<CurrentCase | null>(null);
  const [curriculum, setCurriculum] = useState<WorldCurriculum | null>(null);
  const [adaptivePlan, setAdaptivePlan] = useState<AdaptivePlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [
          { data: gameProfile },
          { data: caseData },
          { data: curriculumData },
          { data: adaptiveData },
        ] = await Promise.all([
          apiFetch<GameProfileSummary>("/student/game-profile"),
          apiFetch<CurrentCase>("/student/cases/current", { query: { worldKey: DETECTIVE_WORLD_KEY } }),
          apiFetch<WorldCurriculum>(`/student/worlds/${DETECTIVE_WORLD_KEY}/curriculum`),
          apiFetch<AdaptivePlan>(`/student/worlds/${DETECTIVE_WORLD_KEY}/adaptive-plan`),
        ]);

        if (cancelled) return;
        setProfile(gameProfile);
        setCurrentCase(caseData);
        setCurriculum(curriculumData);
        setAdaptivePlan(adaptiveData);
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
            <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
              <article className="relative overflow-hidden rounded-[8px] bg-[#172033] p-5 text-white shadow-[0_9px_0_#020617] sm:p-6">
                <div className="absolute right-5 top-5 hidden sm:block">
                  <div className="detective-avatar scale-[0.58] origin-top-right" />
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/14 px-3 py-2 text-sm font-black">
                  <Search size={17} />
                  Mulai 10 menit
                </span>
                <h1 className="font-heading mt-4 max-w-xl text-4xl font-black leading-tight">
                  Hai {user?.name ?? "Siswa"}, yuk lanjut belajar.
                </h1>
                <p className="mt-3 max-w-xl font-bold leading-7 text-white/80">
                  Satu misi cuma 10-20 menit. Baca cerita, pilih bukti, lalu buat kesimpulan aman tanpa asal menuduh.
                </p>

                <Link
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#22c55e] px-5 py-4 font-heading font-black text-white shadow-[0_6px_0_#129447] sm:w-auto"
                  href="/student/world/detectivia/kasus"
                >
                  Mulai Belajar
                  <ArrowRight size={18} />
                </Link>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[
                    ["1", "Amati", "Cari perubahan"],
                    ["2", "Pilih bukti", "Mana yang kuat?"],
                    ["3", "Simpulkan", "Tulis alasan"],
                  ].map(([number, title, text]) => (
                    <div className="rounded-[8px] bg-white/10 p-3" key={title}>
                      <span className="grid size-8 place-items-center rounded-[8px] bg-white font-heading font-black text-[#172033]">
                        {number}
                      </span>
                      <p className="mt-2 font-heading font-black">{title}</p>
                      <p className="text-sm font-bold text-white/65">{text}</p>
                    </div>
                  ))}
                </div>
              </article>

              <aside className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-black uppercase text-[#6d28d9]">Kelas aktif</p>
                <h2 className="font-heading mt-1 text-3xl font-black">
                  Detektif Pemula
                </h2>
                <p className="mt-2 font-bold leading-6 text-slate-600">
                  {adaptivePlan?.message ??
                    "Mulai dari Detective Oath, observasi, fakta vs asumsi, lalu Boss Case pemula."}
                </p>
                {adaptivePlan?.targetModule ? (
                  <div className="mt-4 rounded-[8px] bg-[#f8fafc] p-4">
                    <p className="text-xs font-black uppercase text-slate-400">Lanjutkan</p>
                    <p className="font-heading mt-1 text-xl font-black">{adaptivePlan.targetModule.title}</p>
                    {adaptivePlan.mastery ? (
                      <p className="mt-1 text-sm font-bold text-slate-500">
                        Tingkat paham {Math.round(adaptivePlan.mastery.masteryScore)}%
                      </p>
                    ) : null}
                  </div>
                ) : null}
                <div className="mt-4 rounded-[8px] bg-[#f8fafc] p-4">
                  <p className="text-xs font-black uppercase text-slate-400">Tugas hari ini</p>
                  <p className="mt-1 font-heading text-lg font-black">
                    {currentCase?.case.title ?? "Kasus hari ini"}
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-500">
                    {currentCase?.questions.length ?? 0} soal, sekitar {currentCase?.case.estimatedMinutes ?? 0} menit
                  </p>
                </div>
                <div className="mt-4 rounded-[8px] border border-[#bbf7d0] bg-[#f0fdf4] p-4">
                  <p className="text-xs font-black uppercase text-[#166534]">Aturan emas</p>
                  <p className="mt-1 text-sm font-black leading-5 text-[#166534]">
                    Bukti dulu, baru kesimpulan. Kalau belum yakin, boleh jawab belum cukup bukti.
                  </p>
                </div>
              </aside>
            </div>

            <section className="mt-5 grid gap-3 sm:grid-cols-3">
              <SmallStat icon={<Star size={18} />} label="Rajin belajar" value={`${profile?.streakCurrent ?? 0} hari`} />
              <SmallStat icon={<Zap size={18} />} label="Poin tenaga" value={String(profile?.dayaBale ?? 0)} />
              <SmallStat icon={<Trophy size={18} />} label="Tingkat akun" value={String(profile?.accountLevel ?? 1)} />
            </section>

            <section className="mt-5 rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-black uppercase text-[#2563eb]">Cita-cita</p>
                  <h2 className="font-heading text-2xl font-black">Mau coba kelas impian lain?</h2>
                  <p className="mt-1 text-sm font-bold text-slate-500">
                    Untuk sekarang Detektif aktif dulu. Pilihan lain akan dibuka bertahap.
                  </p>
                </div>
                <Link
                  className="inline-flex items-center justify-center gap-2 rounded-[8px] border-2 border-slate-200 bg-white px-4 py-3 font-heading font-black text-slate-700 shadow-[0_5px_0_#d8e2ef]"
                  href="/student/careers"
                >
                  Lihat impian
                  <ArrowRight size={17} />
                </Link>
              </div>
            </section>

            {curriculum?.modules.length ? (
              <section className="mt-5 rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-black uppercase text-[#6d28d9]">Jalur belajar</p>
                <h2 className="font-heading mt-1 text-2xl font-black">
                  Jalur Detektif Pemula
                </h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-4">
                  {[
                    ["1", "Oath", "Main aman dan etis"],
                    ["2", "Observasi", "Cari detail penting"],
                    ["3", "Bukti", "Pilih yang relevan"],
                    ["4", "Boss Case", "Buat laporan singkat"],
                  ].map(([step, title, text]) => (
                    <div className="rounded-[8px] bg-[#172033] p-3 text-white" key={title}>
                      <span className="grid size-8 place-items-center rounded-[8px] bg-[#22c55e] font-heading font-black shadow-[0_4px_0_#129447]">
                        {step}
                      </span>
                      <p className="mt-3 font-heading font-black">{title}</p>
                      <p className="mt-1 text-xs font-bold leading-5 text-white/65">{text}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 grid gap-3">
                  {curriculum.modules.map((module) => (
                    <div className="rounded-[8px] bg-[#f8fafc] p-4" key={module.id}>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="grid size-8 place-items-center rounded-[8px] bg-[#172033] font-heading font-black text-white">
                          {module.orderNumber}
                        </span>
                        <p className="font-heading text-lg font-black">{module.title}</p>
                      </div>
                      <p className="mt-2 text-sm font-bold leading-6 text-slate-600">{module.simpleGoal}</p>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs font-black">
                        <span className="rounded-full bg-white px-3 py-2 text-slate-500">
                          {module.lessons.length} materi
                        </span>
                        <span className="rounded-full bg-white px-3 py-2 text-slate-500">
                          {module.caseStudies.length} cerita kasus
                        </span>
                        <span className="rounded-full bg-white px-3 py-2 text-slate-500">
                          {module.estimatedMinutes} menit
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
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
