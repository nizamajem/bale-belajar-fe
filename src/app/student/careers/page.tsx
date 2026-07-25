"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Lock, Search, ShieldCheck, Sparkles } from "lucide-react";
import { careerPaths } from "@/lib/career-paths";
import { StudentShell } from "../_components/student-shell";

const detectiveLevels = [
  { title: "Level 1-3", text: "Dasar bukti", icon: Search },
  { title: "Level 4-6", text: "Motif, saksi, laporan", icon: ShieldCheck },
  { title: "Level 7-10", text: "Anomali dan digital", icon: Sparkles },
  { title: "Level 11-12", text: "Wawancara expert dan final case", icon: CheckCircle2 },
];

export default function StudentCareersPage() {
  return (
    <StudentShell>
      <section className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:py-8">
        <p className="text-sm font-black uppercase text-[#2563eb]">Mau jadi apa?</p>
        <h1 className="font-heading text-3xl font-black leading-tight text-[#172033] sm:text-5xl">
          Pilih dunia belajar yang terasa seperti game.
        </h1>
        <p className="mt-2 max-w-2xl font-bold leading-6 text-slate-500">
          Kamu belajar dari dasar, lihat cerita kasus, pilih jawaban, lalu naik level sampai siap menyelesaikan misi akhir.
        </p>

        <section className="mt-6 overflow-hidden rounded-[8px] bg-[#172033] text-white shadow-[0_10px_0_#020617]">
          <div className="grid gap-5 p-5 lg:grid-cols-[260px_1fr] lg:items-center">
            <div className="rounded-[8px] bg-white/8 p-5">
              <div className="detective-avatar mx-auto">
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
              <p className="mt-4 text-center font-heading text-2xl font-black">Detektif Muda</p>
              <p className="mt-1 text-center text-sm font-bold text-white/60">Pemula sampai Expert</p>
            </div>
            <div>
              <p className="text-sm font-black uppercase text-[#f9c74f]">Rekomendasi utama</p>
              <h2 className="font-heading mt-2 text-3xl font-black sm:text-5xl">
                Jadi detektif yang bisa membaca bukti, bukan asal menebak.
              </h2>
              <p className="mt-3 max-w-2xl font-bold leading-7 text-white/76">
                Jalur Detectivia punya 12 bab: fakta vs dugaan, timeline, sumber bukti, wawancara saksi, jejak digital, sampai final investigation.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {[
                  ["12", "Bab dari dasar"],
                  ["9+", "Kasus latihan"],
                  ["Pilihan", "Minim mengetik"],
                ].map(([value, label]) => (
                  <div className="rounded-[8px] bg-white/10 p-4" key={label}>
                    <p className="font-heading text-3xl font-black">{value}</p>
                    <p className="text-sm font-bold text-white/60">{label}</p>
                  </div>
                ))}
              </div>
              <Link
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#22c55e] px-5 py-4 font-heading font-black text-white shadow-[0_6px_0_#129447] sm:w-auto"
                href="/student/world/detectivia"
              >
                Mulai jalur Detektif
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-5 grid gap-3 md:grid-cols-4">
          {detectiveLevels.map((level) => {
            const Icon = level.icon;
            return (
            <div className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm" key={level.title}>
              <Icon className="text-[#6d28d9]" size={22} />
              <p className="font-heading mt-3 text-lg font-black">{level.title}</p>
              <p className="mt-1 text-sm font-bold leading-5 text-slate-500">{level.text}</p>
            </div>
            );
          })}
        </section>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {careerPaths.map((career) => {
            const active = career.id === "DETECTIVE";
            return (
              <article
                className="overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-sm"
                key={career.id}
              >
                <div className="min-h-40 p-5 text-white" style={{ background: career.gradient }}>
                  <span className="grid size-12 place-items-center rounded-[8px] bg-white/16">
                    {active ? <Search size={26} /> : <Sparkles size={26} />}
                  </span>
                  <h2 className="font-heading mt-4 text-2xl font-black">{career.title}</h2>
                  <p className="mt-2 text-sm font-bold leading-6 text-white/82">{career.tagline}</p>
                </div>
                <div className="p-4">
                  {active ? (
                    <Link
                      className="inline-flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#22c55e] px-4 py-3 font-heading font-black text-white shadow-[0_5px_0_#129447]"
                      href="/student/world/detectivia"
                    >
                      Mulai dari sini
                      <ArrowRight size={17} />
                    </Link>
                  ) : (
                    <button
                      className="inline-flex w-full items-center justify-center gap-2 rounded-[8px] bg-slate-100 px-4 py-3 font-heading font-black text-slate-400"
                      disabled
                      type="button"
                    >
                      <Lock size={17} />
                      Segera dibuka
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </StudentShell>
  );
}
