"use client";

import { motion } from "framer-motion";
import { Check, Lock, MessageCircle, Search, Sparkles } from "lucide-react";

export function DetectiveAvatar({ name = "Bale Buddy" }: { name?: string }) {
  return (
    <motion.div
      aria-label={name}
      className="relative grid size-20 shrink-0 place-items-center rounded-[8px] bg-white/18"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.24 }}
    >
      <div className="detective-idle relative size-14 rounded-[8px] bg-white shadow-[0_6px_0_rgba(255,255,255,0.35)]">
        <div className="absolute left-3 top-5 size-2.5 rounded-full bg-[#172033]" />
        <div className="absolute right-3 top-5 size-2.5 rounded-full bg-[#172033]" />
        <div className="absolute left-1/2 top-8 h-2.5 w-7 -translate-x-1/2 rounded-b-full border-b-[4px] border-[#172033]" />
        <Search className="absolute -right-2 -top-2 rounded-full bg-[#f9c74f] p-1 text-[#172033]" size={23} />
      </div>
    </motion.div>
  );
}

export function MentorDialogue({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[8px] border border-white/18 bg-white/14 p-4 text-sm font-bold leading-6 text-white/90"
      initial={{ opacity: 0, y: 10 }}
      transition={{ delay: 0.16, duration: 0.22 }}
    >
      <div className="mb-2 flex items-center gap-2 font-heading font-black text-white">
        <MessageCircle size={17} />
        Catatan Mentor
      </div>
      {children}
    </motion.div>
  );
}

export function LoadingEvidence({ label = "Menyusun petunjuk belajarmu..." }: { label?: string }) {
  return (
    <div className="grid min-h-[220px] place-items-center rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="w-full max-w-xs">
        <div className="mx-auto mb-5 grid size-16 place-items-center rounded-[8px] bg-[#eff6ff] text-[#2563eb]">
          <Sparkles className="detective-spin" size={28} />
        </div>
        <p className="text-center font-heading font-black text-slate-700">{label}</p>
        <div className="mt-5 space-y-2">
          {[0, 1, 2].map((item) => (
            <div className="h-3 overflow-hidden rounded-full bg-slate-100" key={item}>
              <div className="evidence-scan h-full rounded-full bg-[#22c55e]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function MissionMapNode({
  active,
  complete,
  label,
  locked,
}: {
  active?: boolean;
  complete?: boolean;
  label: string;
  locked?: boolean;
}) {
  return (
    <div className="group relative">
      <button
        className={[
          "grid min-h-16 w-full place-items-center rounded-[8px] border-2 px-3 py-3 text-center font-heading text-xs font-black transition focus:outline-none focus:ring-4 focus:ring-[#93c5fd]",
          active && "mission-node-active border-[#22c55e] bg-[#f0fdf4] text-[#166534]",
          complete && "border-[#bfdbfe] bg-[#eff6ff] text-[#1d4ed8]",
          locked && "border-slate-200 bg-slate-50 text-slate-400",
          !active && !complete && !locked && "border-slate-200 bg-white text-slate-600 hover:border-[#bfdbfe]",
        ]
          .filter(Boolean)
          .join(" ")}
        disabled={locked}
        type="button"
      >
        <span className="mb-1 grid size-7 place-items-center rounded-full bg-white shadow-sm">
          {locked ? <Lock size={14} /> : complete ? <Check size={15} /> : <Sparkles size={15} />}
        </span>
        {label}
      </button>
      {locked ? (
        <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden w-44 -translate-x-1/2 rounded-[8px] bg-[#172033] p-2 text-center text-xs font-bold text-white shadow-xl group-hover:block group-focus-within:block">
          Selesaikan misi sebelumnya untuk membuka node ini.
        </div>
      ) : null}
    </div>
  );
}
