export function AnswerFeedback({ message = "Feedback spesifik akan muncul di sini." }: { message?: string }) {
  return <p aria-live="polite" className="rounded-[8px] bg-[#eff6ff] p-3 text-sm font-bold text-[#2563eb]">{message}</p>;
}
