"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, BookOpen, CheckCircle2, Loader2, MapPinned, Sparkles, Target } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { GrowthMapEntry, LearningMasteryStatus, WorldSummary } from "@/lib/types";
import { ProgressBar, StudentShell } from "../_components/student-shell";

const skillCopy: Record<string, { title: string; description: string }> = {
  Observasi: {
    title: "Teliti melihat detail",
    description: "Kamu belajar memperhatikan hal penting dan tidak buru-buru menyimpulkan.",
  },
  "Penalaran Logis": {
    title: "Berpikir masuk akal",
    description: "Kamu belajar memilih jawaban yang punya alasan jelas.",
  },
  "Memori Kerja": {
    title: "Mengingat informasi penting",
    description: "Kamu belajar menyimpan beberapa petunjuk di kepala saat menjawab.",
  },
  "Analisis Kronologi": {
    title: "Menyusun urutan kejadian",
    description: "Kamu belajar membaca mana yang terjadi dulu dan mana yang terjadi setelahnya.",
  },
  "Evaluasi Sumber": {
    title: "Memilih sumber yang bisa dipercaya",
    description: "Kamu belajar membedakan informasi kuat dan informasi yang masih perlu dicek.",
  },
  "Komunikasi dan Etika": {
    title: "Menjawab dengan sopan dan aman",
    description: "Kamu belajar menyampaikan alasan tanpa asal menuduh orang lain.",
  },
};

const statusCopy: Record<LearningMasteryStatus, { label: string; color: string; helper: string }> = {
  MASTERED: {
    label: "Sudah kuat",
    color: "bg-[#dcfce7] text-[#166534]",
    helper: "Pertahankan dengan latihan baru.",
  },
  DEVELOPING: {
    label: "Mulai paham",
    color: "bg-[#fef3c7] text-[#92400e]",
    helper: "Sedikit lagi makin kuat.",
  },
  NEEDS_PRACTICE: {
    label: "Perlu latihan",
    color: "bg-[#ffe4e6] text-[#9f1239]",
    helper: "Tidak apa-apa. Coba misi pendek lagi.",
  },
  INSUFFICIENT_EVIDENCE: {
    label: "Belum mulai",
    color: "bg-slate-100 text-slate-500",
    helper: "Kerjakan misi untuk membuka hasilnya.",
  },
};

export default function GrowthMapPage() {
  return (
    <Suspense
      fallback={
        <StudentShell>
          <div className="grid min-h-[60vh] place-items-center">
            <Loader2 className="animate-spin text-slate-400" size={32} />
          </div>
        </StudentShell>
      }
    >
      <GrowthMapContent />
    </Suspense>
  );
}

