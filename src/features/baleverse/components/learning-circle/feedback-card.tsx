export function FeedbackCard({ feedback = "Feedback mentor akan muncul di sini." }: { feedback?: string }) {
  return <article className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm">{feedback}</article>;
}
