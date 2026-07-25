import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, Search, ShieldCheck, Sparkles } from "lucide-react";

export const metadata = {
  title: "Demo Dunia Detektif",
  description: "Coba contoh pengalaman belajar BaleBelajar tanpa login: materi, cerita kasus, latihan bukti, dan hasil.",
};

const steps = [
  {
    number: "1",
    title: "Baca Materi",
    text: "Fakta bisa dicek. Dugaan belum boleh dipakai untuk menuduh.",
    icon: BookOpen,
  },
  {
    number: "2",
    title: "Cerita Kasus",
    text: "File presentasi hilang setelah beberapa siswa memakai komputer.",
    icon: Search,
  },
  {
    number: "3",
    title: "Pilih Bukti",
    text: "Log komputer lebih kuat daripada perasaan seseorang terlihat gugup.",
    icon: ShieldCheck,
  },
  {
    number: "4",
    title: "Lihat Hasil",
    text: "Kamu tahu bagian yang sudah paham dan yang perlu latihan ulang.",
    icon: CheckCircle2,
  },
];

export default function DetectiveDemoPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-6 sm:px-6">
      <section className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between gap-3">
          <Link className="flex items-center gap-3" href="/welcome">
            <span className="grid size-11 place-items-center rounded-[8px] bg-[#22c55e] text-white shadow-[0_5px_0_#129447]">
              <BookOpen size={23} strokeWidth={3} />
            </span>
            <span className="font-heading text-xl font-black">BaleBelajar</span>
          </Link>
          <Link className="rounded-[8px] bg-[#22c55e] px-4 py-3 font-heading font-black text-white shadow-[0_5px_0_#129447]" href="/welcome#pilot">
            Ajukan Pilot
          </Link>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase text-[#2563eb]">Demo tanpa login</p>
            <h1 className="font-heading mt-3 text-4xl font-black leading-tight sm:text-6xl">
              Rasakan satu kasus detektif dalam 60 detik.
            </h1>
            <p className="mt-4 max-w-xl font-bold leading-8 text-slate-600">
              Ini contoh alur BaleBelajar: siswa tidak langsung dites. Mereka belajar dulu, melihat contoh, lalu menjawab kasus.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#2563eb] px-5 py-4 font-heading font-black text-white shadow-[0_6px_0_#1d4ed8]" href="/demo/report">
                Lihat Contoh Laporan
                <ArrowRight size={18} />
              </Link>
              <Link className="inline-flex items-center justify-center rounded-[8px] border-2 border-slate-200 bg-white px-5 py-4 font-heading font-black text-slate-700 shadow-[0_6px_0_#d8e2ef]" href="/student/login">
                Masuk sebagai siswa
              </Link>
            </div>
          </div>

          <div className="rounded-[8px] bg-[#172033] p-5 text-white shadow-[0_10px_0_#020617]">
            <div className="grid gap-5 sm:grid-cols-[180px_1fr] sm:items-center">
              <div className="rounded-[8px] bg-white/8 p-4">
                <div className="detective-avatar mx-auto scale-90" />
                <p className="mt-3 text-center font-heading font-black">Dunia Detektif</p>
              </div>
              <div>
                <p className="text-sm font-black uppercase text-[#f9c74f]">Map belajar</p>
                <div className="mt-4 grid gap-3">
                  {steps.map((step) => {
                    const Icon = step.icon;

                    return (
                    <article className="rounded-[8px] bg-white/10 p-4" key={step.title}>
                      <div className="flex gap-3">
                        <span className="grid size-10 shrink-0 place-items-center rounded-[8px] bg-white font-heading font-black text-[#172033]">
                          {step.number}
                        </span>
                        <div>
                          <h2 className="font-heading text-lg font-black">{step.title}</h2>
                          <p className="mt-1 text-sm font-bold leading-6 text-white/70">{step.text}</p>
                        </div>
                        <Icon className="ml-auto shrink-0 text-[#f9c74f]" size={21} />
                      </div>
                    </article>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-6 rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-black uppercase text-[#6d28d9]">Contoh kasus</p>
          <h2 className="font-heading mt-1 text-2xl font-black">Misteri Dokumen Presentasi</h2>
          <p className="mt-2 font-bold leading-7 text-slate-600">
            File presentasi tim tidak ditemukan. Log komputer menunjukkan file terakhir disimpan pukul 15.20, tetapi pukul 15.45 file hilang. Siswa belajar membedakan fakta, dugaan, dan bukti yang masih perlu dicek.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {["Bukti kuat: log komputer", "Dugaan: seseorang sengaja menghapus", "Langkah aman: cek folder dan riwayat file"].map((item) => (
              <div className="rounded-[8px] bg-[#f8fafc] p-4 font-bold text-slate-600" key={item}>
                <Sparkles className="mb-2 text-[#2563eb]" size={19} />
                {item}
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
