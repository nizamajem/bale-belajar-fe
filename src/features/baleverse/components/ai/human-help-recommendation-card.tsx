"use client";

import { ShieldCheck, UserRoundCheck } from "lucide-react";
import { HumanHelpRecommendation } from "../../types";

export function HumanHelpRecommendationCard({
  recommendation,
  selectedContext,
  onToggleContext,
  onApprove,
  onCancel,
}: {
  recommendation: HumanHelpRecommendation;
  selectedContext: string[];
  onToggleContext: (item: string) => void;
  onApprove: () => void;
  onCancel: () => void;
}) {
  return (
    <section aria-labelledby="human-help-title" className="rounded-[8px] border-2 border-[#bfdbfe] bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-[8px] bg-[#eff6ff] text-[#2563eb]">
          <UserRoundCheck size={22} />
        </span>
        <div>
          <p className="text-xs font-black uppercase text-[#2563eb]">Bantuan Manusia</p>
          <h2 id="human-help-title" className="font-heading text-xl font-black">Mentor disarankan</h2>
          <p className="mt-2 text-sm font-bold leading-6 text-slate-600">{recommendation.problem} {recommendation.reason}</p>
          <p className="mt-2 rounded-[8px] bg-[#f8fafc] p-3 text-sm font-bold leading-6 text-slate-600">
            Meminta bantuan bukan berarti gagal. Kadang penjelasan langsung dari manusia adalah langkah terbaik.
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-[8px] border border-slate-200 p-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-[#22c55e]" size={18} />
          <p className="font-heading font-black">Data yang akan dibagikan</p>
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {recommendation.shareableContext.map((item) => (
            <label className="flex items-center gap-2 rounded-[8px] bg-slate-50 px-3 py-2 text-sm font-bold" key={item}>
              <input checked={selectedContext.includes(item)} onChange={() => onToggleContext(item)} type="checkbox" />
              {item}
            </label>
          ))}
        </div>
        <p className="mt-3 text-xs font-bold leading-5 text-slate-500">
          Chat AI lengkap, profil dunia lain, dan informasi keluarga tidak dibagikan.
        </p>
      </div>

      <div className="mt-4 rounded-[8px] bg-[#f8fafc] p-3">
        <p className="text-xs font-black uppercase text-slate-400">Pesan dapat diedit nanti</p>
        <p className="mt-1 text-sm font-bold leading-6 text-slate-600">{recommendation.messageDraft}</p>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button className="rounded-[8px] bg-[#2563eb] px-4 py-3 font-heading font-black text-white shadow-[0_5px_0_#1e40af]" onClick={onApprove} type="button">
          Minta Mentor Membantu
        </button>
        <button className="rounded-[8px] border-2 border-slate-200 bg-white px-4 py-3 font-heading font-black text-slate-700" onClick={onCancel} type="button">
          Coba Contoh Lebih Mudah
        </button>
      </div>
    </section>
  );
}
