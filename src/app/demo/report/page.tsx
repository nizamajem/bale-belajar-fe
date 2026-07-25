import Link from "next/link";
import { ArrowRight, BookOpen, Printer, UsersRound } from "lucide-react";

export const metadata = {
  title: "Contoh Laporan Kelas",
  description: "Contoh laporan kelas BaleBelajar untuk guru dan sekolah.",
};

const rows = [
  ["Alya", "82", "Fakta vs Dugaan", "Lanjut bab berikutnya"],
  ["Raka", "58", "Bukti kuat/lemah", "Latihan ulang 10 menit"],
  ["Nina", "64", "Timeline", "Baca contoh kasus lagi"],
  ["Dito", "47", "Kesimpulan aman", "Kelompok kecil dengan guru"],
];

export default function DemoReportPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-6 sm:px-6">
      <section className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link className="flex items-center gap-3" href="/welcome">
            <span className="grid size-11 place-items-center rounded-[8px] bg-[#22c55e] text-white shadow-[0_5px_0_#129447]">
              <BookOpen size={23} strokeWidth={3} />
            </span>
            <span className="font-heading text-xl font-black">BaleBelajar</span>
          </Link>
          <button className="inline-flex items-center justify-center gap-2 rounded-[8px] border-2 border-slate-200 bg-white px-4 py-3 font-heading font-black text-slate-700 shadow-[0_5px_0_#d8e2ef]" type="button">
            <Printer size={18} />
            Contoh PDF
          </button>
        </header>

        <div className="mt-8 rounded-[8px] bg-[#172033] p-6 text-white shadow-[0_10px_0_#020617]">
          <p className="text-sm font-black uppercase text-[#f9c74f]">Contoh laporan kelas</p>
          <h1 className="font-heading mt-2 text-4xl font-black">Guru langsung tahu siapa perlu dibantu.</h1>
          <p className="mt-3 max-w-2xl font-bold leading-7 text-white/72">
            Laporan tidak hanya menampilkan skor. Guru melihat bagian lemah, saran latihan ulang, dan prioritas kelas.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <Metric label="Siswa selesai" value="28/32" />
          <Metric label="Rata-rata" value="71%" />
          <Metric label="Perlu latihan ulang" value="9" />
          <Metric label="Prioritas kelas" value="Bukti" />
        </div>

        <section className="mt-6 overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5">
            <div className="flex items-center gap-3">
              <UsersRound className="text-[#2563eb]" size={24} />
              <div>
                <h2 className="font-heading text-2xl font-black">Daftar tindak lanjut siswa</h2>
                <p className="text-sm font-bold text-slate-500">Contoh tampilan untuk guru/wali kelas.</p>
              </div>
            </div>
          </div>
          <div className="grid gap-3 p-4">
            {rows.map(([name, score, weak, action]) => (
              <article className="grid gap-3 rounded-[8px] bg-[#f8fafc] p-4 sm:grid-cols-[1fr_90px_1fr_1fr] sm:items-center" key={name}>
                <p className="font-heading text-lg font-black">{name}</p>
                <p className="rounded-full bg-white px-3 py-2 text-center font-heading font-black">{score}%</p>
                <p className="text-sm font-bold text-slate-600">Perlu bantu: {weak}</p>
                <p className="text-sm font-bold text-[#166534]">{action}</p>
              </article>
            ))}
          </div>
        </section>

        <Link className="mt-6 inline-flex items-center gap-2 rounded-[8px] bg-[#22c55e] px-5 py-4 font-heading font-black text-white shadow-[0_6px_0_#129447]" href="/welcome#pilot">
          Ajukan Pilot Sekolah
          <ArrowRight size={18} />
        </Link>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
      <p className="font-heading text-3xl font-black">{value}</p>
      <p className="mt-1 text-sm font-bold text-slate-500">{label}</p>
    </div>
  );
}
