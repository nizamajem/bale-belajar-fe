"use client";

import { Compass } from "lucide-react";
import { BaleWorld, BaleWorldKey } from "../../types";

export function WorldSelector({
  selectedWorld,
  worlds,
  onSelect,
}: {
  selectedWorld: BaleWorldKey;
  worlds: BaleWorld[];
  onSelect: (world: BaleWorldKey) => void;
}) {
  return (
    <section aria-labelledby="world-title" className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <Compass className="text-[#2563eb]" size={20} />
        <h2 id="world-title" className="font-heading text-lg font-black">Pilih Dunia</h2>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {worlds.map((world) => {
          const active = selectedWorld === world.key;
          return (
            <button
              aria-pressed={active}
              className={[
                "rounded-[8px] border-2 p-4 text-left transition focus:outline-none focus:ring-4 focus:ring-[#bfdbfe]",
                active ? "border-[#2563eb] bg-[#eff6ff]" : "border-slate-200 bg-white hover:border-slate-300",
              ].join(" ")}
              key={world.key}
              onClick={() => onSelect(world.key)}
              type="button"
            >
              <span className="block text-xs font-black uppercase" style={{ color: world.color }}>{world.subject}</span>
              <span className="font-heading mt-1 block text-xl font-black text-[#172033]">{world.name}</span>
              <span className="mt-2 block text-sm font-bold leading-6 text-slate-600">{world.characterClass}</span>
              <span className="mt-3 block h-2 overflow-hidden rounded-full bg-slate-100">
                <span className="block h-full rounded-full" style={{ width: `${world.mastery}%`, background: world.color }} />
              </span>
              <span className="mt-2 block text-xs font-black text-slate-500">Mastery {world.mastery}%</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
