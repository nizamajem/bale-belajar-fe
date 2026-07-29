"use client";

import { ArrowRight, Bell, Flame, HelpCircle, ScanLine, Sparkles, Zap } from "lucide-react";
import { BaleMission, BaleUser, BaleWorld, BaleWorldKey } from "../../types";
import { BaleHero } from "./bale-hero";
import { WorldSelector } from "./world-selector";

export function BaleverseDashboard({
  user,
  worlds,
  selectedWorld,
  activeMission,
  onSelectWorld,
  onStartMission,
}: {
  user: BaleUser;
  worlds: BaleWorld[];
  selectedWorld: BaleWorldKey;
  activeMission: BaleMission;
  onSelectWorld: (world: BaleWorldKey) => void;
  onStartMission: () => void;
}) {
  const world = worlds.find((item) => item.key === selectedWorld) ?? worlds[0];

  return (
    <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:py-7">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-[8px] bg-[#22c55e] text-white shadow-[0_5px_0_#129447]">
            <Sparkles size={22} />
          </span>
          <div>
            <p className="text-xs font-black uppercase text-slate-400">BaleBelajar</p>
            <h1 className="font-heading text-2xl font-black text-[#172033]">BaleVerse</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Status icon={<Flame size={17} />} label={`${user.nyalaBelajar.completedThisWeek}/${user.nyalaBelajar.targetPerWeek} hari`} />
          <Status icon={<Zap size={17} />} label={`${user.dayaBale} Daya`} />
          <button aria-label="Buka notifikasi" className="grid size-10 place-items-center rounded-[8px] border border-slate-200 bg-white text-slate-600">
            <Bell size={18} />
          </button>
        </div>
      </header>

      <section className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[8px] bg-[#172033] p-5 text-white shadow-[0_10px_0_#020617]">
          <p className="text-xs font-black uppercase text-[#f9c74f]">Misi aktif di {world.name}</p>
          <h2 className="font-heading mt-2 text-3xl font-black leading-tight sm:text-5xl">Hai {user.name}, lanjutkan satu langkah.</h2>
          <div className="mt-5 rounded-[8px] bg-white/10 p-4">
            <p className="font-heading text-xl font-black">{activeMission.title}</p>
            <p className="mt-2 text-sm font-bold leading-6 text-white/75">{activeMission.goal}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs font-black">
              <span className="rounded-full bg-white/12 px-3 py-2">{activeMission.estimatedMinutes} menit</span>
              <span className="rounded-full bg-white/12 px-3 py-2">+{activeMission.rewardXp} XP</span>
              <span className="rounded-full bg-white/12 px-3 py-2">+{activeMission.rewardDayaBale} Daya Bale</span>
            </div>
          </div>
          <button
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#22c55e] px-5 py-4 font-heading font-black text-white shadow-[0_6px_0_#129447] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none sm:w-auto"
            onClick={onStartMission}
            type="button"
          >
            Lanjutkan Misi
            <ArrowRight size={19} />
          </button>
        </article>

        <div className="space-y-4">
          <BaleHero state="greeting" />
          <section className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-black uppercase text-slate-400">Rank dan kelas</p>
            <p className="font-heading mt-1 text-2xl font-black">{user.rank} {user.rankTier}</p>
            <p className="mt-1 text-sm font-bold text-slate-500">Level {user.level} - {world.characterClass}</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Metric label="XP Matematika" value={String(user.xp.numeria)} />
              <Metric label="Mastery Matematika" value={`${user.mastery.numeria}%`} />
            </div>
          </section>
        </div>
      </section>

      <section className="mt-4 grid gap-3 sm:grid-cols-4">
        <QuickAction icon={<HelpCircle size={18} />} label="Tanya Bale" />
        <QuickAction icon={<Sparkles size={18} />} label="Cek Paham" />
        <QuickAction icon={<ScanLine size={18} />} label="Pindai Materi" />
        <QuickAction icon={<Zap size={18} />} label="Kuis Kilat" />
      </section>

      <div className="mt-4">
        <WorldSelector onSelect={onSelectWorld} selectedWorld={selectedWorld} worlds={worlds} />
      </div>
    </div>
  );
}

function Status({ icon, label }: { icon: React.ReactNode; label: string }) {
  return <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-600">{icon}{label}</span>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-[8px] bg-slate-50 p-3"><p className="font-heading text-xl font-black">{value}</p><p className="text-xs font-black text-slate-500">{label}</p></div>;
}

function QuickAction({ icon, label }: { icon: React.ReactNode; label: string }) {
  return <button className="flex min-h-16 items-center gap-3 rounded-[8px] border border-slate-200 bg-white p-4 text-left font-heading font-black text-slate-700 shadow-sm focus:outline-none focus:ring-4 focus:ring-[#bfdbfe]" type="button">{icon}{label}</button>;
}
