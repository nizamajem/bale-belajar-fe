import Link from "next/link";
import { BookOpen, Gift, Share2, Sparkles, UsersRound } from "lucide-react";

export const metadata = {
  title: "Program Ajak Teman BaleBelajar",
  description: "Contoh program referral agar siswa mengajak teman belajar dan membuka item karakter.",
};

export default function ReferralDemoPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-6 sm:px-6">
      <section className="mx-auto max-w-5xl">
        <Link className="flex items-center gap-3" href="/welcome">
          <span className="grid size-11 place-items-center rounded-[8px] bg-[#22c55e] text-white shadow-[0_5px_0_#129447]">
            <BookOpen size={23} strokeWidth={3} />
          </span>
          <span className="font-heading text-xl font-black">BaleBelajar</span>
        </Link>

        <div className="mt-8 grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase text-[#6d28d9]">Growth loop</p>
            <h1 className="font-heading mt-2 text-4xl font-black leading-tight sm:text-6xl">
              Anak bisa ajak teman, sekolah bisa lihat pertumbuhan.
            </h1>
            <p className="mt-4 font-bold leading-8 text-slate-600">
              Referral dibuat sebagai fitur ringan: siswa mendapat item/avatar setelah teman mencoba demo atau menyelesaikan misi pertama.
            </p>
          </div>
          <div className="rounded-[8px] bg-[#172033] p-6 text-white shadow-[0_10px_0_#020617]">
            <Gift className="text-[#f9c74f]" size={38} />
            <h2 className="font-heading mt-4 text-3xl font-black">Kode ajakan: ALYA-DETECTIVE</h2>
            <div className="mt-5 grid gap-3">
              <Step icon={<Share2 size={20} />} title="Bagikan kode" text="Teman mencoba satu kasus tanpa login." />
              <Step icon={<UsersRound size={20} />} title="Teman mulai belajar" text="Jika lanjut daftar, relasi referral tersimpan." />
              <Step icon={<Sparkles size={20} />} title="Buka hadiah" text="Siswa mendapat item visual, bukan keuntungan akademik palsu." />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Step({ icon, text, title }: { icon: React.ReactNode; text: string; title: string }) {
  return (
    <div className="rounded-[8px] bg-white/10 p-4">
      <div className="flex items-center gap-2 text-[#f9c74f]">
        {icon}
        <p className="font-heading font-black text-white">{title}</p>
      </div>
      <p className="mt-1 text-sm font-bold leading-6 text-white/70">{text}</p>
    </div>
  );
}
