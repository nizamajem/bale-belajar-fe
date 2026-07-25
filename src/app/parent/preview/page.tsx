import Link from "next/link";
import { ArrowRight, BookOpen, HeartHandshake, Star } from "lucide-react";

export const metadata = {
  title: "Preview Orang Tua",
  description: "Contoh ringkasan belajar anak untuk orang tua atau wali.",
};

export default function ParentPreviewPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-6 sm:px-6">
      <section className="mx-auto max-w-4xl">
        <Link className="flex items-center gap-3" href="/welcome">
          <span className="grid size-11 place-items-center rounded-[8px] bg-[#22c55e] text-white shadow-[0_5px_0_#129447]">
            <BookOpen size={23} strokeWidth={3} />
          </span>
          <span className="font-heading text-xl font-black">BaleBelajar</span>
        </Link>

        <article className="mt-8 rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <HeartHandshake className="text-[#6d28d9]" size={32} />
          <p className="mt-4 text-sm font-black uppercase text-[#6d28d9]">Contoh ringkasan orang tua</p>
          <h1 className="font-heading mt-2 text-4xl font-black">Alya belajar membaca bukti dengan lebih teliti.</h1>
          <p className="mt-3 font-bold leading-7 text-slate-600">
            Minggu ini Alya menyelesaikan satu kasus detektif. Ia kuat saat membedakan fakta dan dugaan, tetapi masih perlu latihan menyusun kesimpulan yang aman.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Card title="Sudah kuat" text="Fakta vs dugaan" />
            <Card title="Perlu latihan" text="Kesimpulan aman" />
            <Card title="Saran 7 hari" text="10 menit latihan ulang" />
          </div>

          <div className="mt-6 rounded-[8px] bg-[#fff7ed] p-4">
            <div className="flex items-start gap-3">
              <Star className="mt-1 shrink-0 text-[#c2410c]" fill="#f9c74f" size={21} />
              <p className="font-bold leading-7 text-[#9a3412]">
                Saran untuk rumah: minta Alya menjelaskan satu bukti yang paling kuat dari kasusnya. Tidak perlu langsung mengoreksi; bantu ia menyebut alasan.
              </p>
            </div>
          </div>
        </article>

        <Link className="mt-6 inline-flex items-center gap-2 rounded-[8px] bg-[#22c55e] px-5 py-4 font-heading font-black text-white shadow-[0_6px_0_#129447]" href="/welcome#pilot">
          Coba untuk sekolah
          <ArrowRight size={18} />
        </Link>
      </section>
    </main>
  );
}

function Card({ text, title }: { text: string; title: string }) {
  return (
    <div className="rounded-[8px] bg-[#f8fafc] p-4">
      <p className="text-xs font-black uppercase text-slate-400">{title}</p>
      <p className="font-heading mt-2 text-xl font-black">{text}</p>
    </div>
  );
}
