"use client";

import { ArrowLeft, Check, Flame, HelpCircle, X } from "lucide-react";
import { BaleMission } from "../../types";

export function MissionShell({
  mission,
  attempts,
  selectedAnswer,
  onSelect,
  onCheck,
  feedback,
}: {
  mission: BaleMission;
  attempts: number;
  selectedAnswer: string | null;
  onSelect: (id: string) => void;
  onCheck: () => void;
  feedback?: string;
}) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-5 sm:px-6">
      <header className="flex items-center gap-3">
        <button aria-label="Keluar dari misi" className="grid size-10 place-items-center rounded-[8px] border border-slate-200 bg-white text-slate-600" type="button">
          <ArrowLeft size={18} />
        </button>
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100" aria-label={`Progres misi ${Math.min(attempts + 1, 4)} dari 4`}>
          <div className="h-full rounded-full bg-[#22c55e] transition-all" style={{ width: `${Math.min((attempts + 1) * 25, 100)}%` }} />
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-[#fff7ed] px-3 py-2 text-xs font-black text-[#c2410c]">
          <Flame size={15} /> Nyala
        </span>
        <button aria-label="Buka bantuan" className="grid size-10 place-items-center rounded-[8px] border border-slate-200 bg-white text-[#2563eb]" type="button">
          <HelpCircle size={18} />
        </button>
      </header>

      <section className="mt-5 rounded-[8px] bg-[#172033] p-5 text-white shadow-[0_8px_0_#020617]">
        <p className="text-xs font-black uppercase text-[#f9c74f]">{mission.title}</p>
        <h1 className="font-heading mt-2 text-2xl font-black">{mission.prompt}</h1>
        <p className="mt-3 text-sm font-bold leading-6 text-white/75">{mission.story}</p>
      </section>

      <section className="mt-4 grid gap-3">
        {mission.options.map((option) => {
          const active = selectedAnswer === option.id;
          return (
            <button
              className={[
                "flex min-h-16 items-center gap-3 rounded-[8px] border-2 bg-white p-4 text-left font-bold transition focus:outline-none focus:ring-4 focus:ring-[#bfdbfe]",
                active ? "border-[#2563eb] bg-[#eff6ff]" : "border-slate-200",
              ].join(" ")}
              key={option.id}
              onClick={() => onSelect(option.id)}
              type="button"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-[8px] bg-slate-100 font-heading font-black">{option.label}</span>
              {option.text}
            </button>
          );
        })}
      </section>

      {feedback ? (
        <div className="mt-4 flex gap-3 rounded-[8px] border border-[#fecdd3] bg-[#fff1f2] p-4 text-sm font-bold leading-6 text-[#9f1239]">
          <X className="mt-0.5 shrink-0" size={18} />
          {feedback}
        </div>
      ) : null}

      <button
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#22c55e] px-5 py-4 font-heading font-black text-white shadow-[0_6px_0_#129447] disabled:opacity-60"
        disabled={!selectedAnswer}
        onClick={onCheck}
        type="button"
      >
        <Check size={18} />
        Cek Jawaban
      </button>
    </main>
  );
}
