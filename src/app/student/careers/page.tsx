"use client";

import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import { careerPaths } from "@/lib/career-paths";
import { StudentShell } from "../_components/student-shell";

export default function StudentCareersPage() {
  return (
    <StudentShell>
      <section className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:py-8">
        <p className="text-sm font-black uppercase text-[#2563eb]">Mau jadi apa?</p>
        <h1 className="font-heading text-3xl font-black leading-tight text-[#172033]">
          Pilih impian yang bikin kamu penasaran.
        </h1>
        <p className="mt-2 max-w-2xl font-bold leading-6 text-slate-500">
          Nanti BaleBelajar akan kasih jalur belajar: baca dulu, lihat cerita kasus, jawab latihan, lalu tahu langkah berikutnya.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {careerPaths.map((career) => {
            const active = career.id === "DETECTIVE";
            return (
              <article
                className="overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-sm"
                key={career.id}
              >
                <div className="min-h-40 p-5 text-white" style={{ background: career.gradient }}>
                  <span className="text-4xl" role="img" aria-label={career.title}>
                    {career.emoji}
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
