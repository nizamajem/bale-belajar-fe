export function TeachBack({ prompt = "Jelaskan balik dengan bahasamu." }: { prompt?: string }) {
  return <label className="block rounded-[8px] bg-white p-4 font-bold"><span>{prompt}</span><textarea className="mt-2 w-full rounded-[8px] border border-slate-200 p-3" rows={3} /></label>;
}
