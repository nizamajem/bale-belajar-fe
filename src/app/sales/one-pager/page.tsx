import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, FileText } from "lucide-react";

export const metadata = {
  title: "One Pager Sekolah",
  description: "Ringkasan penawaran BaleBelajar untuk sekolah.",
};

export default function OnePagerPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-6 sm:px-6">
      <section className="mx-auto max-w-4xl rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <Link className="flex items-center gap-3" href="/welcome">
          <span className="grid size-11 place-items-center rounded-[8px] bg-[#22c55e] text-white shadow-[0_5px_0_#129447]">
            <BookOpen size={23} strokeWidth={3} />
          </span>
          <span className="font-heading text-xl font-black">BaleBelajar</span>
        </Link>

        <FileText className="mt-8 text-[#2563eb]" size={32} />
        <p className="mt-4 text-sm font-black uppercase text-[#2563eb]">Proposal singkat</p>
        <h1 className="font-heading mt-2 text-4xl font-black leading-tight">
          Platform belajar berbasis cita-cita untuk membantu guru membaca kebutuhan siswa.
        </h1>
        <p className="mt-4 font-bold leading-7 text-slate-600">
          BaleBelajar menggabungkan materi pendek, cerita kasus, tes, dan rekomendasi latihan ulang agar siswa tahu harus belajar apa berikutnya.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Box title="Masalah sekolah">
            Guru sering tahu nilai akhir, tetapi butuh waktu lebih lama untuk tahu bagian mana yang benar-benar belum dipahami siswa.
          </Box>
          <Box title="Solusi BaleBelajar">
            Siswa belajar lewat alur sederhana. Guru mendapat laporan kemampuan, siswa prioritas, dan saran latihan ulang.
          </Box>
          <Box title="Pilot awal">
            Mulai dari satu kelas, satu dunia belajar, dan satu laporan evaluasi agar sekolah bisa menilai manfaatnya.
          </Box>
          <Box title="Output pilot">
            Data siswa selesai, rata-rata kelas, bagian lemah, rekomendasi kelompok kecil, dan contoh laporan orang tua.
          </Box>
        </div>

        <div className="mt-6 rounded-[8px] bg-[#172033] p-5 text-white">
          <p className="font-heading text-xl font-black">Cocok untuk</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {["Sekolah SMP/SMA", "Bimbel", "Komunitas belajar"].map((item) => (
              <p className="flex items-center gap-2 text-sm font-bold" key={item}>
                <CheckCircle2 className="text-[#22c55e]" size={18} />
                {item}
              </p>
            ))}
          </div>
        </div>

        <Link className="mt-6 inline-flex items-center gap-2 rounded-[8px] bg-[#22c55e] px-5 py-4 font-heading font-black text-white shadow-[0_6px_0_#129447]" href="/welcome#pilot">
          Ajukan Pilot
          <ArrowRight size={18} />
        </Link>
      </section>
    </main>
  );
}

function Box({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <article className="rounded-[8px] bg-[#f8fafc] p-4">
      <h2 className="font-heading text-xl font-black">{title}</h2>
      <p className="mt-2 text-sm font-bold leading-6 text-slate-600">{children}</p>
    </article>
  );
}
