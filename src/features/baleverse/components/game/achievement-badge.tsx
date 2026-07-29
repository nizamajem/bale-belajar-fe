export function AchievementBadge({ label = "Segel Penguasaan" }: { label?: string }) {
  return <span className="inline-flex rounded-full bg-[#fef3c7] px-3 py-2 text-xs font-black text-[#92400e]">{label}</span>;
}
