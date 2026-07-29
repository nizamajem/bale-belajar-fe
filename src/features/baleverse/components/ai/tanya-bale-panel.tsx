"use client";

import { Bot, Loader2, MessageSquareText } from "lucide-react";
import { AiConfidence } from "../../types";

export function TanyaBalePanel({
  confidence,
  hint,
  thinking,
}: {
  confidence: AiConfidence;
  hint: string;
  thinking?: boolean;
}) {
  const confidenceCopy = {
    high: "Aku menemukan pola kesalahannya. Mari kita perbaiki satu langkah.",
    medium: "Ada dua kemungkinan penyebab. Kita cek satu hal lagi.",
    low: "Aku belum cukup yakin untuk menilai ini dengan adil. Mentor bisa membantu memeriksa jawabanmu.",
  } satisfies Record<AiConfidence, string>;

  return (
    <aside aria-live="polite" className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="grid size-9 place-items-center rounded-[8px] bg-[#eff6ff] text-[#2563eb]">
          {thinking ? <Loader2 className="animate-spin" size={18} /> : <Bot size={18} />}
        </span>
        <div>
          <p className="font-heading font-black">Tanya Bale</p>
          <p className="text-xs font-black uppercase text-slate-400">Mode: Berikan Petunjuk</p>
        </div>
      </div>
      <div className="mt-3 rounded-[8px] bg-[#f8fafc] p-3">
        <div className="flex gap-2">
          <MessageSquareText className="mt-1 shrink-0 text-[#2563eb]" size={17} />
          <p className="text-sm font-bold leading-6 text-slate-600">{hint}</p>
        </div>
      </div>
      <p className="mt-3 text-sm font-bold leading-6 text-slate-600">{confidenceCopy[confidence]}</p>
    </aside>
  );
}
