"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bell,
  Calculator,
  Check,
  Code2,
  HelpCircle,
  Lock,
  MessageCircle,
  Search,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  baleverseWorlds,
  journeyStages,
  learningCircle,
  LearningWorld,
  quickActions,
  WorldId,
} from "../data/baleverse-dummy-data";

type BaleVerseDashboardProps = {
  studentName: string;
};

export function BaleVerseDashboard({ studentName }: BaleVerseDashboardProps) {
  const [activeWorldId, setActiveWorldId] = useState<WorldId>("detectivia");
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [lockedHint, setLockedHint] = useState<string | null>(null);
  const [equippedPowers, setEquippedPowers] = useState<string[]>(["Focus Lens"]);
  const activeWorld = useMemo(
    () => baleverseWorlds.find((world) => world.id === activeWorldId) ?? baleverseWorlds[0],
    [activeWorldId],
  );

  function togglePower(powerName: string) {
    const power = activeWorld.powers.find((item) => item.name === powerName);
    if (!power || power.status === "locked") {
      setLockedHint("Power ini belum terbuka. Selesaikan misi fondasi dulu.");
      return;
    }

    setEquippedPowers((current) => {
      if (current.includes(powerName)) {
        return current.filter((item) => item !== powerName);
      }
      return [...current, powerName].slice(-3);
    });
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:py-8">
      <DashboardHeader onToggleNotifications={() => setNoticeOpen((value) => !value)} />
      {noticeOpen ? (
        <div className="mb-4 rounded-[8px] border border-[#bfdbfe] bg-white p-4 text-sm font-bold text-slate-600 shadow-sm">
          Mentor menyarankan: kerjakan satu misi utama dulu. Setelah selesai, progres dan hadiah akan masuk otomatis.
        </div>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-[1fr_0.82fr]" id="misi">
        <HeroMissionCard studentName={studentName} world={activeWorld} />
        <BaleHeroCard world={activeWorld} />
      </div>

      <QuickActionGrid />

      <WorldSelector
        activeWorldId={activeWorld.id}
        onSelect={setActiveWorldId}
      />

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <JourneyStepper onLocked={setLockedHint} />
        <div className="grid gap-5">
          <SkillProgressList world={activeWorld} />
          <PowerLoadout
            equippedPowers={equippedPowers}
            onTogglePower={togglePower}
            world={activeWorld}
          />
        </div>
      </div>

      <LearningCircleCard />

      {lockedHint ? (
        <div className="fixed inset-x-4 bottom-24 z-50 mx-auto max-w-md rounded-[8px] border border-[#fed7aa] bg-[#fff7ed] p-4 text-sm font-bold leading-6 text-[#c2410c] shadow-2xl md:bottom-6">
          <div className="flex items-start gap-3">
            <Lock className="mt-0.5 shrink-0" size={18} />
            <p>{lockedHint}</p>
            <button
              className="ml-auto rounded-[8px] px-2 py-1 text-xs font-black text-[#9a3412] focus:outline-none focus:ring-4 focus:ring-[#fed7aa]"
              onClick={() => setLockedHint(null)}
              type="button"
            >
              OK
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function DashboardHeader({ onToggleNotifications }: { onToggleNotifications: () => void }) {
  return (
    <div className="mb-5 grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
      <div>
        <p className="text-sm font-black uppercase text-[#2563eb]">Beranda Siswa</p>
        <h1 className="font-heading text-2xl font-black text-[#172033] sm:text-3xl">
          Apa yang mau kamu lakukan hari ini?
        </h1>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          className="inline-flex min-h-11 items-center gap-2 rounded-[8px] bg-[#fff7ed] px-4 py-2 font-heading text-sm font-black text-[#c2410c] ring-1 ring-[#fed7aa] transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-[#fed7aa]"
          type="button"
        >
          <Star size={17} fill="#f9c74f" />
          Rajin 1 hari
        </button>
        <button
          className="inline-flex min-h-11 items-center gap-2 rounded-[8px] bg-[#eff6ff] px-4 py-2 font-heading text-sm font-black text-[#2563eb] ring-1 ring-[#bfdbfe] transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-[#bfdbfe]"
          type="button"
        >
          <Zap size={17} />
          120 Poin
        </button>
        <button
          aria-label="Buka notifikasi"
          className="grid min-h-11 min-w-11 place-items-center rounded-[8px] bg-white text-slate-600 ring-1 ring-slate-200 transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-[#bfdbfe]"
          onClick={onToggleNotifications}
          type="button"
        >
          <Bell size={18} />
        </button>
      </div>
    </div>
  );
}

function HeroMissionCard({ studentName, world }: { studentName: string; world: LearningWorld }) {
  return (
    <motion.article
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-[8px] p-5 text-white shadow-[0_10px_0_rgba(15,23,42,0.9)] sm:p-7"
      initial={{ opacity: 0, y: 16 }}
      key={world.id}
      style={{ background: world.theme.bg }}
      transition={{ duration: 0.26 }}
    >
      <div className="absolute inset-0 surface-detective opacity-20" />
      <div className="relative z-10 max-w-2xl">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/18 px-3 py-2 text-sm font-black">
          <Sparkles size={17} />
          Yang paling penting
        </span>
        <h2 className="font-heading mt-4 text-3xl font-black leading-tight sm:text-5xl">
          Hai {studentName}, lanjutkan misi ini dulu.
        </h2>
        <p className="mt-3 max-w-xl font-bold leading-7 text-white/88">
          Dashboard ini sederhana: pilih dunia, kerjakan misi singkat, lalu lihat progresmu naik.
        </p>
        <div className="mt-5 rounded-[8px] border border-white/16 bg-white/12 p-4">
          <p className="text-sm font-black uppercase text-white/70">Misi sekarang di {world.currentArea}</p>
          <h3 className="font-heading mt-1 text-2xl font-black">{world.mission.title}</h3>
          <div className="mt-3 grid gap-2 text-sm font-black text-white/90 sm:grid-cols-3">
            <span className="rounded-[8px] bg-white/12 px-3 py-2">{world.mission.durationMinutes} menit</span>
            <span className="rounded-[8px] bg-white/12 px-3 py-2">{world.mission.activities} aktivitas</span>
            <span className="rounded-[8px] bg-white/12 px-3 py-2">Hadiah {world.mission.xpReward} XP</span>
          </div>
        </div>
        <div className="mt-4 grid gap-2 text-sm font-bold text-white/88 sm:grid-cols-3">
          {["1. Klik lanjut", "2. Jawab pelan-pelan", "3. Lihat progres"].map((step) => (
            <span className="rounded-[8px] bg-black/10 px-3 py-2" key={step}>{step}</span>
          ))}
        </div>
        <Link
          className="light-trail mt-6 inline-flex min-h-12 items-center gap-2 rounded-[8px] bg-white px-5 py-4 font-heading font-black shadow-[0_6px_0_rgba(255,255,255,0.35)] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
          href={world.mission.href}
          style={{ color: world.theme.text }}
        >
          Lanjutkan Misi
          <ArrowRight size={18} />
        </Link>
      </div>
    </motion.article>
  );
}

function BaleHeroCard({ world }: { world: LearningWorld }) {
  return (
    <motion.aside
      animate={{ opacity: 1, scale: 1 }}
      className="overflow-hidden rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm"
      initial={{ opacity: 0, scale: 0.97 }}
      key={world.id}
      transition={{ duration: 0.24 }}
    >
      <div className="rounded-[8px] p-5 text-white" style={{ background: world.theme.bg }}>
        <div className="mx-auto max-w-[220px]">
          <WorldFigure world={world} size="large" />
        </div>
        <p className="mt-5 text-center text-sm font-black uppercase text-white/70">Karakter Aktif</p>
        <h3 className="font-heading text-center text-2xl font-black">{world.characterClass}</h3>
        <p className="mx-auto mt-2 max-w-xs text-center text-sm font-bold leading-6 text-white/82">
          {world.simplePurpose}
        </p>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <Stat label="Level" value={String(world.level)} />
        <Stat label="Mastery" value={`${world.mastery}%`} />
        <Stat label="Rank" value={world.rank.split(" ")[0]} />
      </div>
    </motion.aside>
  );
}

function QuickActionGrid() {
  return (
    <section className="mt-5">
      <div className="mb-3">
        <p className="text-sm font-black uppercase text-[#2563eb]">Butuh bantuan cepat?</p>
        <h2 className="font-heading text-xl font-black">Pilih fitur yang kamu butuhkan</h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action, index) => (
          <motion.button
            animate={{ opacity: 1, y: 0 }}
            className="interactive-card min-h-24 rounded-[8px] border border-slate-200 bg-white p-4 text-left shadow-sm focus:outline-none focus:ring-4 focus:ring-[#bfdbfe]"
            initial={{ opacity: 0, y: 12 }}
            key={action.label}
            transition={{ delay: index * 0.04 }}
            type="button"
          >
            <HelpCircle className="mb-3 text-[#2563eb]" size={21} />
            <p className="font-heading font-black">{action.label}</p>
            <p className="mt-1 text-sm font-bold leading-5 text-slate-500">{action.description}</p>
          </motion.button>
        ))}
      </div>
    </section>
  );
}

function WorldSelector({
  activeWorldId,
  onSelect,
}: {
  activeWorldId: WorldId;
  onSelect: (worldId: WorldId) => void;
}) {
  return (
    <section className="mt-6" id="dunia">
      <div className="mb-4">
        <p className="text-sm font-black uppercase text-[#6d28d9]">Pilih Dunia</p>
        <h2 className="font-heading text-2xl font-black">Setiap dunia punya gaya belajar berbeda</h2>
        <p className="mt-1 font-bold text-slate-500">Klik kartu untuk mengganti misi, karakter, skill, dan alat bantu.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {baleverseWorlds.map((world) => {
          const active = activeWorldId === world.id;
          return (
            <button
              className={[
                "interactive-card overflow-hidden rounded-[8px] border-2 bg-white p-0 text-left shadow-sm focus:outline-none focus:ring-4 focus:ring-[#bfdbfe]",
                active ? "border-[#22c55e]" : "border-slate-200",
              ].join(" ")}
              key={world.id}
              onClick={() => onSelect(world.id)}
              type="button"
            >
              <div className="grid min-h-36 grid-cols-[1fr_auto] gap-3 p-4 text-white" style={{ background: world.theme.bg }}>
                <div>
                  <p className="rounded-full bg-white/18 px-3 py-1 text-xs font-black w-fit">{world.characterClass}</p>
                  <p className="mt-4 font-heading text-2xl font-black">{world.name}</p>
                </div>
                <WorldFigure world={world} size="small" />
              </div>
              <div className="p-4">
                <p className="text-sm font-bold text-slate-500">{world.subject}</p>
                <p className="mt-2 text-sm font-bold leading-6 text-slate-600">{world.simplePurpose}</p>
                <p className="mt-3 text-sm font-black" style={{ color: world.theme.text }}>
                  Wilayah: {world.currentArea}
                </p>
                <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="progress-reveal h-full rounded-full"
                    style={{ "--progress-width": `${world.mastery}%`, backgroundColor: world.theme.accent } as React.CSSProperties}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function JourneyStepper({ onLocked }: { onLocked: (hint: string) => void }) {
  return (
    <section className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-black uppercase text-[#2563eb]">Progres Belajar</p>
      <h2 className="font-heading text-2xl font-black">Tahap yang sedang kamu buka</h2>
      <p className="mt-1 font-bold text-slate-500">Ini bukan menu biasa. Tahap terkunci akan terbuka setelah syaratnya terpenuhi.</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-4">
        {journeyStages.map((stage) => (
          <button
            className={[
              "min-h-28 rounded-[8px] border-2 p-4 text-left transition focus:outline-none focus:ring-4 focus:ring-[#bfdbfe]",
              stage.status === "completed" && "border-[#bbf7d0] bg-[#f0fdf4]",
              stage.status === "current" && "mission-node-active border-[#bfdbfe] bg-[#eff6ff]",
              stage.status === "locked" && "border-slate-200 bg-slate-50",
            ]
              .filter(Boolean)
              .join(" ")}
            key={stage.label}
            onClick={() => stage.status === "locked" && onLocked(stage.unlockHint ?? "Tahap ini belum terbuka.")}
            type="button"
          >
            {stage.status === "completed" ? <Check className="text-[#16a34a]" size={20} /> : stage.status === "locked" ? <Lock className="text-slate-400" size={20} /> : <Sparkles className="text-[#2563eb]" size={20} />}
            <p className="font-heading mt-3 font-black">{stage.label}</p>
            <p className="mt-1 text-sm font-bold text-slate-500">{stage.progressText}</p>
          </button>
        ))}
      </div>
    </section>
  );
}

function SkillProgressList({ world }: { world: LearningWorld }) {
  return (
    <section className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-black uppercase text-[#22c55e]">Kemampuan</p>
      <h2 className="font-heading text-xl font-black">Yang sedang kamu latih</h2>
      <div className="mt-4 space-y-4">
        {world.skills.map((skill) => (
          <div key={skill.name}>
            <div className="mb-2 flex justify-between gap-3 text-sm font-black">
              <span>{skill.name}</span>
              <span>{skill.value}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="progress-reveal h-full rounded-full"
                style={{ "--progress-width": `${skill.value}%`, backgroundColor: world.theme.accent } as React.CSSProperties}
              />
            </div>
            <p className="mt-1 text-xs font-bold text-slate-500">{skill.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function PowerLoadout({
  equippedPowers,
  onTogglePower,
  world,
}: {
  equippedPowers: string[];
  onTogglePower: (powerName: string) => void;
  world: LearningWorld;
}) {
  return (
    <section className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-black uppercase text-[#f59e0b]">Alat Bantu</p>
      <h2 className="font-heading text-xl font-black">Pilih alat saat mengerjakan misi</h2>
      <p className="mt-1 text-sm font-bold text-slate-500">Anggap ini seperti perlengkapan belajar. Klik untuk memasang.</p>
      <div className="mt-4 grid gap-2">
        {world.powers.map((power) => {
          const equipped = equippedPowers.includes(power.name) || power.status === "equipped";
          const locked = power.status === "locked";
          return (
            <button
              className={[
                "min-h-16 rounded-[8px] border-2 p-3 text-left transition focus:outline-none focus:ring-4 focus:ring-[#fed7aa]",
                equipped && "border-[#22c55e] bg-[#f0fdf4]",
                locked && "border-slate-200 bg-slate-50 text-slate-400",
                !equipped && !locked && "border-slate-200 bg-white",
              ]
                .filter(Boolean)
                .join(" ")}
              key={power.name}
              onClick={() => onTogglePower(power.name)}
              type="button"
            >
              <p className="font-heading font-black">{power.name}</p>
              <p className="mt-1 text-xs font-bold leading-5 text-slate-500">{power.description}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function LearningCircleCard() {
  return (
    <section className="mt-5 rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-black uppercase text-[#6d28d9]">Lingkar Belajar</p>
      <h2 className="font-heading text-2xl font-black">Dukungan yang tersedia</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {learningCircle.map((item) => (
          <div className="rounded-[8px] bg-[#f8fafc] p-4" key={item.label}>
            <MessageCircle className="mb-3 text-[#6d28d9]" size={20} />
            <p className="font-heading font-black">{item.label}</p>
            <p className="mt-1 text-sm font-bold leading-6 text-slate-500">{item.message}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[8px] bg-[#f8fafc] p-3">
      <p className="font-heading text-lg font-black">{value}</p>
      <p className="text-xs font-bold text-slate-500">{label}</p>
    </div>
  );
}

function WorldFigure({ world, size }: { world: LearningWorld; size: "small" | "large" }) {
  const isLarge = size === "large";
  const figureClass = isLarge
    ? "h-44 w-full min-w-0"
    : "h-24 w-24 shrink-0 sm:h-28 sm:w-28";
  const iconSize = isLarge ? 34 : 24;

  if (world.id === "detectivia") {
    return (
      <div
        aria-label="Figur detektif belajar Detectivia"
        className={`${figureClass} detective-idle relative overflow-hidden rounded-[8px] border border-white/20 bg-[#140f2f]/35 p-3 shadow-inner`}
        role="img"
      >
        <div className="absolute left-3 top-3 rounded-full bg-white/18 px-2 py-1 text-[10px] font-black text-white">
          CASE
        </div>
        <div className="absolute right-3 top-4 h-11 w-11 rounded-full border-[6px] border-[#facc15] bg-white/10">
          <Search className="absolute left-5 top-5 text-[#facc15]" size={iconSize} />
        </div>
        <div className="absolute bottom-4 left-4 right-4 rounded-[8px] border border-white/20 bg-white/14 p-3">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#facc15]" />
            <span className="h-2 flex-1 rounded-full bg-white/45" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="h-8 rounded-[8px] bg-white/22" />
            <span className="h-8 rounded-[8px] bg-white/35" />
            <span className="h-8 rounded-[8px] bg-white/22" />
          </div>
        </div>
        <div className="absolute left-12 top-16 h-px w-24 rotate-12 bg-[#facc15]/70" />
        <div className="absolute left-24 top-20 h-px w-20 -rotate-12 bg-white/45" />
      </div>
    );
  }

  if (world.id === "kodex") {
    return (
      <div
        aria-label="Figur kota kode KodeX"
        className={`${figureClass} detective-idle relative overflow-hidden rounded-[8px] border border-white/20 bg-[#082f49]/35 p-3 shadow-inner`}
        role="img"
      >
        <div className="absolute right-3 top-3 grid h-12 w-12 place-items-center rounded-[8px] bg-white/18">
          <Code2 className="text-white" size={iconSize} />
        </div>
        <div className="absolute bottom-4 left-4 right-4 grid grid-cols-4 gap-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <span
              className="h-8 rounded-[8px] bg-white/20 ring-1 ring-white/12"
              key={index}
              style={{ opacity: index % 2 ? 0.5 : 0.9 }}
            />
          ))}
        </div>
        <div className="absolute left-4 top-5 space-y-2">
          <span className="block h-2 w-20 rounded-full bg-white/70" />
          <span className="block h-2 w-14 rounded-full bg-[#a7f3d0]" />
          <span className="block h-2 w-24 rounded-full bg-white/35" />
        </div>
      </div>
    );
  }

  return (
    <div
      aria-label="Figur arsitek angka Numeria"
      className={`${figureClass} detective-idle relative overflow-hidden rounded-[8px] border border-white/20 bg-[#312e81]/35 p-3 shadow-inner`}
      role="img"
    >
      <div className="absolute right-3 top-3 grid h-12 w-12 place-items-center rounded-[8px] bg-white/18">
        <Calculator className="text-white" size={iconSize} />
      </div>
      <div className="absolute bottom-4 left-4 right-4">
        <div className="mb-3 flex items-end gap-2">
          <span className="h-8 flex-1 rounded-[8px] bg-[#fde68a]" />
          <span className="h-14 flex-1 rounded-[8px] bg-white/35" />
          <span className="h-10 flex-1 rounded-[8px] bg-[#f59e0b]" />
        </div>
        <div className="h-3 rounded-full bg-white/25">
          <span className="block h-full w-2/3 rounded-full bg-[#fbbf24]" />
        </div>
      </div>
      <div className="absolute left-5 top-5 grid grid-cols-2 gap-2 text-sm font-black text-white">
        <span className="grid h-8 w-8 place-items-center rounded-[8px] bg-white/20">+</span>
        <span className="grid h-8 w-8 place-items-center rounded-[8px] bg-white/20">=</span>
      </div>
    </div>
  );
}
