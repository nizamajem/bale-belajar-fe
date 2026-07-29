"use client";

import { motion } from "framer-motion";
import { Bot, Brain, CheckCircle2, Clock, HelpCircle, Sparkles } from "lucide-react";
import { BaleHeroState } from "../../types";

const stateCopy: Record<BaleHeroState, { label: string; message: string; icon: React.ComponentType<{ size?: number }> }> = {
  idle: { label: "Siap", message: "Pilih satu misi kecil untuk hari ini.", icon: Sparkles },
  greeting: { label: "Halo lagi", message: "Senang kamu kembali. Kita mulai dari satu misi kecil.", icon: Sparkles },
  thinking: { label: "Berpikir", message: "Aku cek dulu pola jawabanmu.", icon: Brain },
  confused: { label: "Perlu cek", message: "Ada bagian yang masih tertukar. Kita pelan-pelan.", icon: HelpCircle },
  encouraging: { label: "Semangat", message: "Coba satu langkah lagi sebelum melihat penjelasan penuh.", icon: CheckCircle2 },
  happy: { label: "Mantap", message: "Langkahmu mulai rapi.", icon: CheckCircle2 },
  celebrating: { label: "Naik", message: "Misi selesai dan kemampuanmu bertambah.", icon: Sparkles },
  askingMentor: { label: "Minta mentor", message: "Meminta bantuan bukan berarti gagal.", icon: Bot },
  waiting: { label: "Menunggu", message: "Permintaanmu sudah dikirim. Sambil menunggu, coba contoh ringan.", icon: Clock },
};

export function BaleHero({ state }: { state: BaleHeroState }) {
  const copy = stateCopy[state];
  const Icon = copy.icon;

  return (
    <motion.aside
      aria-label={`BaleHero ${copy.label}`}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm"
      initial={{ opacity: 0, scale: 0.97, y: 8 }}
      transition={{ duration: 0.24 }}
    >
      <div className="flex items-center gap-4">
        <motion.div
          animate={{ y: [0, -6, 0] }}
          className="relative grid size-28 shrink-0 place-items-center rounded-[8px] bg-[#eff6ff] text-[#2563eb]"
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="absolute top-5 flex gap-5">
            <span className="size-3 rounded-full bg-[#172033]" />
            <span className="size-3 rounded-full bg-[#172033]" />
          </div>
          <div className="mt-8 h-4 w-10 rounded-b-full border-b-4 border-[#172033]" />
          <span className="absolute -right-2 -top-2 grid size-10 place-items-center rounded-full bg-[#f9c74f] text-[#172033] shadow-sm">
            <Icon size={20} />
          </span>
        </motion.div>
        <div className="min-w-0">
          <p className="text-xs font-black uppercase text-[#2563eb]">{copy.label}</p>
          <p className="font-heading mt-1 text-xl font-black text-[#172033]">BaleHero</p>
          <p className="mt-2 text-sm font-bold leading-6 text-slate-600">{copy.message}</p>
        </div>
      </div>
    </motion.aside>
  );
}
