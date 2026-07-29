export function HintPanel({ hint = "Coba satu langkah kecil dulu." }: { hint?: string }) {
  return <aside className="rounded-[8px] border border-slate-200 bg-white p-3 text-sm font-bold text-slate-600">{hint}</aside>;
}
