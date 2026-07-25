import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, HeartHandshake } from "lucide-react";

export const metadata = {
  title: "Akses Orang Tua BaleBelajar",
  description: "Akses orang tua untuk melihat ringkasan belajar anak, rekomendasi latihan, dan perkembangan mingguan.",
};

export default function RegisterParentPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-6 sm:px-6">
      <section className="mx-auto max-w-5xl">
        <Link className="flex items-center gap-3" href="/welcome">
          <span className="grid size-11 place-items-center rounded-[8px] bg-[#22c55e] text-white shadow-[0_5px_0_#129447]">
            <BookOpen size={23} strokeWidth={3} />
          </span>
          <span className="font-heading text-xl font-black">BaleBelajar</span>
        </Link>

        <div className="mt-10 grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase text-[#2563eb]">Akses orang tua</p>
            <h1 className="font-heading mt-3 text-4xl font-black leading-tight sm:text-6xl">
              Orang tua melihat progres anak tanpa membaca laporan rumit.
            </h1>
            <p className="mt-4 font-bold leading-8 text-slate-600">
              Akses orang tua dibuka lewat undangan siswa atau sekolah. Fokusnya sederhana: anak sudah kuat apa, perlu latihan apa, dan apa yang bisa dibantu di rumah.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#22c55e] px-5 py-4 font-heading font-black text-white shadow-[0_6px_0_#129447]" href="/parent/preview">
                Lihat contoh ringkasan
                <ArrowRight size={18} />
              </Link>
              <Link className="inline-flex items-center justify-center rounded-[8px] border-2 border-slate-200 bg-white px-5 py-4 font-heading font-black text-slate-700 shadow-[0_6px_0_#d8e2ef]" href="/checkout">
                Minat akses keluarga
              </Link>
            </div>
          </div>
          <div className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
            <HeartHandshake className="text-[#6d28d9]" size={34} />
            <h2 className="font-heading mt-4 text-3xl font-black">Yang dilihat orang tua</h2>
            <div className="mt-5 grid gap-3">
              {["Progress mingguan anak", "Skill yang sudah kuat", "Latihan yang perlu diulang", "Saran ngobrol 10 menit di rumah"].map((item) => (
                <p className="flex items-center gap-2 rounded-[8px] bg-[#f8fafc] p-4 font-bold text-slate-600" key={item}>
                  <CheckCircle2 className="text-[#22c55e]" size={18} />
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
