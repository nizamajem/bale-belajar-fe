"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { HumanHelpRecommendationCard } from "@/features/baleverse/components/ai/human-help-recommendation-card";
import { TanyaBalePanel } from "@/features/baleverse/components/ai/tanya-bale-panel";
import { BaleHero } from "@/features/baleverse/components/dashboard/bale-hero";
import { BaleverseDashboard } from "@/features/baleverse/components/dashboard/baleverse-dashboard";
import { MentorCard } from "@/features/baleverse/components/learning-circle/mentor-card";
import { MentorFeedbackCard } from "@/features/baleverse/components/learning-circle/mentor-feedback-card";
import { ParentSupportCard } from "@/features/baleverse/components/learning-circle/parent-support-card";
import { MissionReward } from "@/features/baleverse/components/mission/mission-reward";
import { learningCircleDummyData } from "@/features/baleverse/data/learning-circle-dummy-data";
import { MissionShell } from "@/features/baleverse/components/mission/mission-shell";
import { getBaleverseSnapshot, requestMentorHelp } from "@/features/baleverse/services/mock-baleverse-service";
import { initialDashboardState, transitionDashboard } from "@/features/baleverse/state/dashboard-state-machine";
import { transitionHandoff } from "@/features/baleverse/state/ai-human-handoff-state-machine";
import { AiConfidence, BaleMission, BaleUser, BaleWorld, HandoffStatus, HumanHelpRecommendation, MentorFeedback, MentorQueueItem, ParentSupportRequest } from "@/features/baleverse/types";

type Snapshot = {
  user: BaleUser;
  worlds: BaleWorld[];
  activeMission: BaleMission;
};

