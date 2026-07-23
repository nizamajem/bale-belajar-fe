import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { WorldSummary } from "@/lib/types";
import { XpBar } from "./xp-bar";

export function WorldCard({ world }: { world: WorldSummary }) {
  return (
    <Link
      className="interactive-card group relative block overflow-hidden rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm focus:outline-none focus:ring-4 focus:ring-[#bfdbfe]"
      href={`/student/world/${world.key}`}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
        <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#2563eb,#06b6d4,#22c55e)]" />
        <div className="surface-detective absolute inset-0 opacity-35" />
      </div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="grid size-12 place-items-center rounded-[8px] bg-[#ede9fe] text-[#6d28d9] transition group-hover:-rotate-3 group-hover:scale-105">
          <Sparkles size={24} />
        </span>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600 transition group-hover:bg-[#fff7ed] group-hover:text-[#c2410c]">
          {world.characterClass}
        </span>
      </div>
      <h3 className="relative font-heading text-xl font-black">{world.name}</h3>
      <p className="mt-1 text-sm font-bold text-slate-500">{world.subject.name}</p>
      <div className="mt-4">
        <XpBar level={world.worldLevel} levelLabel="Level Dunia" xpIntoLevel={world.worldXp % 100} xpRequired={100} />
      </div>
      <div className="mt-4 inline-flex items-center gap-2 font-heading text-sm font-black text-[#2563eb]">
        Buka dunia
        <ArrowRight className="transition group-hover:translate-x-1" size={16} />
      </div>
    </Link>
  );
}
