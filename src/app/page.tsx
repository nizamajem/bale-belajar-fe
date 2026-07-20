"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  Check,
  Clock3,
  Flame,
  Home,
  Play,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
} from "lucide-react";
import { useMemo, useState } from "react";

type Lesson = {
  title: string;
  status: "done" | "active" | "locked";
  score?: number;
};

const lessons: Lesson[] = [
  { title: "Bilangan", status: "done", score: 92 },
  { title: "Pecahan", status: "done", score: 84 },
  { title: "Perbandingan", status: "active" },
  { title: "Bangun Datar", status: "locked" },
  { title: "Statistika", status: "locked" },
];

const options = [
  "Setiap 2 buku membutuhkan 5 stiker",
  "Setiap 5 buku membutuhkan 2 stiker",
  "Jumlah stiker selalu sama dengan buku",
  "Jumlah buku selalu dua kali stiker",
];

const priorities = [
  { label: "Perbandingan senilai", value: 68, color: "bg-[#ffb703]" },
  { label: "Membaca soal cerita", value: 76, color: "bg-[#2ec4b6]" },
  { label: "Operasi pecahan", value: 88, color: "bg-[#22c55e]" },
];

export default function HomePage() {
  const [selectedOption, setSelectedOption] = useState(0);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">(
    "saved",
  );

  const progress = useMemo(() => {
    const completed = lessons.filter((lesson) => lesson.status === "done").length;
    return Math.round((completed / lessons.length) * 100);
  }, []);

  function chooseOption(index: number) {
    setSelectedOption(index);
    setSaveState("saving");
    window.setTimeout(() => setSaveState("saved"), 700);
  }

  return (
    <main className="min-h-screen overflow-hidden">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a className="flex items-center gap-3" href="#">
          <span className="grid size-11 place-items-center rounded-[8px] bg-[#22c55e] text-white shadow-[0_6px_0_#129447]">
            <BookOpen size={24} strokeWidth={3} />
          </span>
          <span className="font-heading text-xl font-black text-[#172033]">
            BaleBelajar
          </span>
        </a>

        <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm sm:flex">
          <Flame className="text-[#ff8a00]" size={20} fill="#ffb703" />
          <span className="text-sm font-bold text-slate-700">Streak 7 hari</span>
        </div>

        <button className="rounded-[8px] border border-slate-200 bg-white px-4 py-2 text-sm font-extrabold text-slate-700 shadow-[0_4px_0_#d8e2ef] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none">
          Masuk
        </button>
      </nav>

      <section className="mx-auto grid max-w-7xl items-center gap-8 px-4 pb-8 pt-2 sm:px-6 md:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pb-12">
        <div>
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#b8ead0] bg-white px-4 py-2 text-sm font-extrabold text-[#147a3d] shadow-sm"
            initial={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.45 }}
          >
            <Sparkles size={17} />
            Asesmen terasa seperti misi belajar
          </motion.div>

          <motion.h1
            animate={{ opacity: 1, y: 0 }}
            className="font-heading max-w-3xl text-4xl font-black leading-[1.05] text-[#172033] sm:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 18 }}
            transition={{ delay: 0.08, duration: 0.5 }}
          >
            Belajar terasa ringan, hasilnya tetap berbasis data.
          </motion.h1>

          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 max-w-2xl text-base font-semibold leading-8 text-slate-600 sm:text-lg"
            initial={{ opacity: 0, y: 18 }}
            transition={{ delay: 0.16, duration: 0.5 }}
          >
            BaleBelajar membantu siswa menjawab satu langkah demi satu langkah,
            memberi progress yang jelas, dan menjaga bahasa tetap positif.
          </motion.p>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mt-7 flex flex-col gap-3 sm:flex-row"
            initial={{ opacity: 0, y: 18 }}
            transition={{ delay: 0.24, duration: 0.5 }}
          >
            <Link
              className="primary-bounce inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#22c55e] px-6 py-4 font-heading text-base font-black text-white transition hover:-translate-y-0.5 active:translate-y-1"
              href="/student/dashboard"
            >
              Mulai Misi
              <Play size={19} fill="white" />
            </Link>
            <Link
              className="inline-flex items-center justify-center gap-2 rounded-[8px] border-2 border-slate-200 bg-white px-6 py-4 font-heading text-base font-black text-slate-700 shadow-[0_6px_0_#d8e2ef] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
              href="/student/results/demo"
            >
              Lihat Dashboard
              <ArrowRight size={19} />
            </Link>
          </motion.div>
        </div>

        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
          initial={{ opacity: 0, scale: 0.96 }}
          transition={{ delay: 0.12, duration: 0.55 }}
        >
          <div className="absolute -left-2 top-6 hidden rounded-[8px] bg-white px-4 py-3 shadow-xl sm:block">
            <div className="flex items-center gap-2 text-sm font-extrabold text-slate-700">
              <Trophy size={18} className="text-[#ffb703]" fill="#ffb703" />
              2 kompetensi dikuasai
            </div>
          </div>

          <div className="absolute -right-1 bottom-8 hidden rounded-[8px] bg-white px-4 py-3 shadow-xl sm:block">
            <div className="flex items-center gap-2 text-sm font-extrabold text-slate-700">
              <ShieldCheck size={18} className="text-[#22c55e]" />
              Jawaban tersimpan
            </div>
          </div>

          <BookBuddy />
        </motion.div>
      </section>

      <section className="border-y border-slate-200 bg-white/72 py-4 backdrop-blur">
        <div className="mx-auto grid max-w-7xl gap-3 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
          {[
            ["12 menit", "rata-rata asesmen", Clock3],
            ["84%", "progress kelas", Award],
            ["3", "prioritas belajar", Star],
          ].map(([value, label, Icon]) => (
            <div
              className="flex items-center gap-3 rounded-[8px] bg-white px-4 py-3 shadow-sm"
              key={label as string}
            >
              <span className="grid size-10 place-items-center rounded-[8px] bg-[#eaf6ff] text-[#2563eb]">
                <Icon size={20} />
              </span>
              <div>
                <p className="font-heading text-xl font-black text-[#172033]">
                  {value as string}
                </p>
                <p className="text-sm font-bold text-slate-500">
                  {label as string}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 md:grid-cols-[0.85fr_1.15fr] lg:px-8 lg:py-12">
        <LearningPath progress={progress} />
        <AssessmentPreview
          onChoose={chooseOption}
          options={options}
          saveState={saveState}
          selectedOption={selectedOption}
        />
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-extrabold uppercase text-[#2563eb]">
                  Peta kemampuan
                </p>
                <h2 className="font-heading text-2xl font-black text-[#172033]">
                  Rekomendasi dibuat jelas dan positif
                </h2>
              </div>
              <span className="rounded-full bg-[#ecfeff] px-3 py-1 text-sm font-extrabold text-[#0f766e]">
                Live
              </span>
            </div>

            <div className="space-y-4">
              {priorities.map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between text-sm font-extrabold">
                    <span>{item.label}</span>
                    <span>{item.value}%</span>
                  </div>
                  <div className="h-4 overflow-hidden rounded-full bg-slate-100">
                    <motion.div
                      className={`h-full rounded-full ${item.color}`}
                      initial={{ width: 0 }}
                      transition={{ delay: 0.15, duration: 0.9, ease: "easeOut" }}
                      viewport={{ once: true }}
                      whileInView={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[8px] border border-slate-200 bg-[#172033] p-5 text-white shadow-sm sm:p-6">
            <p className="text-sm font-extrabold uppercase text-[#f9c74f]">
              Bahasa siswa
            </p>
            <h2 className="font-heading mt-2 text-2xl font-black">
              Bukan gagal, tapi &quot;Perlu Latihan&quot;.
            </h2>
            <p className="mt-3 leading-7 text-slate-300">
              Setiap hasil diarahkan ke langkah berikutnya: materi prioritas,
              rencana tujuh hari, dan capaian yang sudah dikuasai.
            </p>
            <div className="mt-5 grid grid-cols-3 gap-2">
              {["Dikuasai", "Berkembang", "Latihan"].map((label, index) => (
                <span
                  className={[
                    "rounded-[8px] px-3 py-3 text-center text-xs font-black",
                    index === 0 && "bg-[#dcfce7] text-[#166534]",
                    index === 1 && "bg-[#fef3c7] text-[#92400e]",
                    index === 2 && "bg-[#ffe4e6] text-[#9f1239]",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  key={label}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <MobileNav />
    </main>
  );
}

function BookBuddy() {
  return (
    <div className="book-buddy mx-auto w-full max-w-[390px]">
      <div className="relative mx-auto aspect-[0.92] w-full">
        <div className="absolute inset-x-[9%] bottom-[7%] h-[72%] rounded-[28px] bg-[#129447] opacity-25 blur-xl" />
        <div className="absolute inset-x-[15%] top-[8%] h-[76%] rounded-[28px] bg-[#22c55e] shadow-[0_14px_0_#129447]">
          <div className="shine absolute inset-3 overflow-hidden rounded-[20px] bg-[#7ee08f]" />
          <div className="absolute left-[18%] top-[20%] size-11 rounded-full bg-white">
            <div className="absolute left-3 top-3 size-4 rounded-full bg-[#172033]" />
          </div>
          <div className="absolute right-[18%] top-[20%] size-11 rounded-full bg-white">
            <div className="absolute left-3 top-3 size-4 rounded-full bg-[#172033]" />
          </div>
          <div className="absolute left-1/2 top-[40%] h-5 w-16 -translate-x-1/2 rounded-b-full border-b-[7px] border-[#172033]" />
          <div className="absolute left-[10%] top-[54%] h-20 w-[80%] rounded-[12px] bg-white/94 p-3 shadow-inner">
            <div className="mb-2 h-3 w-3/4 rounded-full bg-[#dbeafe]" />
            <div className="h-3 w-1/2 rounded-full bg-[#bbf7d0]" />
          </div>
        </div>
        <div className="absolute left-[4%] top-[43%] h-16 w-10 rotate-[-18deg] rounded-full bg-[#22c55e] shadow-[0_6px_0_#129447]" />
        <div className="absolute right-[4%] top-[43%] h-16 w-10 rotate-[18deg] rounded-full bg-[#22c55e] shadow-[0_6px_0_#129447]" />
      </div>
    </div>
  );
}

function LearningPath({ progress }: { progress: number }) {
  return (
    <div className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-extrabold uppercase text-[#22c55e]">
            Jalur misi
          </p>
          <h2 className="font-heading text-2xl font-black text-[#172033]">
            Matematika kelas 6
          </h2>
        </div>
        <span className="rounded-full bg-[#eff6ff] px-3 py-1 text-sm font-extrabold text-[#2563eb]">
          {progress}%
        </span>
      </div>

      <div className="mb-6 h-4 overflow-hidden rounded-full bg-slate-100">
        <motion.div
          animate={{ width: `${progress}%` }}
          className="h-full rounded-full bg-[#22c55e]"
          initial={{ width: 0 }}
          transition={{ duration: 0.8 }}
        />
      </div>

      <div className="space-y-4">
        {lessons.map((lesson, index) => (
          <motion.div
            animate={{ opacity: 1, x: 0 }}
            className={[
              "flex items-center gap-4 rounded-[8px] border p-4 transition",
              lesson.status === "active"
                ? "border-[#22c55e] bg-[#f0fdf4] shadow-[0_6px_0_#bbf7d0]"
                : "border-slate-200 bg-white",
              lesson.status === "locked" && "opacity-55",
            ]
              .filter(Boolean)
              .join(" ")}
            initial={{ opacity: 0, x: -16 }}
            key={lesson.title}
            transition={{ delay: index * 0.06, duration: 0.35 }}
          >
            <span
              className={[
                "grid size-12 place-items-center rounded-[8px] font-heading font-black",
                lesson.status === "done" && "bg-[#22c55e] text-white",
                lesson.status === "active" && "bg-[#f9c74f] text-[#172033]",
                lesson.status === "locked" && "bg-slate-100 text-slate-400",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {lesson.status === "done" ? <Check size={22} strokeWidth={4} /> : index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-heading text-lg font-black">
                {lesson.title}
              </p>
              <p className="text-sm font-bold text-slate-500">
                {lesson.status === "done"
                  ? `Skor ${lesson.score}%`
                  : lesson.status === "active"
                    ? "Siap dikerjakan"
                    : "Terbuka setelah misi sebelumnya"}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function AssessmentPreview({
  onChoose,
  options,
  saveState,
  selectedOption,
}: {
  onChoose: (index: number) => void;
  options: string[];
  saveState: "idle" | "saving" | "saved";
  selectedOption: number;
}) {
  return (
    <div className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-extrabold uppercase text-[#2563eb]">
            Soal 3 dari 10
          </p>
          <h2 className="font-heading text-2xl font-black text-[#172033]">
            Perbandingan
          </h2>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm font-extrabold text-slate-600">
          <Clock3 size={16} />
          09:42
        </span>
      </div>

      <div className="mb-6 h-3 overflow-hidden rounded-full bg-slate-100">
        <motion.div
          animate={{ width: "30%" }}
          className="h-full rounded-full bg-[#2563eb]"
          initial={{ width: 0 }}
          transition={{ duration: 0.7 }}
        />
      </div>

      <div className="rounded-[8px] bg-[#f8fafc] p-4">
        <p className="text-lg font-extrabold leading-8 text-[#172033]">
          Rina membeli 10 buku dan mendapat 25 stiker. Perbandingan buku dan
          stiker yang benar adalah...
        </p>
      </div>

      <div className="mt-5 grid gap-3">
        {options.map((option, index) => {
          const isSelected = selectedOption === index;

          return (
            <button
              className={[
                "group flex min-h-16 items-center gap-3 rounded-[8px] border-2 px-4 py-3 text-left font-bold transition active:translate-y-1",
                isSelected
                  ? "border-[#22c55e] bg-[#f0fdf4] shadow-[0_5px_0_#bbf7d0]"
                  : "border-slate-200 bg-white shadow-[0_5px_0_#e2e8f0] hover:-translate-y-0.5 hover:border-[#93c5fd]",
              ]
                .filter(Boolean)
                .join(" ")}
              key={option}
              onClick={() => onChoose(index)}
              type="button"
            >
              <span
                className={[
                  "grid size-9 shrink-0 place-items-center rounded-[8px] border-2 font-heading font-black",
                  isSelected
                    ? "border-[#22c55e] bg-[#22c55e] text-white"
                    : "border-slate-200 bg-slate-50 text-slate-500",
                ].join(" ")}
              >
                {String.fromCharCode(65 + index)}
              </span>
              <span>{option}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="inline-flex items-center gap-2 text-sm font-extrabold text-slate-500">
          <span
            className={[
              "size-2 rounded-full",
              saveState === "saving" ? "bg-[#f9c74f]" : "bg-[#22c55e]",
            ].join(" ")}
          />
          {saveState === "saving" ? "Menyimpan jawaban..." : "Jawaban tersimpan"}
        </span>
        <button className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#2563eb] px-5 py-3 font-heading font-black text-white shadow-[0_6px_0_#1d4ed8] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none">
          Berikutnya
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

function MobileNav() {
  return (
    <div className="fixed inset-x-3 bottom-3 z-20 rounded-[8px] border border-slate-200 bg-white/95 p-2 shadow-2xl backdrop-blur md:hidden">
      <div className="grid grid-cols-4 gap-1">
        {[
          [Home, "Home"],
          [BookOpen, "Misi"],
          [Trophy, "Hasil"],
          [Star, "Profil"],
        ].map(([Icon, label], index) => (
          <button
            className={[
              "flex flex-col items-center justify-center gap-1 rounded-[8px] px-2 py-2 text-xs font-black",
              index === 1 ? "bg-[#eff6ff] text-[#2563eb]" : "text-slate-500",
            ].join(" ")}
            key={label as string}
            type="button"
          >
            <Icon size={20} />
            {label as string}
          </button>
        ))}
      </div>
    </div>
  );
}
