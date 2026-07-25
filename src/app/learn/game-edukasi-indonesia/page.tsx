import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, Gamepad2 } from "lucide-react";

export const metadata = {
  title: "Game Edukasi Indonesia untuk SMP dan SMA",
  description: "BaleBelajar adalah game edukasi Indonesia untuk siswa SMP dan SMA yang menggabungkan cita-cita, materi, studi kasus, dan rekomendasi belajar.",
};

export default function GameEduPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-6 sm:px-6">
      <article className="mx-auto max-w-4xl">
        <Link className="flex items-center gap-3" href="/welcome">
          <span className="grid size-11 place-items-center rounded-[8px] bg-[#22c55e] text-white shadow-[0_5px_0_#129447]">
            <BookOpen size={23} strokeWidth={3} />
          </span>
          <span className="font-heading text-xl font-black">BaleBelajar</span>
        </Link>
        <Gamepad2 className="mt-10 text-[#2563eb]" size={38} />
        <h1 className="font-heading mt-4 text-4xl font-black leading-tight sm:text-6xl">
          Game edukasi Indonesia yang membuat siswa belajar dari impiannya.
        </h1>
        <p className="mt-4 font-bold leading-8 text-slate-600">
          Banyak aplikasi belajar langsung memberi soal. BaleBelajar memulai dari cita-cita siswa, lalu mengubah materi menjadi misi, studi kasus, dan rekomendasi belajar.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {["Untuk SMP/SMA", "Materi sebelum tes", "Laporan orang tua/guru"].map((item) => (
            <p className="flex items-center gap-2 rounded-[8px] bg-white p-4 font-bold text-slate-600 shadow-sm" key={item}>
              <CheckCircle2 className="text-[#22c55e]" size={18} />
              {item}
            </p>
          ))}
        </div>
        <Link className="mt-7 inline-flex items-center gap-2 rounded-[8px] bg-[#22c55e] px-5 py-4 font-heading font-black text-white shadow-[0_6px_0_#129447]" href="/demo/detective">
          Coba Demo Detektif
          <ArrowRight size={18} />
        </Link>
      </article>
    </main>
  );
}
