import { ConfidenceLevel, learningMasteryLabel, LearningMasteryStatus } from "@/lib/types";

const toneByStatus: Record<LearningMasteryStatus, string> = {
  MASTERED: "bg-[#dcfce7] text-[#166534]",
  DEVELOPING: "bg-[#fef3c7] text-[#92400e]",
  NEEDS_PRACTICE: "bg-[#ffe4e6] text-[#9f1239]",
  INSUFFICIENT_EVIDENCE: "bg-slate-100 text-slate-500",
};

const confidenceLabel: Record<ConfidenceLevel, string> = {
  HIGH: "Keyakinan tinggi",
  MEDIUM: "Keyakinan sedang",
  LOW: "Keyakinan rendah",
};

export function MasteryBadge({
  status,
  confidence,
}: {
  status: LearningMasteryStatus;
  confidence?: ConfidenceLevel;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`rounded-full px-3 py-1 text-xs font-black ${toneByStatus[status]}`}>
        {learningMasteryLabel(status)}
      </span>
      {confidence ? (
        <span className="text-xs font-bold text-slate-400">{confidenceLabel[confidence]}</span>
      ) : null}
    </span>
  );
}
