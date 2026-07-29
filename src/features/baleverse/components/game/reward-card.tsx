export function RewardCard({ reward = "Badge misi" }: { reward?: string }) {
  return <div className="rounded-[8px] bg-white p-4 font-bold shadow-sm">{reward}</div>;
}