export default function BaleverseSlicePage() {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [state, setState] = useState(initialDashboardState);
  const [handoffStatus, setHandoffStatus] = useState<HandoffStatus>("idle");
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | undefined>();
  const [humanHelp, setHumanHelp] = useState<HumanHelpRecommendation | null>(null);
  const [mentorQueueItem, setMentorQueueItem] = useState<MentorQueueItem | null>(null);
  const [mentorFeedback, setMentorFeedback] = useState<MentorFeedback | null>(null);
  const [parentRequest, setParentRequest] = useState<ParentSupportRequest | null>(null);
  const [parentSupportSent, setParentSupportSent] = useState(false);
  const [selectedContext, setSelectedContext] = useState<string[]>([]);
  const [selectedParentContext, setSelectedParentContext] = useState<string[]>([]);
  const [submittingHelp, setSubmittingHelp] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getBaleverseSnapshot()
      .then((data) => {
        if (cancelled) return;
        setSnapshot({ user: data.user, worlds: data.worlds, activeMission: data.activeMission });
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const missionHint = useMemo(() => {
    if (!snapshot) return "";
    if (state.step === "hintOne") return snapshot.activeMission.hints[0];
    if (state.step === "hintTwo") return snapshot.activeMission.hints[1];
    if (state.step === "humanHelp" || state.step === "consent") return snapshot.activeMission.hints[2];
    return "Pilih jawaban dulu. Aku akan memberi petunjuk bertahap setelah kamu mencoba.";
  }, [snapshot, state.step]);

  const confidence: AiConfidence = state.step === "humanHelp" || state.step === "consent" || state.step === "waitingMentor" ? "low" : state.step === "hintTwo" ? "medium" : "high";

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center px-4">
        <div className="flex items-center gap-3 rounded-[8px] bg-white p-5 font-heading font-black shadow-sm">
          <Loader2 className="animate-spin text-[#2563eb]" size={22} />
          Menyiapkan BaleVerse...
        </div>
      </main>
    );
  }

  if (loadError || !snapshot) {
    return (
      <main className="grid min-h-screen place-items-center px-4">
        <section className="max-w-md rounded-[8px] border border-[#fed7aa] bg-[#fff7ed] p-5 text-[#c2410c]">
          <h1 className="font-heading text-xl font-black">BaleVerse belum bisa dibuka.</h1>
          <p className="mt-2 font-bold leading-6">State error tersedia. Coba muat ulang ketika koneksi stabil.</p>
        </section>
      </main>
    );
  }

  function handleWrongAnswer() {
    if (!snapshot) return;
    const selected = snapshot.activeMission.options.find((option) => option.id === selectedAnswer);
    if (selected?.correct) {
      setFeedback(selected.feedback);
      setState(transitionDashboard(state, { type: "ANSWER_CORRECT" }));
      return;
    }
    setFeedback(selected?.feedback ?? "Coba pilih satu jawaban dulu.");
    const nextState = transitionDashboard(state, { type: "ANSWER_WRONG" });
    setState(nextState);
    if (nextState.step === "humanHelp") {
      setHandoffStatus(transitionHandoff(handoffStatus, "RECOMMEND"));
      void requestMentorHelp().then((data) => {
        setHumanHelp(data.recommendation);
        setSelectedContext(data.recommendation.shareableContext);
      });
    }
  }

  async function approveMentorHelp() {
    setSubmittingHelp(true);
    const data = await requestMentorHelp();
    setHumanHelp(data.recommendation);
    setMentorQueueItem(data.queueItem);
    setHandoffStatus(transitionHandoff("reviewingConsent", "APPROVE"));
    setState(transitionDashboard(state, { type: "SUBMIT_HANDOFF" }));
    setParentRequest(learningCircleDummyData.parentSupportRequest as ParentSupportRequest);
    setSelectedParentContext(learningCircleDummyData.parentSupportRequest.shareableContext);
    setSubmittingHelp(false);
  }

  function toggleContext(item: string) {
    setSelectedContext((current) => current.includes(item) ? current.filter((entry) => entry !== item) : [...current, item]);
  }

  function toggleParentContext(item: string) {
    setSelectedParentContext((current) => current.includes(item) ? current.filter((entry) => entry !== item) : [...current, item]);
  }

  if (state.step === "login") {
    return (
      <main className="flex min-h-screen items-center px-4 py-6 sm:px-6">
        <motion.section
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-xl lg:grid-cols-[0.9fr_1.1fr]"
          initial={{ opacity: 0, y: 8 }}
        >
          <div className="bg-[#172033] p-6 text-white sm:p-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs font-black uppercase text-[#f9c74f]">
              <Sparkles size={15} /> Demo vertical slice
            </span>
            <h1 className="font-heading mt-5 text-4xl font-black leading-tight">Masuk ke BaleVerse</h1>
            <p className="mt-3 max-w-md font-bold leading-7 text-white/75">
              Flow ini memakai dummy data: login siswa, dashboard, Numeria, misi, Tanya Bale, dan handoff mentor.
            </p>
          </div>
          <div className="p-6 sm:p-8">
            <div className="rounded-[8px] bg-[#f8fafc] p-4">
              <p className="text-xs font-black uppercase text-slate-400">Akun demo</p>
              <p className="font-heading mt-1 text-2xl font-black text-[#172033]">{snapshot.user.name}</p>
              <p className="mt-2 text-sm font-bold leading-6 text-slate-600">Siswa SMA yang sedang mengejar mastery Matematika 62%.</p>
            </div>
            <button
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#22c55e] px-5 py-4 font-heading font-black text-white shadow-[0_6px_0_#129447] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none sm:w-auto"
              onClick={() => setState(transitionDashboard(state, { type: "LOGIN" }))}
              type="button"
            >
              Masuk sebagai siswa
              <ArrowRight size={19} />
            </button>
            <p className="mt-4 flex gap-2 text-sm font-bold leading-6 text-slate-500">
              <ShieldCheck className="mt-0.5 shrink-0 text-[#22c55e]" size={18} />
              Tidak ada data asli atau backend yang dipakai pada slice ini.
            </p>
          </div>
        </motion.section>
      </main>
    );
  }

  if (state.step === "dashboard") {
    return (
      <BaleverseDashboard
        activeMission={snapshot.activeMission}
        onSelectWorld={(world) => setState(transitionDashboard(state, { type: "SELECT_WORLD", world }))}
        onStartMission={() => setState(transitionDashboard(state, { type: "START_MISSION" }))}
        selectedWorld={state.selectedWorld}
        user={snapshot.user}
        worlds={snapshot.worlds}
      />
    );
  }

  if (state.step === "missionIntro") {
    return (
      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <BaleHero state="encouraging" />
        <section className="mt-4 rounded-[8px] bg-[#172033] p-5 text-white shadow-[0_8px_0_#020617]">
          <p className="text-xs font-black uppercase text-[#f9c74f]">Cerita pembuka</p>
          <h1 className="font-heading mt-2 text-3xl font-black">{snapshot.activeMission.title}</h1>
          <p className="mt-3 font-bold leading-7 text-white/78">{snapshot.activeMission.story}</p>
          <button className="mt-5 rounded-[8px] bg-[#22c55e] px-5 py-4 font-heading font-black text-white shadow-[0_6px_0_#129447]" onClick={() => setState({ ...state, step: "question" })} type="button">
            Mulai Misi
          </button>
        </section>
      </main>
    );
  }

  if (state.step === "waitingMentor" && mentorQueueItem) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <BaleHero state="waiting" />
        <div className="mt-4">
          <MentorCard item={mentorQueueItem} />
        </div>
        <div className="mt-4">
          {parentSupportSent ? (
            <ParentSupportCard message="Ibu Rina mengirim dukungan: istirahat sebentar boleh, lalu coba contoh ringan selama 5 menit." />
          ) : (
            <ParentSupportCard
              onSend={() => setParentSupportSent(true)}
              onToggleContext={toggleParentContext}
              request={parentRequest ?? undefined}
              selectedContext={selectedParentContext}
            />
          )}
        </div>
        {mentorFeedback ? (
          <div className="mt-4">
            <MentorFeedbackCard feedback={mentorFeedback} />
          </div>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            className="rounded-[8px] bg-[#22c55e] px-4 py-3 font-heading font-black text-white shadow-[0_5px_0_#129447]"
            onClick={() => {
              setMentorFeedback(learningCircleDummyData.mentorFeedback as MentorFeedback);
              setHandoffStatus(transitionHandoff("waitingMentor", "MENTOR_REPLY"));
            }}
            type="button"
          >
            Simulasikan mentor membalas
          </button>
          {mentorFeedback ? (
            <button
              className="rounded-[8px] border-2 border-slate-200 bg-white px-4 py-3 font-heading font-black text-slate-700"
              onClick={() => {
                setFeedback(undefined);
                setSelectedAnswer(null);
                setState({ ...state, step: "question", attempts: 1 });
              }}
              type="button"
            >
              Terapkan feedback di misi
            </button>
          ) : null}
        </div>
        <Link
          className="mt-4 inline-flex rounded-[8px] border-2 border-[#bfdbfe] bg-[#eff6ff] px-4 py-3 font-heading font-black text-[#2563eb]"
          href="/mentor/baleverse"
        >
          Lihat dummy queue mentor
        </Link>
      </main>
    );
  }

  if (state.step === "reward") {
    return (
      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <BaleHero state="celebrating" />
        <section className="mt-4 rounded-[8px] bg-[#172033] p-5 text-white shadow-[0_8px_0_#020617]">
          <p className="text-xs font-black uppercase text-[#f9c74f]">Reward misi</p>
          <h1 className="font-heading mt-2 text-3xl font-black">Gerbang Distribusi terbuka.</h1>
          <p className="mt-3 font-bold leading-7 text-white/78">
            Benar. Kamu sudah mendistribusikan angka 3 ke kedua bagian dalam kurung. XP bertambah karena kamu menyelesaikan aktivitas, sementara mastery bertambah karena jawaban dan alasanmu tepat.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <MissionReward dayaBale={snapshot.activeMission.rewardDayaBale} xp={snapshot.activeMission.rewardXp} />
            <div className="rounded-[8px] bg-white/10 p-4">
              <p className="text-xs font-black uppercase text-white/55">Mastery Matematika</p>
              <p className="font-heading mt-1 text-2xl font-black">64%</p>
              <p className="mt-1 text-sm font-bold text-white/70">Naik dari 62%</p>
            </div>
            <div className="rounded-[8px] bg-white/10 p-4">
              <p className="text-xs font-black uppercase text-white/55">Segel Penguasaan</p>
              <p className="font-heading mt-1 text-2xl font-black">Berkembang</p>
              <p className="mt-1 text-sm font-bold text-white/70">Butuh Cek Paham ulang</p>
            </div>
          </div>
          <button
            className="mt-5 rounded-[8px] bg-[#22c55e] px-5 py-4 font-heading font-black text-white shadow-[0_6px_0_#129447]"
            onClick={() => {
              setFeedback(undefined);
              setSelectedAnswer(null);
              setState({ ...state, step: "dashboard", attempts: 0 });
            }}
            type="button"
          >
            Kembali ke Dashboard
          </button>
        </section>
      </main>
    );
  }

  return (
    <div className="grid min-h-screen gap-4 bg-[#f8fafc] lg:grid-cols-[1fr_390px]">
      <MissionShell
        attempts={state.attempts}
        feedback={feedback}
        mission={snapshot.activeMission}
        onCheck={handleWrongAnswer}
        onSelect={setSelectedAnswer}
        selectedAnswer={selectedAnswer}
      />
      <aside className="border-t border-slate-200 bg-white/70 p-4 lg:border-l lg:border-t-0">
        <div className="sticky top-4 space-y-4">
          <BaleHero state={state.step === "humanHelp" || state.step === "consent" ? "askingMentor" : state.step === "hintTwo" ? "confused" : "thinking"} />
          <TanyaBalePanel confidence={confidence} hint={missionHint} />
          {(state.step === "humanHelp" || state.step === "consent") && humanHelp ? (
            <HumanHelpRecommendationCard
              onApprove={approveMentorHelp}
              onCancel={() => setState({ ...state, step: "question" })}
              onToggleContext={toggleContext}
              recommendation={humanHelp}
              selectedContext={selectedContext}
            />
          ) : null}
          {submittingHelp ? (
            <div className="flex items-center gap-2 rounded-[8px] bg-white p-4 font-heading font-black shadow-sm">
              <Loader2 className="animate-spin text-[#2563eb]" size={18} />
              Mengirim permintaan mentor...
            </div>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
