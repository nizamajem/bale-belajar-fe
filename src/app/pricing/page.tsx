import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, School, Sparkles, UsersRound } from "lucide-react";

export const metadata = {
  title: "Harga BaleBelajar",
  description: "Pilihan paket BaleBelajar untuk siswa, orang tua, sekolah, bimbel, dan komunitas belajar.",
};

const plans = [
  {
    name: "Gratis",
    price: "Rp0",
    target: "Untuk coba dulu",
    icon: Sparkles,
    points: ["1 demo dunia belajar", "Contoh kasus detektif", "Hasil sederhana", "Cocok untuk melihat alur"],
  },
  {
    name: "Premium Siswa",
    price: "Mulai dari Rp25.000/bulan",
    target: "Untuk belajar rutin di rumah",
    icon: UsersRound,
    points: ["Semua dunia belajar bertahap", "Rekomendasi latihan ulang", "Badge, streak, dan sertifikat", "Ringkasan untuk orang tua"],
  },
  {
    name: "Sekolah",
    price: "Per siswa / semester",
    target: "Untuk kelas dan guru",
    icon: School,
    points: ["Dashboard guru dan admin", "Manajemen kelas", "Laporan remedial", "Pilot 1 kelas sebelum perluasan"],
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-6 sm:px-6">
      <section className="mx-auto max-w-6xl">
        <Header />

        <div className="mt-10 max-w-3xl">
          <p className="text-sm font-black uppercase text-[#2563eb]">Harga sederhana</p>
          <h1 className="font-heading mt-3 text-4xl font-black leading-tight sm:text-6xl">
            Mulai gratis, bayar saat hasil belajarnya sudah terlihat.
          </h1>
          <p className="mt-4 font-bold leading-8 text-slate-600">
            BaleBelajar dirancang agar sekolah dan orang tua bisa mencoba alurnya dulu: belajar dari impian, materi singkat, tes, lalu rekomendasi yang mudah dipahami.
          </p>
        </div>

        <div className="mt-7 grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <article className="interactive-card rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm" key={plan.name}>
                <span className="grid size-12 place-items-center rounded-[8px] bg-[#eff6ff] text-[#2563eb]">
                  <Icon size={24} />
                </span>
                <h2 className="font-heading mt-4 text-2xl font-black">{plan.name}</h2>
                <p className="mt-2 rounded-full bg-[#f0fdf4] px-3 py-2 text-sm font-black text-[#166534]">{plan.price}</p>
                <p className="mt-3 font-bold text-slate-500">{plan.target}</p>
                <div className="mt-4 space-y-3">
                  {plan.points.map((point) => (
                    <p className="flex gap-2 text-sm font-bold leading-6 text-slate-600" key={point}>
                      <CheckCircle2 className="mt-0.5 shrink-0 text-[#22c55e]" size={17} />
                      {point}
                    </p>
                  ))}
                </div>
              </article>
            );
          })}
        </div>

        <section className="mt-7 rounded-[8px] bg-[#172033] p-6 text-white shadow-[0_10px_0_#020617]">
          <p className="text-sm font-black uppercase text-[#f9c74f]">Untuk target besar</p>
          <h2 className="font-heading mt-2 text-3xl font-black">Model growth: demo gratis, premium siswa, lalu paket sekolah.</h2>
          <p className="mt-3 max-w-3xl font-bold leading-7 text-white/72">
            Strategi ini membuat produk mudah dicoba, mudah dibagikan, dan punya alasan bayar yang jelas: laporan perkembangan dan rekomendasi belajar yang membantu anak.
          </p>
        </section>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#22c55e] px-5 py-4 font-heading font-black text-white shadow-[0_6px_0_#129447]" href="/demo/detective">
            Coba Demo Gratis
            <ArrowRight size={18} />
          </Link>
          <Link className="inline-flex items-center justify-center rounded-[8px] border-2 border-slate-200 bg-white px-5 py-4 font-heading font-black text-slate-700 shadow-[0_6px_0_#d8e2ef]" href="/checkout">
            Minat paket
          </Link>
          <Link className="inline-flex items-center justify-center rounded-[8px] border-2 border-slate-200 bg-white px-5 py-4 font-heading font-black text-slate-700 shadow-[0_6px_0_#d8e2ef]" href="/sales/pilot-package">
            Paket Pilot 14 Hari
          </Link>
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
