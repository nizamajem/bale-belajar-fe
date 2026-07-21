"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight, Download, Loader2, Sparkles, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { ApiError, apiFetch } from "@/lib/api";
import { AttemptResult, masteryLabel } from "@/lib/types";
import {
  ProgressBar,
  StatusPill,
  StudentShell,
} from "../../_components/student-shell";

function toneColor(status: "MASTERED" | "DEVELOPING" | "NEEDS_PRACTICE") {
  if (status === "MASTERED") return "bg-[#22c55e]";
  if (status === "DEVELOPING") return "bg-[#f9c74f]";
  return "bg-[#ff6b6b]";
}

function studentOpening(result: AttemptResult) {
  const mastered = result.competencyResults.filter((item) => item.masteryStatus === "MASTERED");
  const practice = result.competencyResults.filter((item) => item.masteryStatus === "NEEDS_PRACTICE");
  if (mastered.length > 0 && practice.length > 0) {
    return `Kamu sudah menunjukkan pemahaman yang baik pada ${mastered[0].competency.name}. Langkah berikutnya adalah memperkuat ${practice[0].competency.name} secara bertahap.`;
  }
  if (mastered.length > 0) {
    return `Kamu sudah menunjukkan pemahaman yang baik pada ${mastered[0].competency.name}. Pertahankan ritme belajar dan gunakan hasil ini untuk menentukan target berikutnya.`;
  }
  return "Hasil ini membantu kamu melihat bagian yang perlu dilatih lebih dulu. Fokus pada satu prioritas kecil akan membuat belajar terasa lebih ringan.";
}

function sevenDayPlan(priority?: string) {
  const topic = priority ?? "materi prioritas";
  return [
    ["Hari 1", `Baca ulang catatan ${topic} dan tulis dua hal yang belum jelas.`],
    ["Hari 2", `Kerjakan 5 soal dasar tentang ${topic} tanpa melihat pembahasan.`],
    ["Hari 3", "Bahas jawaban yang salah dan catat pola kesalahannya."],
    ["Hari 4", `Kerjakan 5 soal baru dengan tingkat sedikit lebih menantang.`],
    ["Hari 5", "Jelaskan langkah penyelesaian dengan kata-katamu sendiri."],
    ["Hari 6", "Minta guru atau teman memeriksa satu soal yang masih membingungkan."],
    ["Hari 7", "Coba asesmen ulang singkat atau latihan campuran untuk melihat kemajuan."],
  ];
}

