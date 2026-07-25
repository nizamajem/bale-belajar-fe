"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  GraduationCap,
  Loader2,
  Search,
  Sparkles,
  Trophy,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  avatarAccessories,
  avatarBases,
  avatarColors,
  AvatarColorId,
  firstWorlds,
  gradeChoices,
  learningGoals,
  placementQuestions,
  selfLevels,
  StudentOnboardingState,
} from "../data/onboarding-dummy-data";
import {
  completePlacement,
  getOnboardingState,
  saveOnboardingState,
} from "../services/onboarding-dummy-service";
import { OnboardingShell } from "./onboarding-shell";

type Step =
  | "profile"
  | "grade"
  | "goal"
  | "world"
  | "avatar"
  | "placement"
  | "result"
  | "first-mission";

const stepIndex: Record<Step, number> = {
  profile: 0,
  grade: 1,
  goal: 2,
  world: 3,
  avatar: 4,
  placement: 5,
  result: 6,
  "first-mission": 6,
};

const nextRoute: Record<Step, string> = {
  profile: "/onboarding/student/grade",
  grade: "/onboarding/student/goal",
  goal: "/onboarding/student/world",
  world: "/onboarding/student/avatar",
  avatar: "/onboarding/student/placement",
  placement: "/onboarding/student/result",
  result: "/onboarding/student/first-mission",
  "first-mission": "/student/dashboard",
};

