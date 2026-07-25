"use client";

import Link from "next/link";
import { BookOpen, Compass, GraduationCap, Palette, Search, Sparkles, Trophy } from "lucide-react";

const stepLabels = ["Profil", "Kelas", "Tujuan", "Dunia", "Avatar", "Cek", "Misi"];

export function OnboardingShell({
  children,
  stepIndex,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  stepIndex: number;
  title: string;
  subtitle: string;
}) {
  const progress = Math.max(8, Math.min(100, ((stepIndex + 1) / stepLabels.length) * 100));

  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-5 sm:px-6">
      <section className="mx-auto max-w-3xl">
        <header className="mb-5 flex items-center justify-between gap-3">
          <Link className="flex min-w-0 items-center gap-3" href="/welcome">
            <span className="grid size-11 place-items-center rounded-[8px] bg-[#22c55e] text-white shadow-[0_5px_0_#129447]">
              <BookOpen size={23} strokeWidth={3} />
            </span>
            <span className="truncate font-heading text-lg font-black">BaleBelajar</span>
          </Link>
          <span className="rounded-full bg-white px-3 py-2 text-xs font-black text-slate-500 shadow-sm">
            {stepIndex + 1}/{stepLabels.length}
          </span>
        </header>

        <div className="mb-5 h-3 overflow-hidden rounded-full bg-white shadow-inner">
          <div
            className="h-full rounded-full bg-[#22c55e] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mb-5 grid gap-4 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <GameScene stepIndex={stepIndex} />
          <div>
          <p className="text-sm font-black uppercase text-[#2563eb]">
            {stepLabels[stepIndex]}
          </p>
          <h1 className="font-heading mt-1 text-3xl font-black leading-tight text-[#172033] sm:text-5xl">
            {title}
          </h1>
          <p className="mt-2 max-w-xl font-bold leading-7 text-slate-500">{subtitle}</p>
          </div>
        </div>

        {children}
      </section>
    </main>
  );
}

function GameScene({ stepIndex }: { stepIndex: number }) {
  const scenes = [
    { label: "Nama", icon: Sparkles, color: "from-[#22c55e] to-[#06b6d4]" },
    { label: "Level", icon: GraduationCap, color: "from-[#2563eb] to-[#06b6d4]" },
    { label: "Target", icon: Trophy, color: "from-[#f59e0b] to-[#ef4444]" },
    { label: "Dunia", icon: Compass, color: "from-[#172033] to-[#6d28d9]" },
    { label: "Hero", icon: Palette, color: "from-[#22c55e] to-[#a855f7]" },
    { label: "Cek", icon: Search, color: "from-[#0f172a] to-[#2563eb]" },
    { label: "Reward", icon: Trophy, color: "from-[#16a34a] to-[#f59e0b]" },
  ];
  const scene = scenes[stepIndex] ?? scenes[0];
  const Icon = scene.icon;

  return (
    <div className={`game-grid-surface relative min-h-56 overflow-hidden rounded-[8px] bg-gradient-to-br ${scene.color} p-5 text-white shadow-[0_10px_0_rgba(15,23,42,0.28)]`}>
      <div className="absolute left-5 top-5 rounded-full bg-white/18 px-3 py-1 text-xs font-black uppercase">
        Stage {stepIndex + 1}
      </div>
      <div className="game-orbit absolute left-1/2 top-1/2 size-5 rounded-[8px] bg-white/35" />
      <div className="game-orbit absolute left-1/2 top-1/2 size-4 rounded-full bg-[#f9c74f]" style={{ animationDelay: "-3s" }} />
      <div className="game-float absolute bottom-5 left-1/2 grid size-32 -translate-x-1/2 place-items-center rounded-[8px] bg-white/20 shadow-2xl backdrop-blur">
        <div className="grid size-20 place-items-center rounded-[8px] bg-white text-[#172033] shadow-[0_8px_0_rgba(255,255,255,0.35)]">
          <Icon size={42} strokeWidth={3} />
        </div>
      </div>
      <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
        <span className="font-heading text-2xl font-black">{scene.label}</span>
        <span className="grid size-11 place-items-center rounded-[8px] bg-white/18 font-heading font-black">
          {stepIndex + 1}
        </span>
      </div>
    </div>
  );
}
