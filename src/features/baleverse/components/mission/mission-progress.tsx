export function MissionProgress({ value = 25 }: { value?: number }) {
  return <div aria-label={`Progres misi ${value}%`} className="h-3 rounded-full bg-slate-100"><span className="block h-full rounded-full bg-[#22c55e]" style={{ width: `${value}%` }} /></div>;
}