function GrowthMapContent() {
  const searchParams = useSearchParams();
  const [worldKey, setWorldKey] = useState<string | null>(searchParams.get("worldKey"));
  const [entries, setEntries] = useState<GrowthMapEntry[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (worldKey) return;

    apiFetch<WorldSummary[]>("/student/worlds")
      .then(({ data }) => setWorldKey(data[0]?.key ?? null))
      .catch(() => setError("Belum ada dunia belajar yang bisa dibuka."));
  }, [worldKey]);

  useEffect(() => {
    if (!worldKey) return;
    let cancelled = false;

    apiFetch<GrowthMapEntry[]>("/student/mastery", { query: { worldKey } })
      .then(({ data }) => {
        if (!cancelled) setEntries(data);
      })
      .catch(() => {
        if (!cancelled) setError("Halaman kemampuanmu belum bisa dibuka.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [worldKey]);

  if (loading) {
    return (
      <StudentShell>
        <div className="grid min-h-[60vh] place-items-center">
          <Loader2 className="animate-spin text-slate-400" size={32} />
        </div>
      </StudentShell>
    );
  }

  return (
    <StudentShell>
      <section className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:py-8">
        <section className="mb-5 rounded-[8px] bg-[#172033] p-5 text-white shadow-[0_8px_0_#020617] sm:p-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-2 text-sm font-black text-[#f9c74f]">
            <Sparkles size={17} />
            Kemampuanmu
          </span>
          <h1 className="font-heading mt-4 text-3xl font-black leading-tight sm:text-4xl">
            Lihat bagian yang sudah kamu kuasai.
          </h1>
          <p className="mt-3 max-w-2xl font-bold leading-7 text-white/72">
            Ini bukan nilai rapor. Ini peta kecil supaya kamu tahu harus latihan apa berikutnya.
          </p>
        </section>

        {error || !entries ? (
          <EmptyState message={error ?? "Belum ada hasil belajar. Coba satu misi dulu."} />
        ) : (
          <>
            <Summary entries={entries} />
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {entries.map((entry, index) => (
                <SkillCard entry={entry} index={index} key={entry.competencyId} />
              ))}
            </div>
          </>
        )}
      </section>
    </StudentShell>
  );
}

function Summary({ entries }: { entries: GrowthMapEntry[] }) {
  const started = entries.filter((entry) => entry.evidenceCount > 0).length;
  const strong = entries.filter((entry) => entry.status === "MASTERED").length;

  return (
    <section className="grid gap-3 sm:grid-cols-3">
      <SummaryCard icon={<BookOpen size={20} />} label="Sudah dicoba" value={`${started}/${entries.length}`} />
      <SummaryCard icon={<CheckCircle2 size={20} />} label="Sudah kuat" value={String(strong)} />
      <SummaryCard icon={<Target size={20} />} label="Saran" value={started ? "Lanjut latihan" : "Mulai misi"} />
    </section>
  );
}

function SummaryCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-[#2563eb]">{icon}</div>
      <p className="font-heading mt-3 text-2xl font-black">{value}</p>
      <p className="text-sm font-bold text-slate-500">{label}</p>
    </div>
  );
}

function SkillCard({ entry, index }: { entry: GrowthMapEntry; index: number }) {
  const text = skillCopy[entry.competencyName] ?? {
    title: entry.competencyName,
    description: "Kemampuan ini akan terlihat setelah kamu menyelesaikan beberapa misi.",
  };
  const status = statusCopy[entry.status];
  const progress = Math.max(0, Math.min(100, Math.round(entry.masteryScore)));

  return (
    <motion.article
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm"
      initial={{ opacity: 0, y: 16 }}
      transition={{ delay: index * 0.05 }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase text-slate-400">{entry.competencyName}</p>
          <h3 className="font-heading mt-1 text-xl font-black text-[#172033]">{text.title}</h3>
        </div>
        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-black ${status.color}`}>
          {status.label}
        </span>
      </div>

      <p className="mt-3 text-sm font-bold leading-6 text-slate-600">{text.description}</p>

      <div className="mt-4">
        <div className="mb-2 flex justify-between gap-3 text-xs font-black uppercase text-slate-400">
          <span>Perkembangan</span>
          <span>{progress}%</span>
        </div>
        <ProgressBar color={entry.status === "MASTERED" ? "bg-[#22c55e]" : "bg-[#2563eb]"} value={progress} />
      </div>

      <div className="mt-4 rounded-[8px] bg-[#f8fafc] p-3">
        <p className="text-sm font-bold leading-6 text-slate-600">{status.helper}</p>
        <p className="mt-1 text-xs font-black uppercase text-slate-400">
          {entry.evidenceCount} latihan selesai
        </p>
      </div>
    </motion.article>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <section className="rounded-[8px] border border-slate-200 bg-white p-6 text-center shadow-sm">
      <MapPinned className="mx-auto text-[#2563eb]" size={34} />
      <h2 className="font-heading mt-4 text-2xl font-black">Belum ada peta kemampuan.</h2>
      <p className="mx-auto mt-2 max-w-md font-bold leading-7 text-slate-500">{message}</p>
      <Link
        className="mt-5 inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#22c55e] px-5 py-4 font-heading font-black text-white shadow-[0_6px_0_#129447]"
        href="/student/world/detectivia"
      >
        Mulai misi
        <ArrowRight size={18} />
      </Link>
    </section>
  );
}
