"use client";

import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Gift,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Trophy,
  UsersRound,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { trackEvent } from "@/lib/analytics";

const steps = [
  {
    number: "1",
    title: "Baca materi",
    text: "Fakta bisa dicek. Dugaan belum cukup untuk menuduh.",
    icon: BookOpen,
  },
  {
    number: "2",
    title: "Lihat kasus",
    text: "File presentasi hilang setelah beberapa siswa memakai komputer.",
    icon: Search,
  },
  {
    number: "3",
    title: "Pilih bukti",
    text: "Siswa memilih bukti yang paling kuat, bukan yang paling dramatis.",
    icon: ShieldCheck,
  },
  {
    number: "4",
    title: "Dapat hasil",
    text: "Jika salah, sistem memberi materi ulang dan kasus serupa.",
    icon: CheckCircle2,
  },
];

const evidence = [
  {
    id: "log",
    title: "Log komputer",
    text: "File terakhir dibuka pukul 15.20 di komputer ruang lab.",
    correct: true,
  },
  {
    id: "gugup",
    title: "Teman terlihat gugup",
    text: "Satu siswa terlihat diam saat ditanya guru.",
    correct: false,
  },
  {
    id: "rumor",
    title: "Rumor grup kelas",
    text: "Ada chat yang menebak siapa pelakunya tanpa bukti.",
    correct: false,
  },
];

