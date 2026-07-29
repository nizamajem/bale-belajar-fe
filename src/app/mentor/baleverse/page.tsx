import Link from "next/link";
import { AlertTriangle, ArrowLeft, Clock, MessageSquareText, ShieldAlert, UserRoundCheck } from "lucide-react";
import { learningCircleDummyData } from "@/features/baleverse/data/learning-circle-dummy-data";
import { mentorQueueDummyData } from "@/features/baleverse/data/mentor-queue-dummy-data";

const priorityClass = {
  P0: "border-[#fecdd3] bg-[#fff1f2] text-[#9f1239]",
  P1: "border-[#fed7aa] bg-[#fff7ed] text-[#c2410c]",
  P2: "border-[#bfdbfe] bg-[#eff6ff] text-[#1d4ed8]",
  P3: "border-slate-200 bg-white text-slate-700",
  P4: "border-slate-200 bg-white text-slate-700",
} as const;

export default function BaleverseMentorQueuePage() {
  const grouped = {
    safety: mentorQueueDummyData.filter((item) => item.urgency === "P0"),
    direct: mentorQueueDummyData.filter((item) => item.urgency === "P1"),
    lowConfidence: mentorQueueDummyData.filter((item) => item.urgency === "P2"),
    project: mentorQueueDummyData.filter((item) => item.urgency === "P3"),
    general: mentorQueueDummyData.filter((item) => item.urgency === "P4"),
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-6 sm:px-6">
      <section className="mx-auto max-w-6xl">
        <Link className="inline-flex items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-3 py-2 font-heading font-black text-slate-600" href="/student/baleverse">
          <ArrowLeft size={17} />
          BaleVerse demo
        </Link>

        <header className="mt-5 rounded-[8px] bg-[#172033] p-5 text-white shadow-[0_8px_0_#020617]">
          <p className="text-xs font-black uppercase text-[#f9c74f]">BaleMentor</p>
          <h1 className="font-heading mt-2 text-4xl font-black">Human Review Queue</h1>
          <p className="mt-3 max-w-2xl font-bold leading-7 text-white/75">
            Antrean dummy untuk bantuan baru, AI low confidence, jawaban terbuka, proyek, hasil disengketakan, dan laporan keselamatan.
          </p>
        </header>

        <section className="mt-4 grid gap-3 sm:grid-cols-5">
          <QueueMetric label="P0 Safety" value={grouped.safety.length} />
          <QueueMetric label="P1 Bantuan langsung" value={grouped.direct.length} />
          <QueueMetric label="P2 Low confidence" value={grouped.lowConfidence.length} />
          <QueueMetric label="P3 Review proyek" value={grouped.project.length} />
          <QueueMetric label="P4 General" value={grouped.general.length} />
        </section>

        <section className="mt-5 grid gap-4 lg:grid-cols-2">
          {mentorQueueDummyData.map((item) => (
            <article className={`rounded-[8px] border-2 p-4 shadow-sm ${priorityClass[item.urgency]}`} key={item.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase">{item.urgency} - {item.reason}</p>
                  <h2 className="font-heading mt-1 text-2xl font-black">{item.student}</h2>
                  <p className="mt-1 text-sm font-bold opacity-80">{item.topic}</p>
                </div>
                {item.urgency === "P0" ? <ShieldAlert size={28} /> : item.urgency === "P1" ? <AlertTriangle size={28} /> : <UserRoundCheck size={28} />}
              </div>

              <div className="mt-4 grid gap-3">
                <Detail icon={<MessageSquareText size={17} />} label="AI summary" value={item.aiSummary} />
                <Detail icon={<UserRoundCheck size={17} />} label="Student attempt" value={item.studentAttempt} />
                <Detail icon={<Clock size={17} />} label="Due time" value={item.dueTime} />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button className="rounded-[8px] bg-[#2563eb] px-4 py-3 font-heading font-black text-white shadow-[0_5px_0_#1e40af]" type="button">
                  Beri Feedback
                </button>
                <button className="rounded-[8px] border-2 border-current bg-white/70 px-4 py-3 font-heading font-black" type="button">
                  Minta Info Tambahan
                </button>
              </div>
              {item.id === "mentor-queue-001" ? (
                <div className="mt-4 rounded-[8px] bg-white/80 p-3">
                  <p className="text-xs font-black uppercase opacity-70">Draft feedback dummy</p>
                  <p className="mt-1 text-sm font-bold leading-6">{learningCircleDummyData.mentorFeedback.message}</p>
                </div>
              ) : null}
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}

function QueueMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm">
      <p className="font-heading text-3xl font-black text-[#172033]">{value}</p>
      <p className="mt-1 text-xs font-black uppercase text-slate-500">{label}</p>
    </div>
  );
}

function Detail({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-[8px] bg-white/72 p-3">
      <div className="flex items-center gap-2 text-xs font-black uppercase opacity-70">
        {icon}
        {label}
      </div>
      <p className="mt-1 text-sm font-bold leading-6">{value}</p>
    </div>
  );
}
