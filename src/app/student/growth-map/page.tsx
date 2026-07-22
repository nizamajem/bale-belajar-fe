"use client";

import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { Loader2, MapPinned } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { GrowthMapEntry, WorldSummary } from "@/lib/types";
import { MasteryBadge } from "../_components/mastery-badge";
import { ProgressBar, StudentShell } from "../_components/student-shell";

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
      .catch(() => setError("Belum ada dunia yang tersedia."));
  }, [worldKey]);

  useEffect(() => {
    if (!worldKey) return;
    let cancelled = false;

    apiFetch<GrowthMapEntry[]>("/student/mastery", { query: { worldKey } })
      .then(({ data }) => {
        if (!cancelled) setEntries(data);
      })
      .catch(() => {
        if (!cancelled) setError("Peta Tumbuh belum bisa dimuat.");
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
        <div className="mb-6 flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-[8px] bg-[#dbeafe] text-[#1d4ed8]">
            <MapPinned size={24} />
          </span>
          <div>
            <p className="text-sm font-black uppercase text-[#2563eb]">Peta Tumbuh</p>
            <h1 className="font-heading text-2xl font-black">Perjalanan kompetensimu</h1>
          </div>
        </div>

        {error || !entries ? (
          <p className="rounded-[8px] border border-slate-200 bg-white p-8 text-center font-bold text-slate-500 shadow-sm">
            {error ?? "Belum ada data."}
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {entries.map((entry, index) => (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm"
                initial={{ opacity: 0, y: 16 }}
                key={entry.competencyId}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-heading text-lg font-black">{entry.competencyName}</h3>
                  <MasteryBadge confidence={entry.confidence} status={entry.status} />
                </div>
                <div className="mt-4">
                  <ProgressBar value={entry.masteryScore} />
                </div>
                <p className="mt-2 text-xs font-bold text-slate-400">
                  {entry.evidenceCount} bukti latihan terkumpul
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </StudentShell>
  );
}