export function DetectiveDemoClient() {
  const [selectedEvidence, setSelectedEvidence] = useState<string | null>(null);
  const selected = useMemo(
    () => evidence.find((item) => item.id === selectedEvidence) ?? null,
    [selectedEvidence],
  );
  const answered = selectedEvidence !== null;
  const correct = selected?.correct ?? false;

  useEffect(() => {
    trackEvent("demo_detective_view");
  }, []);

  function chooseEvidence(id: string) {
    setSelectedEvidence(id);
    trackEvent("demo_detective_evidence_selected", { evidence: id });
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-6 sm:px-6">
      <section className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between gap-3">
          <Link className="flex items-center gap-3" href="/welcome">
            <span className="grid size-11 place-items-center rounded-[8px] bg-[#22c55e] text-white shadow-[0_5px_0_#129447]">
              <BookOpen size={23} strokeWidth={3} />
            </span>
            <span className="font-heading text-xl font-black">BaleBelajar</span>
          </Link>
          <Link className="rounded-[8px] bg-[#22c55e] px-4 py-3 font-heading font-black text-white shadow-[0_5px_0_#129447]" href="/welcome#pilot">
            Ajukan Pilot
          </Link>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase text-[#2563eb]">Demo tanpa login</p>
            <h1 className="font-heading mt-3 text-4xl font-black leading-tight sm:text-6xl">
              Coba satu kasus detektif dalam 60 detik.
            </h1>
            <p className="mt-4 max-w-xl font-bold leading-8 text-slate-600">
              Anak tidak langsung dites. Mereka belajar singkat, membaca cerita kasus, memilih bukti, lalu mendapat saran belajar berikutnya.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {["Tanpa login", "1 kasus nyata", "Hasil langsung"].map((item) => (
                <div className="rounded-[8px] bg-white p-3 text-center text-sm font-black text-slate-600 shadow-sm" key={item}>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="game-grid-surface rounded-[8px] bg-[#172033] p-5 text-white shadow-[0_10px_0_#020617]">
            <div className="grid gap-5 md:grid-cols-[180px_1fr] md:items-center">
              <div className="rounded-[8px] bg-white/8 p-4">
                <div className="detective-avatar mx-auto scale-90" />
                <p className="mt-3 text-center font-heading font-black">Dunia Detektif</p>
                <p className="mt-1 text-center text-xs font-black uppercase text-white/55">Level pemula</p>
              </div>
              <div>
                <p className="text-sm font-black uppercase text-[#f9c74f]">Map belajar</p>
                <div className="mt-4 grid gap-3">
                  {steps.map((step) => {
                    const Icon = step.icon;

                    return (
                      <article className="interactive-card rounded-[8px] bg-white/10 p-4" key={step.title}>
                        <div className="flex gap-3">
                          <span className="grid size-10 shrink-0 place-items-center rounded-[8px] bg-white font-heading font-black text-[#172033]">
                            {step.number}
                          </span>
                          <div>
                            <h2 className="font-heading text-lg font-black">{step.title}</h2>
                            <p className="mt-1 text-sm font-bold leading-6 text-white/70">{step.text}</p>
                          </div>
                          <Icon className="ml-auto shrink-0 text-[#f9c74f]" size={21} />
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-6 grid gap-5 lg:grid-cols-[1fr_0.8fr]">
          <article className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-black uppercase text-[#6d28d9]">Kasus mini</p>
            <h2 className="font-heading mt-1 text-2xl font-black">Misteri Dokumen Presentasi</h2>
            <p className="mt-2 font-bold leading-7 text-slate-600">
              File presentasi tim hilang dari komputer lab. Tugasmu bukan menebak pelaku, tetapi memilih bukti paling kuat untuk langkah pertama penyelidikan.
            </p>

            <div className="mt-5 grid gap-3">
              {evidence.map((item) => {
                const active = selectedEvidence === item.id;
                return (
                  <button
                    className={[
                      "rounded-[8px] border-2 p-4 text-left transition active:translate-y-1",
                      active ? "border-[#2563eb] bg-[#eff6ff] shadow-[0_5px_0_#bfdbfe]" : "border-slate-200 bg-[#f8fafc] shadow-sm hover:border-[#93c5fd]",
                    ].join(" ")}
                    key={item.id}
                    onClick={() => chooseEvidence(item.id)}
                    type="button"
                  >
                    <p className="font-heading text-lg font-black">{item.title}</p>
                    <p className="mt-1 text-sm font-bold leading-6 text-slate-600">{item.text}</p>
                  </button>
                );
              })}
            </div>
          </article>

          <aside className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-black uppercase text-[#2563eb]">Hasil langsung</p>
            {!answered ? (
              <div className="mt-4 rounded-[8px] bg-[#f8fafc] p-4">
                <Sparkles className="text-[#2563eb]" size={24} />
                <p className="font-heading mt-3 text-xl font-black">Pilih satu bukti dulu.</p>
                <p className="mt-2 text-sm font-bold leading-6 text-slate-600">
                  Setelah memilih, kamu akan melihat apakah alasanmu kuat dan materi apa yang perlu diulang.
                </p>
              </div>
            ) : correct ? (
              <ResultBox
                icon={<CheckCircle2 className="text-[#16a34a]" size={28} />}
                title="Tepat. Ini bukti yang bisa dicek."
                text="Log komputer adalah fakta yang bisa diverifikasi. Kamu siap lanjut ke latihan timeline."
                tone="green"
              />
            ) : (
              <ResultBox
                icon={<XCircle className="text-[#e11d48]" size={28} />}
                title="Belum kuat. Jangan menuduh dari dugaan."
                text="Sistem akan memunculkan materi ulang tentang fakta vs dugaan, lalu memberi kasus serupa."
                tone="red"
              />
            )}

            <div className="mt-4 grid gap-3">
              <MiniFeature icon={<RotateCcw size={18} />} title="Bisa latihan ulang" text="Yang salah muncul lagi dalam bentuk kasus baru." />
              <MiniFeature icon={<Award size={18} />} title="Badge setelah selesai" text="Anak mendapat tanda progres, bukan hanya angka." />
              <MiniFeature icon={<UsersRound size={18} />} title="Laporan guru/orang tua" text="Hasil diterjemahkan menjadi saran belajar." />
            </div>
          </aside>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-4">
          <DemoLink href="/demo/report" icon={<Trophy size={22} />} title="Laporan guru" />
          <DemoLink href="/parent/preview" icon={<UsersRound size={22} />} title="Ringkasan orang tua" />
          <DemoLink href="/demo/certificate" icon={<Award size={22} />} title="Sertifikat mini" />
          <DemoLink href="/demo/referral" icon={<Gift size={22} />} title="Ajak teman" />
        </section>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#22c55e] px-5 py-4 font-heading font-black text-white shadow-[0_6px_0_#129447]"
            href="/student/login"
            onClick={() => trackEvent("demo_detective_student_login_click")}
          >
            Mulai sebagai siswa
            <ArrowRight size={18} />
          </Link>
          <Link
            className="inline-flex items-center justify-center rounded-[8px] border-2 border-slate-200 bg-white px-5 py-4 font-heading font-black text-slate-700 shadow-[0_6px_0_#d8e2ef]"
            href="/welcome#pilot"
            onClick={() => trackEvent("demo_detective_pilot_click")}
          >
            Pilot untuk sekolah
          </Link>
        </div>
      </section>
    </main>
  );
}

function ResultBox({
  icon,
  text,
  title,
  tone,
}: {
  icon: React.ReactNode;
  text: string;
  title: string;
  tone: "green" | "red";
}) {
  const className = tone === "green" ? "bg-[#f0fdf4] text-[#166534]" : "bg-[#fff1f2] text-[#be123c]";
  return (
    <div className={`mt-4 rounded-[8px] p-4 ${className}`}>
      {icon}
      <p className="font-heading mt-3 text-xl font-black">{title}</p>
      <p className="mt-2 text-sm font-bold leading-6">{text}</p>
    </div>
  );
}

function MiniFeature({ icon, text, title }: { icon: React.ReactNode; text: string; title: string }) {
  return (
    <div className="rounded-[8px] bg-[#f8fafc] p-4">
      <div className="flex items-center gap-2 text-[#2563eb]">
        {icon}
        <p className="font-heading font-black">{title}</p>
      </div>
      <p className="mt-1 text-sm font-bold leading-6 text-slate-600">{text}</p>
    </div>
  );
}

function DemoLink({ href, icon, title }: { href: string; icon: React.ReactNode; title: string }) {
  return (
    <Link className="interactive-card rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm" href={href}>
      <span className="grid size-11 place-items-center rounded-[8px] bg-[#eff6ff] text-[#2563eb]">{icon}</span>
      <p className="font-heading mt-3 text-lg font-black">{title}</p>
      <p className="mt-1 text-sm font-bold text-slate-500">Lihat contoh</p>
    </Link>
  );
}