export function StudentOnboardingFlow({ step }: { step: Step }) {
  const router = useRouter();
  const [state, setState] = useState<StudentOnboardingState>(() => getOnboardingState());
  const [saving, setSaving] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>(state.placementAnswers ?? {});
  const [placementResult, setPlacementResult] = useState<{
    score: number;
    focus: string;
    missionId: string;
  } | null>(null);

  async function saveAndGo(patch: Partial<StudentOnboardingState>, route = nextRoute[step]) {
    setSaving(true);
    try {
      const next = await saveOnboardingState(patch);
      setState(next);
      router.push(route);
    } finally {
      setSaving(false);
    }
  }

  const heroName = state.avatar?.heroName || `${state.nickname ?? "Bale"} Hero`;

  if (step === "profile") {
    return (
      <OnboardingShell
        stepIndex={stepIndex[step]}
        subtitle="Satu nama dulu. Langsung lanjut."
        title="Nama hero kamu?"
      >
        <ProfileStep
          initialName={state.nickname ?? ""}
          loading={saving}
          onSubmit={(nickname) => saveAndGo({ nickname })}
        />
      </OnboardingShell>
    );
  }

  if (step === "grade") {
    return (
      <OnboardingShell
        stepIndex={stepIndex[step]}
        subtitle="Pilih paling dekat. Nanti game menyesuaikan."
        title="Pilih level"
      >
        <div className="grid gap-3">
          {gradeChoices.map((choice) => (
            <ChoiceButton
              description={choice.description}
              icon={<GraduationCap size={20} />}
              key={choice.id}
              label={choice.label}
              onClick={() => saveAndGo({ gradeChoice: choice.id })}
              selected={state.gradeChoice === choice.id}
            />
          ))}
        </div>
        {state.gradeChoice === "level-sendiri" ? (
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {selfLevels.map((level) => (
              <button
                className="rounded-[8px] border-2 border-slate-200 bg-white px-4 py-3 text-left font-heading font-black shadow-sm transition hover:border-[#22c55e]"
                key={level.id}
                onClick={() => saveAndGo({ selfLevel: level.id })}
                type="button"
              >
                {level.label}
              </button>
            ))}
          </div>
        ) : null}
      </OnboardingShell>
    );
  }

  if (step === "goal") {
    return (
      <OnboardingShell
        stepIndex={stepIndex[step]}
        subtitle="Biar misi terasa pas untukmu."
        title="Pilih target"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {learningGoals.map((goal) => (
            <ChoiceButton
              description={goal.description}
              icon={<Sparkles size={20} />}
              key={goal.id}
              label={goal.label}
              onClick={() => saveAndGo({ goal: goal.id })}
              selected={state.goal === goal.id}
            />
          ))}
        </div>
      </OnboardingShell>
    );
  }

  if (step === "world") {
    return (
      <OnboardingShell
        stepIndex={stepIndex[step]}
        subtitle="Pilih portal. Dunia lain tetap bisa dibuka."
        title="Pilih dunia"
      >
        <div className="grid gap-4 md:grid-cols-3">
          {firstWorlds.map((world) => (
            <motion.button
              className={`min-h-64 overflow-hidden rounded-[8px] bg-gradient-to-br ${world.theme} p-4 text-left text-white shadow-[0_8px_0_rgba(15,23,42,0.25)] transition focus:outline-none focus:ring-4 focus:ring-[#bfdbfe]`}
              key={world.id}
              onClick={() => saveAndGo({ world: world.id })}
              type="button"
              whileHover={{ y: -4 }}
              whileTap={{ y: 2 }}
            >
              <WorldMiniFigure worldId={world.id} />
              <p className="mt-4 text-sm font-black uppercase text-white/70">{world.subject}</p>
              <h2 className="font-heading text-2xl font-black">{world.name}</h2>
              <p className="mt-2 text-sm font-bold leading-6 text-white/86">{world.promise}</p>
            </motion.button>
          ))}
        </div>
      </OnboardingShell>
    );
  }

  if (step === "avatar") {
    return (
      <OnboardingShell
        stepIndex={stepIndex[step]}
        subtitle="Buat cepat. Item lain terbuka dari progres."
        title="Buat hero"
      >
        <AvatarStep
          heroName={heroName}
          loading={saving}
          state={state}
          onSubmit={(avatar) => saveAndGo({ avatar })}
        />
      </OnboardingShell>
    );
  }

  if (step === "placement") {
    const canSubmit = placementQuestions.every((question) => answers[question.id]);
    return (
      <OnboardingShell
        stepIndex={stepIndex[step]}
        subtitle="Bukan ujian. Cuma cari misi yang pas."
        title="Cek cepat"
      >
        <div className="space-y-4">
          {placementQuestions.map((question, index) => (
            <div className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm" key={question.id}>
              <p className="font-heading text-lg font-black">
                {index + 1}. {question.prompt}
              </p>
              <div className="mt-3 grid gap-2">
                {question.options.map((option) => {
                  const selected = answers[question.id] === option.id;
                  return (
                    <button
                      className={[
                        "rounded-[8px] border-2 px-4 py-3 text-left font-bold transition",
                        selected
                          ? "border-[#22c55e] bg-[#f0fdf4] text-[#166534]"
                          : "border-slate-200 bg-white text-slate-600",
                      ].join(" ")}
                      key={option.id}
                      onClick={() => setAnswers((current) => ({ ...current, [question.id]: option.id }))}
                      type="button"
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <button
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#22c55e] px-5 py-4 font-heading font-black text-white shadow-[0_7px_0_#129447] transition active:translate-y-1 active:shadow-none disabled:opacity-60"
          disabled={!canSubmit || saving}
          onClick={async () => {
            setSaving(true);
            try {
              const result = await completePlacement(answers);
              setPlacementResult(result);
              router.push(nextRoute.placement);
            } finally {
              setSaving(false);
            }
          }}
          type="button"
        >
          {saving ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
          Temukan Misi Pertama
        </button>
        {placementResult ? <p className="mt-3 text-sm font-bold">{placementResult.focus}</p> : null}
      </OnboardingShell>
    );
  }

  if (step === "result") {
    return (
      <OnboardingShell
        stepIndex={stepIndex[step]}
        subtitle="Bukan nilai. Ini titik mulai."
        title="Misi ditemukan"
      >
        <div className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
          <Trophy className="text-[#f59e0b]" size={34} />
          <h2 className="font-heading mt-4 text-2xl font-black">Mulai dari fondasi ringan</h2>
          <p className="mt-2 font-bold leading-7 text-slate-500">
            Kamu akan masuk ke misi pendek 8-15 menit. Fokusnya bukan nilai, tapi memahami langkah pertama.
          </p>
          <button
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#2563eb] px-5 py-4 font-heading font-black text-white shadow-[0_7px_0_#1e40af] transition active:translate-y-1 active:shadow-none sm:w-auto"
            onClick={() => router.push(nextRoute.result)}
            type="button"
          >
            Lihat Misi
            <ArrowRight size={18} />
          </button>
        </div>
      </OnboardingShell>
    );
  }

  return (
    <OnboardingShell
      stepIndex={stepIndex[step]}
      subtitle="Masuk level pertama sekarang."
      title={`${heroName}, siap?`}
    >
      <div className="rounded-[8px] bg-[#172033] p-5 text-white shadow-[0_9px_0_#020617]">
        <p className="text-sm font-black uppercase text-white/60">Rekomendasi</p>
        <h2 className="font-heading mt-2 text-3xl font-black">Mulai Misi Pertama</h2>
        <p className="mt-2 font-bold leading-7 text-white/82">8 menit. XP. Mastery naik.</p>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <button
          className="rounded-[8px] bg-[#22c55e] px-5 py-4 font-heading font-black text-white shadow-[0_7px_0_#129447] transition active:translate-y-1 active:shadow-none"
          onClick={() => router.push("/student/missions/first-mission")}
          type="button"
        >
          Mulai Sekarang
        </button>
        <button
          className="rounded-[8px] border-2 border-slate-200 bg-white px-5 py-4 font-heading font-black text-slate-700 shadow-[0_7px_0_#d8e2ef] transition active:translate-y-1 active:shadow-none"
          onClick={() => router.push("/student/dashboard")}
          type="button"
        >
          Masuk Dashboard
        </button>
      </div>
    </OnboardingShell>
  );
}

function ProfileStep({
  initialName,
  loading,
  onSubmit,
}: {
  initialName: string;
  loading: boolean;
  onSubmit: (nickname: string) => void;
}) {
  const [nickname, setNickname] = useState(initialName);
  return (
    <form
      className="game-pop rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(nickname);
      }}
    >
      <label className="block">
        <span className="mb-2 block text-sm font-black text-slate-600">Nama hero</span>
        <input
          className="w-full rounded-[8px] border-2 border-slate-200 px-4 py-4 font-heading text-xl font-black outline-none focus:border-[#22c55e] focus:ring-4 focus:ring-[#bbf7d0]"
          onChange={(event) => setNickname(event.target.value)}
          placeholder="Contoh: Dimas"
          required
          value={nickname}
        />
      </label>
      <button
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#22c55e] px-5 py-4 font-heading font-black text-white shadow-[0_7px_0_#129447] transition active:translate-y-1 active:shadow-none disabled:opacity-60"
        disabled={loading}
        type="submit"
      >
        {loading ? <Loader2 className="animate-spin" size={18} /> : null}
        Lanjut
      </button>
    </form>
  );
}

function ChoiceButton({
  description,
  icon,
  label,
  onClick,
  selected,
}: {
  description: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  selected: boolean;
}) {
  return (
    <button
      className={[
        "game-pop flex min-h-28 items-center gap-3 rounded-[8px] border-2 bg-white p-4 text-left shadow-[0_6px_0_#d8e2ef] transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-[#bfdbfe]",
        selected ? "border-[#22c55e]" : "border-slate-200",
      ].join(" ")}
      onClick={onClick}
      type="button"
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-[8px] bg-[#eff6ff] text-[#2563eb]">
        {icon}
      </span>
      <span>
        <span className="font-heading text-lg font-black">{label}</span>
        <span className="mt-1 block text-sm font-bold leading-6 text-slate-500">{description}</span>
      </span>
      {selected ? <Check className="ml-auto shrink-0 text-[#22c55e]" size={20} /> : null}
    </button>
  );
}

function AvatarStep({
  heroName,
  loading,
  onSubmit,
  state,
}: {
  heroName: string;
  loading: boolean;
  onSubmit: (avatar: NonNullable<StudentOnboardingState["avatar"]>) => void;
  state: StudentOnboardingState;
}) {
  const [base, setBase] = useState(state.avatar?.base ?? "detektif");
  const [color, setColor] = useState(state.avatar?.color ?? "green");
  const [accessory, setAccessory] = useState(state.avatar?.accessory ?? "lens");
  const [name, setName] = useState(heroName);
  const selectedBase = useMemo(
    () => avatarBases.find((item) => item.id === base) ?? avatarBases[0],
    [base],
  );
  const selectedColor = useMemo(
    () => avatarColors.find((item) => item.id === color) ?? avatarColors[0],
    [color],
  );
  const selectedAccessory = useMemo(
    () => avatarAccessories.find((item) => item.id === accessory) ?? avatarAccessories[0],
    [accessory],
  );

  return (
    <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="game-pop overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-sm">
        <div
          className="game-grid-surface relative min-h-[430px] overflow-hidden px-4 py-6 text-white"
          style={{ background: `linear-gradient(135deg, ${selectedColor.shadow}, ${selectedColor.hex})` }}
        >
          <div className="absolute inset-x-0 bottom-0 h-28 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.36),transparent_62%)]" />
          <div className="absolute left-5 top-5 rounded-full bg-[#172033]/75 px-3 py-1 text-xs font-black uppercase">
            Preview Ringan
          </div>
          <div className="absolute right-5 top-5 rounded-full bg-white/85 px-3 py-1 text-xs font-black text-[#172033]">
            2D Animatif
          </div>
          <div className="relative z-10 mx-auto flex min-h-[360px] max-w-sm flex-col items-center justify-center">
            <DetectiveHeroIllustration
              accessory={selectedAccessory.label}
              base={selectedBase.label}
              color={selectedColor.hex}
            />
            <div className="mt-5 rounded-[8px] bg-white/14 p-4 text-center backdrop-blur">
              <p className="font-heading text-2xl font-black">{name}</p>
              <p className="mt-1 text-sm font-bold text-white/82">
                {selectedBase.label} - {selectedBase.vibe}
              </p>
            </div>
          </div>
        </div>
        <div className="grid gap-3 p-4 sm:grid-cols-3">
          {[
            ["1", "Belajar materi", "Pahami konsep kasus dulu."],
            ["2", "Lihat contoh", "Bongkar cara berpikirnya."],
            ["3", "Baru latihan", "AI analisis hasilmu."],
          ].map(([number, title, description]) => (
            <div className="rounded-[8px] bg-[#f8fafc] p-3" key={title}>
              <span className="grid size-8 place-items-center rounded-[8px] bg-[#172033] font-heading font-black text-white">
                {number}
              </span>
              <p className="mt-2 font-heading font-black">{title}</p>
              <p className="mt-1 text-xs font-bold leading-5 text-slate-500">{description}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-[8px] border border-slate-200 bg-[#172033] p-4 text-white shadow-[0_9px_0_#020617] sm:p-5">
        <p className="font-heading text-2xl font-black">Tentukan karakter</p>
        <p className="mt-1 text-sm font-bold text-white/62">Pilih identitas belajar. Tidak berat, tidak pakai 3D.</p>
        <label className="block">
          <span className="mb-2 mt-5 block text-sm font-black text-white/70">Nama karakter</span>
          <input
            className="w-full rounded-[8px] border-2 border-white/15 bg-white px-4 py-3 font-bold text-[#172033] outline-none focus:border-[#22c55e]"
            onChange={(event) => setName(event.target.value)}
            value={name}
          />
        </label>
        <div className="mt-4 space-y-3">
          <CycleRow label="Base" options={avatarBases} value={base} onChange={setBase} />
          <ColorPalette value={color} onChange={setColor} />
          <CycleRow label="Item" options={avatarAccessories} value={accessory} onChange={setAccessory} />
          <div className="rounded-[8px] border border-white/12 bg-white/8 p-3">
            <p className="text-xs font-black uppercase text-white/55">Role belajar</p>
            <p className="mt-1 font-heading text-lg font-black">Detektif belajar dari bukti, bukan tebak-tebakan.</p>
            <p className="mt-1 text-sm font-bold leading-6 text-white/68">
              Setelah ini kamu akan masuk peta kurikulum: materi, contoh kasus, latihan, lalu rekomendasi AI.
            </p>
          </div>
        </div>
        <button
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#22c55e] px-5 py-4 font-heading font-black text-white shadow-[0_7px_0_#129447] transition active:translate-y-1 active:shadow-none disabled:opacity-60"
          disabled={loading}
          onClick={() => onSubmit({ base, color, accessory, heroName: name })}
          type="button"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : null}
          Simpan BaleHero
        </button>
      </div>
    </div>
  );
}

function ColorPalette({
  onChange,
  value,
}: {
  onChange: (value: AvatarColorId) => void;
  value: AvatarColorId;
}) {
  return (
    <div className="rounded-[8px] border border-white/12 bg-white/8 p-3">
      <div className="mb-2 px-1 text-xs font-black uppercase text-white/55">Palette Kostum</div>
      <div className="grid grid-cols-4 gap-2">
        {avatarColors.map((item) => {
          const selected = item.id === value;
          return (
            <button
              aria-label={`Pilih ${item.label}`}
              className={[
                "min-h-14 rounded-[8px] border-2 p-1 shadow-[0_4px_0_rgba(2,6,23,0.35)] transition active:translate-y-1 active:shadow-none",
                selected ? "border-white bg-white/18" : "border-white/10 bg-white/8",
              ].join(" ")}
              key={item.id}
              onClick={() => onChange(item.id)}
              type="button"
            >
              <span
                className="block h-9 rounded-[6px]"
                style={{ background: `linear-gradient(135deg, ${item.hex}, ${item.shadow})` }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DetectiveHeroIllustration({
  accessory,
  base,
  color,
}: {
  accessory: string;
  base: string;
  color: string;
}) {
  return (
    <div className="hero-idle relative h-64 w-52">
      <div className="absolute left-1/2 top-5 h-20 w-28 -translate-x-1/2 rounded-t-[28px] bg-[#172033] shadow-[0_7px_0_rgba(2,6,23,0.35)]" />
      <div className="absolute left-1/2 top-16 h-20 w-24 -translate-x-1/2 rounded-[24px] bg-[#f7c7a4] shadow-inner">
        <span className="absolute left-5 top-8 size-3 rounded-full bg-[#172033]" />
        <span className="absolute right-5 top-8 size-3 rounded-full bg-[#172033]" />
        <span className="absolute left-1/2 top-12 h-2 w-8 -translate-x-1/2 rounded-full border-b-4 border-[#172033]" />
      </div>
      <div className="absolute left-1/2 top-2 h-8 w-40 -translate-x-1/2 rounded-full bg-[#172033]" />
      <div
        className="absolute left-1/2 top-32 h-24 w-32 -translate-x-1/2 rounded-[22px] shadow-[0_9px_0_rgba(2,6,23,0.26)]"
        style={{ backgroundColor: color }}
      >
        <div className="absolute left-4 top-4 h-12 w-7 rounded-b-[10px] bg-white/20" />
        <div className="absolute right-4 top-4 h-12 w-7 rounded-b-[10px] bg-white/20" />
        <span className="absolute left-1/2 top-5 h-14 w-1 -translate-x-1/2 rounded-full bg-white/45" />
      </div>
      <div className="hero-arm absolute left-5 top-36 h-20 w-7 origin-top rounded-full bg-[#f7c7a4]" />
      <div className="hero-arm absolute right-5 top-36 h-20 w-7 origin-top rounded-full bg-[#f7c7a4]" />
      <div className="absolute bottom-2 left-14 h-16 w-8 rounded-b-[12px] bg-[#172033]" />
      <div className="absolute bottom-2 right-14 h-16 w-8 rounded-b-[12px] bg-[#172033]" />
      <div className="accessory-pop absolute right-5 top-24 grid size-16 place-items-center rounded-full border-[6px] border-[#facc15] bg-white/15">
        <Search className="text-[#facc15]" size={30} />
      </div>
      <div className="absolute bottom-0 left-1/2 h-4 w-40 -translate-x-1/2 rounded-full bg-black/18 blur-sm" />
      <div className="absolute -bottom-10 left-1/2 w-64 -translate-x-1/2 rounded-[8px] bg-white/14 px-3 py-2 text-center text-xs font-black text-white/80">
        {base} + {accessory}
      </div>
    </div>
  );
}

function CycleRow<T extends string>({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (value: T) => void;
  options: { id: T; label: string }[];
  value: T;
}) {
  const currentIndex = Math.max(0, options.findIndex((option) => option.id === value));
  const current = options[currentIndex] ?? options[0];

  function cycle(direction: -1 | 1) {
    const nextIndex = (currentIndex + direction + options.length) % options.length;
    onChange(options[nextIndex].id);
  }

  return (
    <div className="rounded-[8px] border border-white/12 bg-white/8 p-2">
      <div className="mb-1 px-2 text-xs font-black uppercase text-white/55">{label}</div>
      <div className="grid grid-cols-[42px_1fr_42px] items-center gap-2">
        <button
          aria-label={`Sebelumnya ${label}`}
          className="grid min-h-11 place-items-center rounded-[8px] bg-[#0f766e] font-heading text-xl font-black shadow-[0_4px_0_#115e59]"
          onClick={() => cycle(-1)}
          type="button"
        >
          &lt;
        </button>
        <div className="min-h-11 rounded-[8px] bg-[linear-gradient(180deg,#0ea5e9,#2563eb)] px-3 py-2 text-center font-heading font-black shadow-[0_4px_0_#1e40af]">
          {current.label}
        </div>
        <button
          aria-label={`Berikutnya ${label}`}
          className="grid min-h-11 place-items-center rounded-[8px] bg-[#0f766e] font-heading text-xl font-black shadow-[0_4px_0_#115e59]"
          onClick={() => cycle(1)}
          type="button"
        >
          &gt;
        </button>
      </div>
    </div>
  );
}

function WorldMiniFigure({ worldId }: { worldId: string }) {
  return (
    <div className="relative h-28 overflow-hidden rounded-[8px] border border-white/20 bg-white/15 p-3">
      <div className="absolute left-4 top-4 h-12 w-12 rounded-[8px] bg-white/25" />
      <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2">
        <span className="h-8 rounded-[8px] bg-white/25" />
        <span className="h-8 rounded-[8px] bg-white/45" />
        <span className="h-8 rounded-[8px] bg-white/25" />
      </div>
      {worldId === "detectivia" ? (
        <Search className="absolute right-5 top-5 text-white" size={32} />
      ) : worldId === "kodex" ? (
        <span className="absolute right-5 top-5 font-heading text-3xl font-black">{"{}"}</span>
      ) : (
        <span className="absolute right-5 top-5 font-heading text-3xl font-black">=</span>
      )}
    </div>
  );
}
