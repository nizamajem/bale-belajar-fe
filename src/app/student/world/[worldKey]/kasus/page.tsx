"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { BookOpen, Loader2, Search, ShieldQuestion, Sparkles, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import {
  CaseConfidenceDeclaration,
  CaseSubmitResult,
  confidenceDeclarationLabel,
  CurrentCase,
  evidenceRelevanceLabel,
} from "@/lib/types";
import { StudentShell } from "../../../_components/student-shell";
import { LoadingEvidence, MentorDialogue } from "../../../_components/motion-kit";

const CONFIDENCE_OPTIONS: CaseConfidenceDeclaration[] = [
  "HIGH",
  "MEDIUM",
  "LOW",
  "INSUFFICIENT_EVIDENCE",
];

const EVIDENCE_ICON: Record<string, string> = {
  DOCUMENT: "/detective/evidence-document.svg",
  LOG: "/detective/evidence-log.svg",
  STATEMENT: "/detective/evidence-statement.svg",
  PHOTO_DESC: "/detective/evidence-photo.svg",
  MESSAGE: "/detective/evidence-message.svg",
};

const EVIDENCE_TYPE_LABEL: Record<string, string> = {
  DOCUMENT: "Dokumen",
  LOG: "Log",
  STATEMENT: "Pernyataan",
  PHOTO_DESC: "Foto",
  MESSAGE: "Pesan",
};

