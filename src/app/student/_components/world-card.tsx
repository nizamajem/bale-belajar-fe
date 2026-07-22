import Link from "next/link";
import { Sparkles } from "lucide-react";
import { WorldSummary } from "@/lib/types";
import { XpBar } from "./xp-bar";

export function WorldCard({ world }: { world: WorldSummary }) {
  return (
    <Link
      className="block rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5"
      href={`/student/world/${world.key}`}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="grid size-12 place-items-center rounded-[8px] bg-[#ede9fe] text-[#6d28d9]">
          <Sparkles size={24} />
        </span>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
          {world.characterClass}
        </span>
      </div>
      <h3 className="font-heading text-xl font-black">{world.name}</h3>
      <p className="mt-1 text-sm font-bold text-slate-500">{world.subject.name}</p>
      <div className="mt-4">
        <XpBar level={world.worldLevel} levelLabel="Level Dunia" xpIntoLevel={world.worldXp % 100} xpRequired={100} />
      </div>
    </Link>
  );
}
