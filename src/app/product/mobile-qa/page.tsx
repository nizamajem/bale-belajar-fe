import Link from "next/link";
import { BookOpen, CheckCircle2, Smartphone } from "lucide-react";

export const metadata = {
  title: "Mobile QA BaleBelajar",
  description: "Checklist mobile QA BaleBelajar untuk Android, tablet, dan desktop.",
};

const sizes = ["360px", "375px", "390px", "414px", "768px", "1024px"];

export default function MobileQaPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-6 sm:px-6">
      <section className="mx-auto max-w-5xl">
        <Link className="flex items-center gap-3" href="/welcome">
          <span className="grid size-11 place-items-center rounded-[8px] bg-[#22c55e] text-white shadow-[0_5px_0_#129447]">
            <BookOpen size={23} strokeWidth={3} />
          </span>
          <span className="font-heading text-xl font-black">BaleBelajar</span>
        </Link>
        <div className="mt-10 rounded-[8px] bg-[#172033] p-6 text-white shadow-[0_10px_0_#020617]">
          <Smartphone className="text-[#f9c74f]" size={38} />
          <p className="mt-4 text-sm font-black uppercase text-[#f9c74f]">Mobile QA</p>
          <h1 className="font-heading mt-2 text-4xl font-black leading-tight sm:text-6xl">
            Produk harus enak dipakai di HP kecil sebelum siap dijual.
          </h1>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {sizes.map((size) => (
            <div className="rounded-[8px] border border-slate-200 bg-white p-5 text-center shadow-sm" key={size}>
              <p className="font-heading text-3xl font-black">{size}</p>
              <p className="mt-1 text-sm font-bold text-slate-500">viewport test</p>
            </div>
          ))}
        </div>
        <section className="mt-6 rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-heading text-2xl font-black">Checklist wajib</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {["Tidak ada horizontal scroll", "Tombol minimal 44px", "Teks tidak kepotong", "Kartu bisa dibaca satu kolom", "Form mudah diisi jempol", "Animasi tidak mengganggu performa"].map((item) => (
              <p className="flex items-center gap-2 rounded-[8px] bg-[#f8fafc] p-4 font-bold text-slate-600" key={item}>
                <CheckCircle2 className="text-[#22c55e]" size={18} />
                {item}
              </p>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
