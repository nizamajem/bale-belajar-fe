import Link from "next/link";
import { BookOpen, ClipboardCheck, RotateCcw } from "lucide-react";

export const metadata = {
  title: "Kualitas Tes dan Remedial BaleBelajar",
  description: "Prinsip kualitas tes BaleBelajar: variasi soal, retake, remedial, dan rekomendasi belajar.",
};

const principles = [
  ["Materi dulu", "Siswa membaca konsep dan contoh sebelum menjawab."],
  ["Retake sehat", "Jika salah, siswa melihat penjelasan lalu mendapat kasus serupa, bukan soal sama persis terus-menerus."],
  ["Bank variasi", "Kasus, bukti, dan konteks harus bertambah agar kemampuan tidak dihafal dari satu pola."],
  ["Remedial adaptif", "Bagian lemah muncul lagi sampai skor dan bukti belajar membaik."],
];

export default function AssessmentQualityPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-6 sm:px-6">
      <section className="mx-auto max-w-5xl">
        <Header />
        <div className="mt-10 grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase text-[#2563eb]">Assessment quality</p>
            <h1 className="font-heading mt-3 text-4xl font-black leading-tight sm:text-6xl">
              Tes harus membantu siswa belajar ulang, bukan sekadar menghukum salah.
            </h1>
            <p className="mt-4 font-bold leading-8 text-slate-600">
              BaleBelajar perlu menjaga kualitas soal, variasi kasus, rubrik, dan retake agar hasil belajar benar-benar valid.
            </p>
          </div>
          <div className="rounded-[8px] bg-[#172033] p-6 text-white shadow-[0_10px_0_#020617]">
            <RotateCcw className="text-[#f9c74f]" size={38} />
            <h2 className="font-heading mt-4 text-3xl font-black">Retake yang benar</h2>
            <p className="mt-3 font-bold leading-7 text-white/72">
              Jika siswa salah, sistem memberi materi ulang, contoh baru, lalu pertanyaan serupa dengan konteks berbeda.
            </p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {principles.map(([title, text]) => (
            <article className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm" key={title}>
              <ClipboardCheck className="text-[#2563eb]" size={26} />
              <h2 className="font-heading mt-3 text-2xl font-black">{title}</h2>
              <p className="mt-2 font-bold leading-7 text-slate-600">{text}</p>
            </article>
          ))}
        </div>
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
