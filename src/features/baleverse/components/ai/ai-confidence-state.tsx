import { AiConfidence } from "../../types";

export function AiConfidenceState({ confidence = "high" }: { confidence?: AiConfidence }) {
  const copy = confidence === "low" ? "Aku belum cukup yakin." : confidence === "medium" ? "Kita cek satu hal lagi." : "Aku cukup yakin.";
  return <p className="rounded-[8px] bg-white p-3 text-sm font-bold text-slate-600">{copy}</p>;
}
