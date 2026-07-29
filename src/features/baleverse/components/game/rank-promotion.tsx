export function RankPromotion({ rank = "Penjelajah III" }: { rank?: string }) {
  return <div className="rounded-[8px] bg-[#eff6ff] p-4 font-heading font-black text-[#2563eb]">{rank}</div>;
}
