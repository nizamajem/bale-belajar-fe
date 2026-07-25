import Link from "next/link";
import { ArrowRight, BookOpen, CalendarDays, CheckCircle2, FileText } from "lucide-react";

export const metadata = {
  title: "Paket Pilot BaleBelajar 14 Hari",
  description: "Paket pilot BaleBelajar untuk sekolah: timeline, output, laporan, dan langkah evaluasi.",
};

const timeline = [
  ["Hari 1", "Setup kelas dan akun siswa"],
  ["Hari 2-4", "Siswa mencoba Dunia Detektif"],
  ["Hari 5-8", "Guru memantau progress dan siswa remedial"],
  ["Hari 9-12", "Kelas menyelesaikan kasus evaluasi"],
  ["Hari 13-14", "Sekolah menerima laporan dan rekomendasi"],
];

export default function PilotPackagePage() {
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
            <p className="text-sm font-black uppercase text-[#2563eb]">Paket pilot sekolah</p>
            <h1 className="font-heading mt-3 text-4xl font-black leading-tight sm:text-6xl">
              14 hari untuk membuktikan apakah BaleBelajar cocok untuk sekolah.
            </h1>
            <p className="mt-4 font-bold leading-8 text-slate-600">
              Pilot dibuat kecil dan terukur: satu kelas, satu dunia belajar, laporan guru, dan rekomendasi tindak lanjut.
            </p>
          </div>
          <div className="rounded-[8px] bg-[#172033] p-6 text-white shadow-[0_10px_0_#020617]">
            <FileText className="text-[#f9c74f]" size={36} />
            <h2 className="font-heading mt-4 text-3xl font-black">Output yang sekolah dapat</h2>
            <div className="mt-4 grid gap-3">
              {["Data completion siswa", "Bagian kemampuan yang lemah", "Daftar siswa prioritas", "Contoh laporan orang tua", "Rekomendasi keputusan lanjut"].map((item) => (
                <p className="flex items-center gap-2 rounded-[8px] bg-white/10 p-3 text-sm font-bold" key={item}>
                  <CheckCircle2 className="text-[#22c55e]" size={17} />
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>

        <section className="mt-6 rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <CalendarDays className="text-[#2563eb]" size={25} />
            <h2 className="font-heading text-2xl font-black">Timeline pilot</h2>
          </div>
          <div className="grid gap-3">
            {timeline.map(([day, text]) => (
              <div className="grid gap-2 rounded-[8px] bg-[#f8fafc] p-4 sm:grid-cols-[120px_1fr]" key={day}>
                <p className="font-heading font-black text-[#2563eb]">{day}</p>
                <p className="font-bold text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <Link className="mt-6 inline-flex items-center gap-2 rounded-[8px] bg-[#22c55e] px-5 py-4 font-heading font-black text-white shadow-[0_6px_0_#129447]" href="/checkout">
          Ajukan paket pilot
          <ArrowRight size={18} />
        </Link>
      </section>
    </main>
  );
}
