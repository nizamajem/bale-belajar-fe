export function XpAnimation({ xp = 90 }: { xp?: number }) {
  return <span className="inline-flex rounded-full bg-[#f0fdf4] px-3 py-2 font-black text-[#166534]">+{xp} XP</span>;
}
