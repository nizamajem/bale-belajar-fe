export function AiRecommendationCard({ action = "Lanjutkan misi kecil." }: { action?: string }) {
  return <section className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm"><p className="font-heading font-black">{action}</p></section>;
}
