import Link from "next/link";
import { BookOpen, Medal, ShieldCheck, Trophy } from "lucide-react";

export const metadata = {
  title: "Contoh Leaderboard Kelas BaleBelajar",
  description: "Contoh leaderboard kelas yang sehat, fokus pada usaha dan konsistensi, bukan mempermalukan siswa.",
};

const rows = [
  ["1", "Tim Bukti Rapi", "92%", "Rajin 5 hari"],
  ["2", "Tim Timeline", "87%", "Naik 18 poin"],
  ["3", "Tim Kesimpulan", "80%", "Selesai remedial"],
];

export default function LeaderboardDemoPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-6 sm:px-6">
      <section className="mx-auto max-w-4xl">
        <Link className="flex items-center gap-3" href="/welcome">
          <span className="grid size-11 place-items-center rounded-[8px] bg-[#22c55e] text-white shadow-[0_5px_0_#129447]">
            <BookOpen size={23} strokeWidth={3} />
          </span>
          <span className="font-heading text-xl font-black">BaleBelajar</span>
        </Link>

        <div className="mt-8 rounded-[8px] bg-[#172033] p-6 text-white shadow-[0_10px_0_#020617]">
          <Trophy className="text-[#f9c74f]" size={38} />
          <p className="mt-4 text-sm font-black uppercase text-[#f9c74f]">Leaderboard sehat</p>
          <h1 className="font-heading mt-2 text-4xl font-black">Ranking yang menghargai usaha, bukan hanya nilai tertinggi.</h1>
          <p className="mt-3 font-bold leading-7 text-white/72">
            Untuk sekolah, leaderboard lebih aman dibuat berbasis tim, peningkatan, dan konsistensi agar siswa tidak minder.
          </p>
        </div>

        <div className="mt-6 grid gap-3">
          {rows.map(([rank, team, score, note]) => (
            <article className="grid gap-3 rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[70px_1fr_100px_1fr] sm:items-center" key={team}>
              <span className="grid size-12 place-items-center rounded-[8px] bg-[#fff7ed] text-[#c2410c]">
                <Medal size={23} />
              </span>
              <p className="font-heading text-xl font-black">{rank}. {team}</p>
              <p className="font-heading text-lg font-black text-[#2563eb]">{score}</p>
              <p className="flex items-center gap-2 text-sm font-bold text-slate-600">
                <ShieldCheck className="text-[#22c55e]" size={17} />
                {note}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
