export function XpBar({
  level,
  levelLabel,
  xpIntoLevel,
  xpRequired,
}: {
  level: number;
  levelLabel: string;
  xpIntoLevel: number;
  xpRequired: number;
}) {
  const percent = Math.max(0, Math.min(100, (xpIntoLevel / xpRequired) * 100));

  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs font-black text-slate-500">
        <span>
          {levelLabel} {level}
        </span>
        <span>
          {xpIntoLevel}/{xpRequired} XP
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-[#f9c74f]"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
