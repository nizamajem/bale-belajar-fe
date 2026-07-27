"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, Lock, Search, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { CareerPathConfig, CareerPathId, careerPaths } from "@/lib/career-paths";
import { StudentShell } from "../_components/student-shell";

const curriculumDetails: Record<
  CareerPathId,
  {
    certificate: string;
    duration: string;
    modules: string[];
    output: string;
  }
> = {
  DETECTIVE: {
    certificate: "Sertifikat Rank Observer",
    duration: "4 misi awal + Boss Case",
    modules: ["Detective Oath", "Observasi", "Fakta vs Asumsi", "Evidence Board", "Boss Case Pemula"],
    output: "Laporan kasus singkat dan badge Evidence Before Accusation.",
  },
  ANIMAL_DOCTOR: {
    certificate: "Sertifikat Animal Care Starter",
    duration: "4 misi awal",
    modules: ["Empati pada hewan", "Kebutuhan dasar", "Gejala sederhana", "Catatan kesehatan"],
    output: "Jurnal perawatan hewan sederhana.",
  },
  KOREAN_AMBASSADOR: {
    certificate: "Sertifikat Language Starter",
    duration: "4 misi awal",
    modules: ["Hangul dasar", "Sapaan", "Budaya sehari-hari", "Percakapan mini"],
    output: "Video/audio perkenalan singkat.",
  },
  PROGRAMMER: {
    certificate: "Sertifikat Logic Starter",
    duration: "4 misi awal",
    modules: ["Pola", "Instruksi berurutan", "Debug sederhana", "Proyek mini"],
    output: "Prototipe aplikasi kecil berbasis logika.",
  },
  DOCTOR: {
    certificate: "Sertifikat Health Starter",
    duration: "4 misi awal",
    modules: ["Tubuh manusia", "Kebiasaan sehat", "Membaca gejala", "Keputusan berbasis bukti"],
    output: "Poster edukasi kesehatan sederhana.",
  },
  ARCHITECT: {
    certificate: "Sertifikat Design Starter",
    duration: "4 misi awal",
    modules: ["Ruang dan bentuk", "Sketsa denah", "Ukuran sederhana", "Presentasi desain"],
    output: "Konsep ruang impian dengan denah sederhana.",
  },
  ENTREPRENEUR: {
    certificate: "Sertifikat Business Starter",
    duration: "4 misi awal",
    modules: ["Cari masalah", "Ide solusi", "Hitung biaya", "Pitch sederhana"],
    output: "Mini pitch deck ide usaha.",
  },
  CONTENT_CREATOR: {
    certificate: "Sertifikat Creator Starter",
    duration: "4 misi awal",
    modules: ["Ide konten", "Naskah pendek", "Visual sederhana", "Etika digital"],
    output: "Konsep konten edukatif 1 menit.",
  },
  TEACHER: {
    certificate: "Sertifikat Teaching Starter",
    duration: "4 misi awal",
    modules: ["Memahami teman", "Membuat contoh", "Menjelaskan pelan", "Membantu tanpa menggurui"],
    output: "Mini lesson untuk membantu teman belajar.",
  },
};

