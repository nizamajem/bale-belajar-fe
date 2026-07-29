export function QuestionCard({ prompt = "Pertanyaan BaleVerse" }: { prompt?: string }) {
  return <article className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm"><h2 className="font-heading font-black">{prompt}</h2></article>;
}
