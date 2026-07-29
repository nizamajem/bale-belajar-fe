export function MasteryProgress({ value = 62 }: { value?: number }) {
  return <div className="rounded-[8px] bg-white p-4"><p className="font-heading font-black">Segel Penguasaan {value}%</p><div className="mt-2 h-2 rounded-full bg-slate-100"><span className="block h-full rounded-full bg-[#22c55e]" style={{ width: `${value}%` }} /></div></div>;
}