export default function CaseRunnerPage() {
  const params = useParams<{ worldKey: string }>();
  const router = useRouter();
  const worldKey = params.worldKey;

  const [currentCase, setCurrentCase] = useState<CurrentCase | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [conclusionText, setConclusionText] = useState("");
  const [confidenceLevel, setConfidenceLevel] = useState<CaseConfidenceDeclaration | null>(null);
  const [phase, setPhase] = useState<"learn" | "case-study" | "example" | "test">("learn");
  const [mentorHint, setMentorHint] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<CaseSubmitResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const { data: current } = await apiFetch<CurrentCase>("/student/cases/current", {
          query: { worldKey },
        });

        if (current.attempt?.status === "SUBMITTED") {
          router.replace(`/student/world/${worldKey}/kasus/hasil`);
          return;
        }

        let active = current;
        if (!active.attempt) {
          await apiFetch(`/student/cases/${active.assignmentId}/start`, { method: "POST" });
          const { data: refreshed } = await apiFetch<CurrentCase>("/student/cases/current", {
            query: { worldKey },
          });
          active = refreshed;
        }

        if (cancelled) return;
        setCurrentCase(active);
        setAnswers(
          Object.fromEntries(active.questions.map((question) => [question.id, question.answerText ?? ""])),
        );
      } catch {
        if (!cancelled) setError("Kasus belum bisa dibuka. Coba lagi sebentar.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [worldKey, router]);

  function saveAnswer(questionId: string, text: string) {
    if (!currentCase?.attempt) return;
    apiFetch(`/student/case-attempts/${currentCase.attempt.id}/answers/${questionId}`, {
      method: "PUT",
      body: { answerText: text },
    }).catch(() => {
      // Autosave gagal secara diam-diam; siswa masih bisa melanjutkan dan submit ulang.
    });
  }

  async function handleSubmit() {
    if (!currentCase?.attempt || !confidenceLevel || !conclusionText.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const { data } = await apiFetch<CaseSubmitResult>(
        `/student/case-attempts/${currentCase.attempt.id}/submit`,
        { method: "POST", body: { conclusionText, confidenceLevel } },
      );
      setResult(data);
    } catch {
      setError("Kasus gagal disubmit. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <StudentShell>
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
          <LoadingEvidence label="Menyiapkan bukti dan pertanyaan..." />
        </div>
      </StudentShell>
    );
  }

  if (error && !currentCase) {
    return (
      <StudentShell>
        <section className="mx-auto max-w-3xl px-4 py-10 text-center sm:px-6">
          <div className="rounded-[8px] border border-slate-200 bg-white p-8 shadow-sm">
            <Search className="mx-auto text-[#6d28d9]" size={34} />
            <p className="mt-4 font-heading text-2xl font-black">Papan bukti belum siap.</p>
            <p className="mt-2 font-bold leading-7 text-slate-500">
              {error} Progresmu tetap aman.
            </p>
            <Link
              className="mt-5 inline-flex rounded-[8px] bg-[#2563eb] px-5 py-4 font-heading font-black text-white shadow-[0_6px_0_#1e40af]"
              href={`/student/world/${worldKey}`}
            >
              Kembali ke dunia
            </Link>
          </div>
        </section>
      </StudentShell>
    );
  }

  if (!currentCase) return null;

  if (result) {
    return (
      <StudentShell>
        <section className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:py-8">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[8px] bg-[#22c55e] p-6 text-white shadow-[0_10px_0_#129447]"
            initial={{ opacity: 0, y: 16 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-white/18 px-3 py-2 text-sm font-black">
              <Trophy size={17} />
              Kasus selesai!
            </span>
            <h1 className="font-heading mt-4 text-3xl font-black">Skor {Math.round(result.overallScore)}</h1>
            <p className="mt-2 font-bold text-white/90">+{result.xpGained} XP diperoleh</p>
            {result.gameProfile.accountLeveledUp ? (
              <p className="mt-1 font-black text-white">
                Naik level ke {result.gameProfile.accountLevel}!
              </p>
            ) : null}
          </motion.div>

          <div className="mt-5 space-y-3">
            {result.questions.map((question, index) => (
              <div className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm" key={question.questionId}>
                <div className="flex items-center justify-between gap-2">
                  <p className="font-heading font-black">
                    {index + 1}. {question.prompt}
                  </p>
                  <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                    {Math.round(question.score)}
                  </span>
                </div>
                {question.expectedReasoning ? (
                  <p className="mt-2 text-sm font-bold leading-6 text-slate-600">
                    {question.expectedReasoning}
                  </p>
                ) : null}
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              className="inline-flex items-center gap-2 rounded-[8px] bg-[#2563eb] px-5 py-4 font-heading font-black text-white shadow-[0_6px_0_#1e40af] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
              href={`/student/growth-map?worldKey=${worldKey}`}
            >
              Lihat kemampuanku
            </Link>
            <Link
              className="inline-flex items-center gap-2 rounded-[8px] border-2 border-slate-200 bg-white px-5 py-4 font-heading font-black text-slate-700 shadow-[0_6px_0_#d8e2ef] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
              href={`/student/world/${worldKey}`}
            >
              Kembali ke dunia
            </Link>
          </div>
        </section>
      </StudentShell>
    );
  }

  const canSubmit = Boolean(confidenceLevel) && conclusionText.trim().length > 0 && !submitting;

  return (
    <StudentShell>
      <section className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:py-8">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[8px] bg-[#6d28d9] p-5 text-white shadow-[0_10px_0_#4c1d95]"
          initial={{ opacity: 0, y: 16 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white/18 px-3 py-2 text-sm font-black">
            <Sparkles size={17} />
            {currentCase.case.title}
          </span>
          <p className="mt-3 font-bold leading-6 text-white/90">{currentCase.case.openingStory}</p>
          <div className="mt-4">
            <MentorDialogue>
              Hubungkan bukti dengan hati-hati. Jika informasinya belum cukup, tulis apa yang masih perlu diverifikasi.
            </MentorDialogue>
          </div>
        </motion.div>

        {error ? (
          <p className="mt-4 rounded-[8px] border border-[#fed7aa] bg-[#fff7ed] p-3 text-sm font-bold text-[#c2410c]">
            {error} Coba kirim ulang saat koneksi stabil.
          </p>
        ) : null}

        {phase !== "test" ? (
          <div className="mt-6 rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
            {phase === "learn" ? (
              <>
                <p className="text-sm font-black uppercase text-[#6d28d9]">1. Materi</p>
                <h2 className="font-heading mt-1 text-2xl font-black">
                  {currentCase.lessonPlan?.title ?? "Baca bukti dengan teliti"}
                </h2>
                <p className="mt-2 font-bold leading-6 text-slate-600">
                  {currentCase.lessonPlan?.simpleGoal ??
                    "Sebelum menjawab, pahami dulu mana fakta, asumsi, dan petunjuk pengecoh."}
                </p>
                {currentCase.lessonPlan?.bigIdea ? (
                  <div className="mt-4 rounded-[8px] border border-[#ddd6fe] bg-[#f5f3ff] p-4">
                    <p className="text-xs font-black uppercase text-[#6d28d9]">Ide utama</p>
                    <p className="mt-1 text-sm font-bold leading-6 text-[#5b21b6]">
                      {currentCase.lessonPlan.bigIdea}
                    </p>
                  </div>
                ) : null}
                <div className="mt-4 grid gap-3">
                  {(currentCase.lessonPlan?.learnSteps ?? []).map((step, index) => (
                    <div className="rounded-[8px] bg-[#f8fafc] p-4" key={step.title}>
                      <p className="font-heading font-black">
                        {index + 1}. {step.title}
                      </p>
                      <p className="mt-1 text-sm font-bold leading-6 text-slate-600">{step.body}</p>
                      {step.example ? (
                        <p className="mt-2 rounded-[8px] bg-white p-3 text-sm font-bold leading-6 text-slate-500">
                          Contoh: {step.example}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
                {currentCase.lessonPlan?.professionalHabits?.length ? (
                  <div className="mt-4 rounded-[8px] bg-[#ecfeff] p-4">
                    <p className="font-heading font-black text-[#155e75]">Kebiasaan detektif profesional</p>
                    <ul className="mt-2 space-y-2">
                      {currentCase.lessonPlan.professionalHabits.map((habit) => (
                        <li className="flex gap-2 text-sm font-bold leading-5 text-[#155e75]" key={habit}>
                          <span className="mt-1 size-2 shrink-0 rounded-full bg-[#06b6d4]" />
                          <span>{habit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                <button
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#6d28d9] px-5 py-4 font-heading font-black text-white shadow-[0_6px_0_#4c1d95] sm:w-auto"
                  onClick={() => setPhase("case-study")}
                  type="button"
                >
                  Lanjut ke cerita kasus
                </button>
              </>
            ) : phase === "case-study" ? (
              <>
                <p className="text-sm font-black uppercase text-[#6d28d9]">2. Cerita kasus</p>
                <h2 className="font-heading mt-1 text-2xl font-black">Latih cara membaca bukti</h2>
                <p className="mt-2 font-bold leading-6 text-slate-600">
                  Baca contoh ini pelan-pelan. Perhatikan mana fakta kuat, mana dugaan, dan mana yang belum cukup bukti.
                </p>
                <div className="mt-4 space-y-4">
                  {(currentCase.lessonPlan?.caseStudies ?? []).map((study) => (
                    <div className="rounded-[8px] border border-slate-200 bg-[#f8fafc] p-4" key={study.title}>
                      <p className="font-heading text-lg font-black">{study.title}</p>
                      <p className="mt-2 text-sm font-bold leading-6 text-slate-700">{study.story}</p>
                      <div className="mt-3 rounded-[8px] bg-white p-3">
                        <p className="text-xs font-black uppercase text-[#22c55e]">Cara analisis</p>
                        <ul className="mt-2 space-y-2">
                          {study.analysisSteps.map((step) => (
                            <li className="flex gap-2 text-sm font-bold leading-5 text-slate-600" key={step}>
                              <span className="mt-1 size-2 shrink-0 rounded-full bg-[#22c55e]" />
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <p className="mt-3 rounded-[8px] bg-[#fff7ed] p-3 text-sm font-bold leading-6 text-[#c2410c]">
                        Kesalahan umum: {study.commonMistake}
                      </p>
                    </div>
                  ))}
                </div>
                <button
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#6d28d9] px-5 py-4 font-heading font-black text-white shadow-[0_6px_0_#4c1d95] sm:w-auto"
                  onClick={() => setPhase("example")}
                  type="button"
                >
                  Lihat Contoh Jawaban Lengkap
                </button>
              </>
            ) : (
              <>
                <p className="text-sm font-black uppercase text-[#6d28d9]">3. Contoh</p>
                <h2 className="font-heading mt-1 text-2xl font-black">Cara berpikir detektif</h2>
                <div className="mt-4 rounded-[8px] bg-[#f8fafc] p-4">
                  <p className="text-xs font-black uppercase text-slate-400">Kasus contoh</p>
                  <p className="mt-2 font-bold leading-6 text-slate-700">
                    {currentCase.lessonPlan?.exampleCase.story}
                  </p>
                </div>
                <div className="mt-3 rounded-[8px] border border-[#bbf7d0] bg-[#f0fdf4] p-4">
                  <p className="text-xs font-black uppercase text-[#15803d]">Jawaban bagus</p>
                  <p className="mt-2 font-bold leading-6 text-[#166534]">
                    {currentCase.lessonPlan?.exampleCase.goodAnswer}
                  </p>
                </div>
                {currentCase.lessonPlan?.exampleCase.answerFormula ? (
                  <div className="mt-3 rounded-[8px] border border-[#bfdbfe] bg-[#eff6ff] p-4">
                    <p className="text-xs font-black uppercase text-[#2563eb]">Rumus jawaban</p>
                    <p className="mt-2 font-heading text-lg font-black text-[#1e40af]">
                      {currentCase.lessonPlan.exampleCase.answerFormula}
                    </p>
                  </div>
                ) : null}
                {currentCase.lessonPlan?.exampleCase.badAnswer ? (
                  <div className="mt-3 rounded-[8px] border border-[#fecaca] bg-[#fef2f2] p-4">
                    <p className="text-xs font-black uppercase text-[#dc2626]">Contoh yang perlu dihindari</p>
                    <p className="mt-2 text-sm font-bold leading-6 text-[#991b1b]">
                      {currentCase.lessonPlan.exampleCase.badAnswer}
                    </p>
                  </div>
                ) : null}
                {currentCase.lessonPlan?.investigationChecklist?.length ? (
                  <div className="mt-3 rounded-[8px] bg-[#f8fafc] p-4">
                    <p className="font-heading font-black">Checklist sebelum tes</p>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      {currentCase.lessonPlan.investigationChecklist.map((item) => (
                        <p className="rounded-[8px] bg-white p-3 text-sm font-bold leading-5 text-slate-600" key={item}>
                          {item}
                        </p>
                      ))}
                    </div>
                  </div>
                ) : null}
                {currentCase.lessonPlan?.testRubric?.length ? (
                  <div className="mt-3 rounded-[8px] bg-[#f0fdf4] p-4">
                    <p className="font-heading font-black text-[#166534]">Jawabanmu dinilai dari</p>
                    <ul className="mt-2 space-y-2">
                      {currentCase.lessonPlan.testRubric.map((item) => (
                        <li className="flex gap-2 text-sm font-bold leading-5 text-[#166534]" key={item}>
                          <span className="mt-1 size-2 shrink-0 rounded-full bg-[#22c55e]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                <button
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#22c55e] px-5 py-4 font-heading font-black text-white shadow-[0_6px_0_#129447] sm:w-auto"
                  onClick={() => setPhase("test")}
                  type="button"
                >
                  Mulai Tes
                </button>
              </>
            )}
          </div>
        ) : null}

        {phase === "test" ? (
          <>

        <div className="mt-6 rounded-[8px] border border-[#bfdbfe] bg-[#eff6ff] p-4">
          <p className="font-heading font-black text-[#1e40af]">Petunjuk aman</p>
          <p className="mt-1 text-sm font-bold leading-6 text-[#1d4ed8]">
            {[
              "Mulai dari bukti yang waktunya paling jelas. Jangan pilih jawaban karena terasa mencurigakan.",
              "Pisahkan dulu: fakta kuat, fakta sebagian, dan dugaan. Setelah itu baru tulis kesimpulan.",
              "Kalau belum cukup bukti, tulis 'belum cukup bukti' dan jelaskan data apa yang masih perlu dicek.",
            ][mentorHint]}
          </p>
          <button
            className="mt-3 rounded-[8px] bg-white px-4 py-2 font-heading font-black text-[#2563eb] shadow-sm"
            onClick={() => setMentorHint((current) => (current + 1) % 3)}
            type="button"
          >
            Petunjuk berikutnya
          </button>
        </div>

        <div className="mt-6 flex items-center gap-2">
          <Search className="text-[#6d28d9]" size={20} />
          <h2 className="font-heading text-xl font-black">Papan Bukti</h2>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {currentCase.evidence.map((item, index) => (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="interactive-card group rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm"
              initial={{ opacity: 0, y: 16 }}
              key={item.id}
              transition={{ delay: index * 0.04 }}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 rounded-full bg-[#ede9fe] py-1 pl-1 pr-3 text-xs font-black text-[#6d28d9] transition group-hover:bg-[#f5f3ff]">
                  <img
                    alt=""
                    className="size-6 rounded-full"
                    src={EVIDENCE_ICON[item.type] ?? EVIDENCE_ICON.DOCUMENT}
                  />
                  Bukti {item.orderNumber} - {EVIDENCE_TYPE_LABEL[item.type] ?? item.type}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">
                  {evidenceRelevanceLabel(item.relevance)}
                </span>
              </div>
              <p className="mt-3 font-bold leading-6 text-slate-700">{item.content}</p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={[
                    "progress-reveal h-full rounded-full",
                    item.relevance === "RELEVANT"
                      ? "bg-[#22c55e]"
                      : item.relevance === "PARTIAL"
                        ? "bg-[#f9c74f]"
                        : "bg-slate-300",
                  ].join(" ")}
                  style={{ "--progress-width": item.relevance === "RELEVANT" ? "88%" : item.relevance === "PARTIAL" ? "58%" : "30%" } as React.CSSProperties}
                />
              </div>
              <p className="mt-2 text-xs font-bold text-slate-400">
                Baca detail sebelum menarik kesimpulan.
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 flex items-center gap-2">
          <ShieldQuestion className="text-[#6d28d9]" size={20} />
          <h2 className="font-heading text-xl font-black">Pertanyaan Penalaran</h2>
        </div>
        <div className="mt-3 space-y-4">
          {currentCase.questions.map((question, index) => (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm"
              initial={{ opacity: 0, y: 16 }}
              key={question.id}
              transition={{ delay: index * 0.05 }}
            >
              <p className="font-heading text-lg font-black">
                {index + 1}. {question.prompt}
              </p>
              <p className="mt-1 text-xs font-black uppercase text-slate-400">
                Kemampuan: {question.skill.name}
              </p>
              <textarea
                className="mt-3 w-full rounded-[8px] border-2 border-slate-200 p-3 font-bold text-slate-700 outline-none transition focus:border-[#6d28d9] focus:ring-4 focus:ring-[#ddd6fe]"
                onBlur={(event) => saveAnswer(question.id, event.target.value)}
                onChange={(event) =>
                  setAnswers((prev) => ({ ...prev, [question.id]: event.target.value }))
                }
                placeholder="Tulis alasanmu di sini. Mulai dari bukti yang paling kuat."
                rows={3}
                value={answers[question.id] ?? ""}
              />
            </motion.div>
          ))}
        </div>

        <div className="mt-8 rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <BookOpen className="text-[#6d28d9]" size={20} />
            <h2 className="font-heading text-xl font-black">Kesimpulan Detektif</h2>
          </div>
          <textarea
            className="mt-3 w-full rounded-[8px] border-2 border-slate-200 p-3 font-bold text-slate-700 outline-none transition focus:border-[#6d28d9] focus:ring-4 focus:ring-[#ddd6fe]"
            onChange={(event) => setConclusionText(event.target.value)}
            placeholder="Apa kesimpulanmu dari kasus ini?"
            rows={4}
            value={conclusionText}
          />

          <p className="mt-4 text-sm font-black uppercase text-slate-500">Seberapa yakin?</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {CONFIDENCE_OPTIONS.map((option) => {
              const selected = confidenceLevel === option;
              return (
                <button
                  className={[
                    "min-h-12 rounded-[8px] border-2 px-4 py-3 text-left font-bold transition focus:outline-none focus:ring-4 focus:ring-[#ddd6fe]",
                    selected
                      ? "border-[#6d28d9] bg-[#f5f3ff] text-[#4c1d95]"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300",
                  ].join(" ")}
                  key={option}
                  onClick={() => setConfidenceLevel(option)}
                  type="button"
                >
                  {confidenceDeclarationLabel(option)}
                </button>
              );
            })}
          </div>
        </div>

        <button
          className="light-trail mt-6 inline-flex items-center gap-2 rounded-[8px] bg-[#22c55e] px-6 py-4 font-heading font-black text-white shadow-[0_6px_0_#129447] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none disabled:opacity-60"
          disabled={!canSubmit}
          onClick={handleSubmit}
          type="button"
        >
          {submitting ? <Loader2 className="animate-spin" size={18} /> : null}
          Kirim jawaban kasus
        </button>
          </>
        ) : null}
      </section>
    </StudentShell>
  );
}
