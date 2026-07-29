import { CheckCircle2, MessageSquareText } from "lucide-react";
import { MentorFeedback } from "../../types";

export function MentorFeedbackCard({ feedback }: { feedback: MentorFeedback }) {
  const reviewCopy = {
    pending: "Mastery menunggu review.",
    validated: "Mastery sudah divalidasi mentor.",
    needsMoreEvidence: "Mastery belum dinaikkan penuh. Butuh satu bukti lagi.",
  } satisfies Record<MentorFeedback["masteryReview"], string>;

  return (
    <section aria-live="polite" className="rounded-[8px] border border-[#bbf7d0] bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-[8px] bg-[#f0fdf4] text-[#16a34a]">
          <MessageSquareText size={22} />
        </span>
        <div>
          <p className="text-xs font-black uppercase text-[#16a34a]">Mentor membalas</p>
          <h2 className="font-heading text-xl font-black">{feedback.mentorName} memberi feedback</h2>
          <p className="mt-2 text-sm font-bold leading-6 text-slate-600">{feedback.message}</p>
        </div>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="rounded-[8px] bg-[#f8fafc] p-3">
          <p className="text-xs font-black uppercase text-slate-400">Langkah berikutnya</p>
          <p className="mt-1 text-sm font-bold leading-6 text-slate-600">{feedback.nextAction}</p>
        </div>
        <div className="rounded-[8px] bg-[#fff7ed] p-3 text-[#c2410c]">
          <div className="flex items-center gap-2 text-xs font-black uppercase">
            <CheckCircle2 size={16} />
            Review mastery
          </div>
          <p className="mt-1 text-sm font-bold leading-6">{reviewCopy[feedback.masteryReview]}</p>
        </div>
      </div>
    </section>
  );
}