export default function ResultPage() {
  const params = useParams<{ attemptId: string }>();
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<AttemptResult>(`/student/attempts/${params.attemptId}/result`)
      .then(({ data }) => setResult(data))
      .catch((err) => setError(err instanceof ApiError ? err.message : "Gagal memuat hasil."))
      .finally(() => setLoading(false));
  }, [params.attemptId]);

  if (loading) {
    return (
      <StudentShell>
        <div className="grid place-items-center py-20">
          <Loader2 className="animate-spin text-slate-400" size={28} />
        </div>
      </StudentShell>
    );
  }

  if (error || !result) {
    return (
      <StudentShell>
        <div className="mx-auto max-w-xl px-4 py-10 text-center">
          <p className="font-bold text-[#e11d48]">{error ?? "Hasil tidak ditemukan."}</p>
          <Link className="mt-4 inline-block font-heading font-black text-[#2563eb]" href="/student/dashboard">
            Kembali ke beranda
          </Link>
        </div>
      </StudentShell>
    );
  }

  const score = Math.round(Number(result.totalScore));
  const weakest = result.competencyResults.slice().sort((a, b) => Number(a.score) - Number(b.score))[0];
  const strongest = result.competencyResults.slice().sort((a, b) => Number(b.score) - Number(a.score))[0];
  const opening = studentOpening(result);
  const plan = sevenDayPlan(weakest?.competency.name);

  function printResult() {
    window.print();
  }

  return (
    <StudentShell>
      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-8">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[8px] bg-[#2563eb] p-6 text-white shadow-[0_10px_0_#1d4ed8] sm:p-8"
          initial={{ opacity: 0, y: 16 }}
        >
          <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_220px] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/16 px-3 py-2 text-sm font-black">
                <Sparkles size={17} />
                Hasil asesmen selesai
              </span>
              <h1 className="font-heading mt-4 text-3xl font-black leading-tight sm:text-5xl text-balance-soft">
                {result.assignment.assessment.title}
              </h1>
              <p className="mt-4 max-w-2xl font-bold leading-7 text-white/86">
                {opening}
              </p>
              <p className="mt-3 max-w-2xl text-sm font-bold leading-6 text-white/78">
                Ringkasan jawaban: {result.correctAnswers} benar, {result.wrongAnswers} perlu diperiksa kembali, {result.unanswered} belum dijawab.
                {weakest ? ` Fokus latihan berikutnya: ${weakest.competency.name}.` : ""}
              </p>
            </div>
            <div className="rounded-[8px] bg-white p-5 text-center text-[#172033] shadow-xl">
              <Trophy className="mx-auto text-[#f9c74f]" fill="#f9c74f" size={42} />
              <p className="font-heading mt-3 text-5xl font-black sm:text-6xl">{score}</p>
              <p className="mt-1 text-sm font-black text-slate-500">Skor total</p>
            </div>
          </div>
        </motion.div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_360px]">
          <section className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black uppercase text-[#22c55e]">
                  Peta kemampuan
                </p>
                <h2 className="font-heading text-2xl font-black">
                  Ringkasan kompetensi
                </h2>
              </div>
              <span className="w-fit rounded-full bg-[#eff6ff] px-3 py-1 text-xs font-black text-[#2563eb]">
                {result.assignment.assessment.subject.name}
              </span>
            </div>

            {result.competencyResults.length === 0 ? (
              <p className="rounded-[8px] bg-[#f8fafc] p-5 text-sm font-bold text-slate-500">
                Belum ada rincian kompetensi untuk hasil ini.
              </p>
            ) : (
              <div className="space-y-5">
                {result.competencyResults.map((item, index) => (
                  <motion.div
                    animate={{ opacity: 1, x: 0 }}
                    initial={{ opacity: 0, x: -12 }}
                    key={item.id}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <span className="font-heading font-black">{item.competency.name}</span>
                      <div className="flex items-center gap-2">
                        <StatusPill status={masteryLabel(item.masteryStatus)} />
                        <span className="text-sm font-black text-slate-500">
                          {Math.round(Number(item.score))}%
                        </span>
                      </div>
                    </div>
                    <ProgressBar color={toneColor(item.masteryStatus)} value={Number(item.score)} />
                  </motion.div>
                ))}
              </div>
            )}
          </section>

          <aside className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <p className="text-sm font-black uppercase text-[#2563eb]">
              Prioritas belajar
            </p>
            <h2 className="font-heading mt-1 text-2xl font-black">
              Rekomendasi
            </h2>
            <div className="mt-5 space-y-3">
              {strongest ? (
                <div className="rounded-[8px] bg-[#f0fdf4] p-4 text-sm font-bold leading-6 text-[#166534]">
                  Kekuatan saat ini: {strongest.competency.name} ({Math.round(Number(strongest.score))}%).
                </div>
              ) : null}
              {result.recommendations.length === 0 ? (
                <p className="rounded-[8px] bg-[#f8fafc] p-4 text-sm font-bold text-slate-500">
                  Tidak ada rekomendasi khusus - kemampuan sudah merata.
                </p>
              ) : (
                result.recommendations.map((item, index) => (
                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3 rounded-[8px] bg-[#f8fafc] p-4"
                    initial={{ opacity: 0, y: 12 }}
                    key={item.id}
                    transition={{ delay: index * 0.05 }}
                  >
                    <span className="grid size-8 shrink-0 place-items-center rounded-[8px] bg-[#22c55e] font-heading font-black text-white">
                      {index + 1}
                    </span>
                    <p className="text-sm font-bold leading-6 text-slate-600">
                      Latih kembali: {item.competency.name}
                    </p>
                  </motion.div>
                ))
              )}
            </div>
          </aside>
        </div>

        <section className="mt-6 rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <p className="text-sm font-black uppercase text-[#22c55e]">
            Rencana belajar 7 hari
          </p>
          <h2 className="font-heading mt-1 text-2xl font-black">
            Mulai dari satu prioritas kecil
          </h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {plan.map(([day, activity]) => (
              <div className="rounded-[8px] bg-[#f8fafc] p-4" key={day}>
                <p className="font-heading font-black text-[#2563eb]">{day}</p>
                <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">
                  {activity}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-5 rounded-[8px] bg-[#fffbeb] p-4 text-sm font-bold leading-6 text-[#92400e]">
            Catatan: hasil ini adalah alat bantu belajar, bukan penilaian akhir kemampuanmu.
            Guru tetap dapat membantu menyesuaikan langkah belajar yang paling tepat.
          </p>
        </section>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            className="inline-flex items-center justify-center gap-2 rounded-[8px] border-2 border-slate-200 bg-white px-5 py-4 font-heading font-black text-slate-700 shadow-[0_6px_0_#d8e2ef] transition active:translate-y-1 active:shadow-none"
            onClick={printResult}
            type="button"
          >
            <Download size={18} />
            Cetak / Simpan PDF
          </button>
          <Link
            className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#2563eb] px-5 py-4 font-heading font-black text-white shadow-[0_6px_0_#1d4ed8] transition active:translate-y-1 active:shadow-none"
            href="/student/dashboard"
          >
            Kembali
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </StudentShell>
  );
}
