"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Check, GraduationCap, Loader2, School as SchoolIcon, Search, Sparkles } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { careerPaths, CareerPathId } from "@/lib/career-paths";
import { SchoolSearchResult } from "@/lib/types";
import { StudentShell } from "../_components/student-shell";

const grades = [10, 11, 12];
type Step = "path" | "grade" | "school";
const stepOrder: Step[] = ["path", "grade", "school"];

export default function StudentOnboardingPage() {
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
      <StudentOnboardingContent />
    </Suspense>
  );
}

function StudentOnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialStep = (searchParams.get("step") as Step | null) ?? "path";
  const [step, setStep] = useState<Step>(
    stepOrder.includes(initialStep) ? initialStep : "path",
  );

  const [selectedPath, setSelectedPath] = useState<CareerPathId | null>(null);
  const [savingPath, setSavingPath] = useState(false);

  const [gradeLevel, setGradeLevel] = useState<number | null>(null);
  const [savingGrade, setSavingGrade] = useState(false);

  const [search, setSearch] = useState("");
  const [schools, setSchools] = useState<SchoolSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [linking, setLinking] = useState<string | null>(null);

  useEffect(() => {
    if (step !== "school") return;
    setSearching(true);
    const timeout = setTimeout(() => {
      apiFetch<SchoolSearchResult[]>("/student/account/schools", {
        query: { search: search || undefined },
      })
        .then(({ data }) => setSchools(data))
        .catch(() => setSchools([]))
        .finally(() => setSearching(false));
    }, 300);

    return () => clearTimeout(timeout);
  }, [step, search]);

  async function handleSelectPath(id: CareerPathId) {
    setSelectedPath(id);
    setSavingPath(true);
    try {
      await apiFetch("/student/account/profile", {
        method: "PATCH",
        body: { careerPath: id },
      });
      setStep("grade");
    } finally {
      setSavingPath(false);
    }
  }

  async function handleSelectGrade(value: number) {
    setGradeLevel(value);
    setSavingGrade(true);
    try {
      await apiFetch("/student/account/profile", {
        method: "PATCH",
        body: { gradeLevel: value },
      });
      setStep("school");
    } finally {
      setSavingGrade(false);
    }
  }

  async function handleLinkSchool(schoolId: string) {
    setLinking(schoolId);
    try {
      await apiFetch("/student/account/school-link", {
        method: "POST",
        body: { schoolId },
      });
      router.push("/student/dashboard");
    } catch {
      setLinking(null);
    }
  }

  const stepIndex = stepOrder.indexOf(step) + 1;
  const stepTitle =
    step === "path"
      ? "Mau jadi apa kamu?"
      : step === "grade"
        ? "Kamu kelas berapa?"
        : "Hubungkan ke sekolah?";

  return (
    <StudentShell>
      <section className="relative mx-auto max-w-2xl overflow-hidden px-4 py-8 sm:px-6">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 right-0 size-72 rounded-full bg-[#8b5cf6]/15 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 left-0 size-72 rounded-full bg-[#22c55e]/10 blur-3xl"
        />

        <div className="relative mb-6 text-center">
          <p className="text-sm font-black uppercase text-[#6d28d9]">
            Langkah {stepIndex} dari {stepOrder.length}
          </p>
          <h1 className="font-heading mt-2 text-3xl font-black">{stepTitle}</h1>
        </div>

        <AnimatePresence mode="wait">
          {step === "path" ? (
            <motion.div
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              key="path"
            >
              <p className="mb-6 text-center font-bold text-slate-500">
                Pilih jalur cita-citamu - misimu akan dibungkus jadi cerita
                seru sesuai pilihanmu.
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                {careerPaths.map((path, index) => {
                  const isSelected = selectedPath === path.id;
                  return (
                    <motion.button
                      animate={{ opacity: 1, y: 0 }}
                      className="group relative flex flex-col items-center gap-3 overflow-hidden rounded-[8px] p-6 text-center shadow-lg transition disabled:opacity-70"
                      disabled={savingPath}
                      initial={{ opacity: 0, y: 24 }}
                      key={path.id}
                      onClick={() => handleSelectPath(path.id)}
                      style={{
                        background: path.gradient,
                        boxShadow: isSelected
                          ? `0 0 0 3px white, 0 0 0 6px ${path.shadowColor}, 0 12px 0 ${path.shadowColor}`
                          : `0 10px 0 ${path.shadowColor}`,
                      }}
                      transition={{ delay: index * 0.08, type: "spring", stiffness: 220, damping: 20 }}
                      type="button"
                      whileHover={{ y: -4, scale: 1.02 }}
                      whileTap={{ y: 2, scale: 0.99 }}
                    >
                      {isSelected ? (
                        <span className="absolute right-3 top-3 grid size-6 place-items-center rounded-full bg-white text-[#16a34a]">
                          {savingPath ? (
                            <Loader2 className="animate-spin" size={14} />
                          ) : (
                            <Check size={14} strokeWidth={3} />
                          )}
                        </span>
                      ) : null}
                      <span className="text-5xl drop-shadow-sm">{path.emoji}</span>
                      <span className="font-heading text-lg font-black text-white">
                        {path.title}
                      </span>
                      <span className="text-xs font-bold leading-5 text-white/80">
                        {path.tagline}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              <button
                className="mt-6 w-full rounded-[8px] bg-slate-100 px-5 py-4 font-heading font-black text-slate-600 transition hover:bg-slate-200"
                onClick={() => setStep("grade")}
                type="button"
              >
                Lewati dulu
              </button>
            </motion.div>
          ) : step === "grade" ? (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0, y: 16 }}
              key="grade"
            >
              <p className="mb-5 text-center font-bold text-slate-500">
                Ini membantu kami memilihkan misi yang sesuai untukmu.
              </p>
              <div className="grid grid-cols-3 gap-3">
                {grades.map((grade) => (
                  <button
                    className="flex flex-col items-center gap-2 rounded-[8px] border-2 border-slate-200 px-4 py-6 font-heading text-2xl font-black text-slate-700 transition hover:-translate-y-0.5 hover:border-[#6d28d9] disabled:opacity-60"
                    disabled={savingGrade}
                    key={grade}
                    onClick={() => handleSelectGrade(grade)}
                    type="button"
                  >
                    <GraduationCap className="text-[#6d28d9]" size={28} />
                    {grade}
                    {savingGrade && gradeLevel === grade ? (
                      <Loader2 className="animate-spin text-[#6d28d9]" size={16} />
                    ) : null}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0, y: 16 }}
              key="school"
            >
              <p className="mb-4 text-center font-bold text-slate-500">
                Opsional - kamu tetap bisa belajar tanpa sekolah, dan bisa
                menghubungkan akun kapan pun lewat halaman profil.
              </p>
              <div className="flex items-center gap-3 rounded-[8px] border-2 border-slate-200 px-4 py-3 shadow-[0_4px_0_#e2e8f0]">
                <Search className="text-slate-400" size={20} />
                <input
                  className="w-full border-0 bg-transparent font-bold outline-none"
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Cari nama sekolah atau kota"
                  value={search}
                />
              </div>

              <div className="mt-4 space-y-2">
                {searching ? (
                  <div className="grid place-items-center py-6">
                    <Loader2 className="animate-spin text-slate-400" size={22} />
                  </div>
                ) : schools.length === 0 ? (
                  <p className="py-4 text-center text-sm font-bold text-slate-400">
                    {search ? "Sekolah tidak ditemukan." : "Ketik untuk mencari sekolah."}
                  </p>
                ) : (
                  schools.map((school) => (
                    <button
                      className="flex w-full items-center justify-between gap-3 rounded-[8px] border-2 border-slate-200 px-4 py-3 text-left font-bold text-slate-700 transition hover:border-[#6d28d9] disabled:opacity-60"
                      disabled={linking !== null}
                      key={school.id}
                      onClick={() => handleLinkSchool(school.id)}
                      type="button"
                    >
                      <span className="flex items-center gap-3">
                        <SchoolIcon className="text-[#6d28d9]" size={20} />
                        <span>
                          {school.name}
                          <span className="block text-xs font-bold text-slate-400">
                            {school.city}, {school.province}
                          </span>
                        </span>
                      </span>
                      {linking === school.id ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : (
                        <ArrowRight size={18} />
                      )}
                    </button>
                  ))
                )}
              </div>

              <button
                className="mt-5 w-full rounded-[8px] bg-slate-100 px-5 py-4 font-heading font-black text-slate-600 transition hover:bg-slate-200"
                onClick={() => router.push("/student/dashboard")}
                type="button"
              >
                Lewati dulu
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {step !== "path" ? (
          <p className="relative mt-6 flex items-center justify-center gap-1 text-center text-xs font-bold text-slate-400">
            <Sparkles size={14} />
            Kamu bisa ubah semua pilihan ini kapan saja lewat halaman profil.
          </p>
        ) : null}
      </section>
    </StudentShell>
  );
}
