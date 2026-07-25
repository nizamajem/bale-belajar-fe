import Link from "next/link";
import { BookOpen, BrainCircuit, CheckCircle2, ShieldAlert } from "lucide-react";

export const metadata = {
  title: "AI Guardrails BaleBelajar",
  description: "Prinsip penggunaan AI di BaleBelajar: rekomendasi belajar, audit, fallback, dan kontrol guru.",
};

export default function AiGuardrailsPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-6 sm:px-6">
      <section className="mx-auto max-w-5xl">
        <Header />
        <div className="mt-10 rounded-[8px] bg-[#172033] p-6 text-white shadow-[0_10px_0_#020617]">
          <BrainCircuit className="text-[#f9c74f]" size={38} />
          <p className="mt-4 text-sm font-black uppercase text-[#f9c74f]">AI guardrails</p>
          <h1 className="font-heading mt-2 text-4xl font-black leading-tight sm:text-6xl">
            AI membantu rekomendasi belajar, bukan menggantikan guru.
          </h1>
          <p className="mt-4 max-w-3xl font-bold leading-8 text-white/72">
            Prinsip ini penting untuk sekolah: hasil AI harus bisa dijelaskan, punya fallback, dan tetap berada di bawah kontrol guru/admin.
          </p>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {["Saran harus punya alasan", "Ada fallback rule-based", "Guru bisa membaca dan mengabaikan rekomendasi"].map((item) => (
            <p className="flex gap-2 rounded-[8px] border border-slate-200 bg-white p-5 font-bold text-slate-600 shadow-sm" key={item}>
              <CheckCircle2 className="mt-0.5 shrink-0 text-[#22c55e]" size={18} />
              {item}
            </p>
          ))}
        </div>
        <section className="mt-6 rounded-[8px] border border-[#fed7aa] bg-[#fff7ed] p-5 text-[#9a3412]">
          <ShieldAlert size={28} />
          <h2 className="font-heading mt-3 text-2xl font-black">Batasan yang harus jelas</h2>
          <p className="mt-2 font-bold leading-7">
            AI tidak boleh memberi label permanen pada siswa. Rekomendasi harus dianggap sementara dan berubah setelah siswa latihan ulang.
          </p>
        </section>
      </section>
    </main>
  );
}

function Header() {
  return (
    <Link className="flex items-center gap-3" href="/welcome">
      <span className="grid size-11 place-items-center rounded-[8px] bg-[#22c55e] text-white shadow-[0_5px_0_#129447]">
        <BookOpen size={23} strokeWidth={3} />
      </span>
      <span className="font-heading text-xl font-black">BaleBelajar</span>
    </Link>
  );
}
