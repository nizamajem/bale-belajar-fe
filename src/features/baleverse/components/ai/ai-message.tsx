export function AiMessage({ children = "Aku bantu dengan petunjuk bertahap." }: { children?: React.ReactNode }) {
  return <div className="rounded-[8px] bg-[#eff6ff] p-3 text-sm font-bold text-[#2563eb]">{children}</div>;
}
