export function RankProgress({ label = "Penjelajah III", value = 62 }: { label?: string; value?: number }) {
  return <div className="rounded-[8px] bg-white p-4"><p className="font-heading font-black">{label}</p><div className="mt-2 h-2 rounded-full bg-slate-100"><span className="block h-full rounded-full bg-[#2563eb]" style={{ width: `${value}%` }} /></div></div>;
}
