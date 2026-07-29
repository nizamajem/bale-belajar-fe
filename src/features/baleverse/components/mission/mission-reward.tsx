export function MissionReward({ xp = 90, dayaBale = 18 }: { xp?: number; dayaBale?: number }) {
  return <div className="rounded-[8px] bg-[#f0fdf4] p-4 font-heading font-black text-[#166534]">+{xp} XP, +{dayaBale} Daya Bale</div>;
}
