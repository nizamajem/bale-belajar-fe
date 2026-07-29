export function StreakWidget({ completed = 2, target = 3 }: { completed?: number; target?: number }) {
  return <div className="rounded-[8px] bg-[#fff7ed] p-4 font-bold text-[#c2410c]">Target minggu ini: {target} hari. Kamu sudah belajar {completed} hari.</div>;
}