export default function StudentCareersPage() {
  const [selectedCareer, setSelectedCareer] = useState<CareerPathConfig | null>(null);

  return (
    <StudentShell>
      <section className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:py-8">
        <p className="text-sm font-black uppercase text-[#2563eb]">Kelas impian</p>
        <h1 className="font-heading text-3xl font-black leading-tight text-[#172033] sm:text-5xl">
          Pilih kelas akademi yang ingin kamu coba.
        </h1>
        <p className="mt-2 max-w-2xl font-bold leading-6 text-slate-500">
          Lihat pilihan kelas, buka detail kurikulum, lalu mulai dari kelas yang sudah aktif.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {careerPaths.map((career) => {
            const active = career.status === "ACTIVE";
            return (
              <article
                className="overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-sm"
                key={career.id}
              >
                <div className="min-h-44 p-5 text-white" style={{ background: career.gradient }}>
                  <div className="flex items-start justify-between gap-3">
                    <span className="grid size-11 place-items-center rounded-[8px] bg-white/16">
                      {active ? <Search size={24} /> : <Sparkles size={24} />}
                    </span>
                    <span className="rounded-full bg-white/14 px-3 py-1 text-xs font-black text-white">
                      {active ? "Aktif" : "Segera"}
                    </span>
                  </div>
                  <p className="mt-4 text-xs font-black uppercase text-white/62">{career.academyName}</p>
                  <h2 className="font-heading mt-2 text-2xl font-black">{career.title}</h2>
                  <p className="mt-2 text-sm font-bold leading-6 text-white/82">{career.tagline}</p>
                </div>

                <div className="grid gap-2 p-4">
                  <button
                    className="inline-flex w-full items-center justify-center gap-2 rounded-[8px] border-2 border-slate-200 bg-white px-4 py-3 font-heading font-black text-slate-700 shadow-[0_5px_0_#d8e2ef]"
                    onClick={() => setSelectedCareer(career)}
                    type="button"
                  >
                    <BookOpen size={17} />
                    Detail kurikulum
                  </button>

                  {active ? (
                    <Link
                      className="inline-flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#22c55e] px-4 py-3 font-heading font-black text-white shadow-[0_5px_0_#129447]"
                      href="/student/world/detectivia"
                    >
                      Mulai kelas
                      <ArrowRight size={17} />
                    </Link>
                  ) : (
                    <button
                      className="inline-flex w-full items-center justify-center gap-2 rounded-[8px] bg-slate-100 px-4 py-3 font-heading font-black text-slate-400"
                      disabled
                      type="button"
                    >
                      <Lock size={17} />
                      Belum dibuka
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {selectedCareer ? (
        <CurriculumModal career={selectedCareer} onClose={() => setSelectedCareer(null)} />
      ) : null}
    </StudentShell>
  );
}

function CurriculumModal({
  career,
  onClose,
}: {
  career: CareerPathConfig;
  onClose: () => void;
}) {
  const detail = curriculumDetails[career.id];

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-[#020617]/55 px-3 py-3 sm:place-items-center sm:p-6">
      <div className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-[8px] bg-white shadow-2xl">
        <div className="p-5 text-white" style={{ background: career.gradient }}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase text-white/65">{career.academyName}</p>
              <h2 className="font-heading mt-2 text-3xl font-black">{career.title}</h2>
              <p className="mt-2 max-w-xl text-sm font-bold leading-6 text-white/82">{career.tagline}</p>
            </div>
            <button
              aria-label="Tutup detail kurikulum"
              className="grid size-10 shrink-0 place-items-center rounded-[8px] bg-white/14 text-white"
              onClick={onClose}
              type="button"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <InfoBox label="Durasi awal" value={detail.duration} />
            <InfoBox label="Sertifikat" value={detail.certificate} />
          </div>

          <div className="mt-5 rounded-[8px] bg-[#f8fafc] p-4">
            <p className="text-sm font-black uppercase text-[#2563eb]">Isi kurikulum</p>
            <div className="mt-3 grid gap-2">
              {detail.modules.map((module, index) => (
                <div className="flex items-center gap-3 rounded-[8px] bg-white p-3 shadow-sm" key={module}>
                  <span className="grid size-8 shrink-0 place-items-center rounded-[8px] bg-[#172033] font-heading font-black text-white">
                    {index + 1}
                  </span>
                  <p className="font-heading font-black text-[#172033]">{module}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-[8px] border border-[#bbf7d0] bg-[#f0fdf4] p-4">
            <div className="flex gap-2">
              <CheckCircle2 className="mt-0.5 shrink-0 text-[#166534]" size={19} />
              <div>
                <p className="font-heading font-black text-[#166534]">Output akhir</p>
                <p className="mt-1 text-sm font-bold leading-6 text-[#166534]">{detail.output}</p>
              </div>
            </div>
          </div>

          <button
            className="mt-5 inline-flex w-full items-center justify-center rounded-[8px] bg-[#172033] px-5 py-4 font-heading font-black text-white shadow-[0_6px_0_#020617]"
            onClick={onClose}
            type="button"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-black uppercase text-slate-400">{label}</p>
      <p className="font-heading mt-1 text-lg font-black text-[#172033]">{value}</p>
    </div>
  );
}
