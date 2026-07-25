import Link from "next/link";
import {
  Award,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Download,
  Medal,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

export const metadata = {
  title: "Contoh Sertifikat BaleBelajar",
  description: "Contoh sertifikat BaleBelajar tiga halaman berisi kelulusan kelas, kurikulum, nilai akhir, peningkatan skill, dan rekomendasi.",
};

const curriculum = [
  ["Fondasi Bukti", "Fakta vs dugaan, sumber bukti, dan cara membaca informasi awal.", "92"],
  ["Timeline Kasus", "Menyusun urutan kejadian dan menemukan bagian yang perlu dicek ulang.", "88"],
  ["Logika Kesimpulan", "Membuat kesimpulan yang adil tanpa menuduh dari asumsi.", "90"],
  ["Studi Kasus Akhir", "Menganalisis kasus lengkap dan menjelaskan alasan dengan rapi.", "94"],
];

const improvements = [
  ["Membedakan fakta dan dugaan", "Naik dari 64% menjadi 92%", "Sangat kuat"],
  ["Memilih bukti paling relevan", "Naik dari 58% menjadi 88%", "Kuat"],
  ["Menyusun kesimpulan aman", "Naik dari 61% menjadi 90%", "Sangat baik"],
];

export default function CertificateDemoPage() {
  return (
    <main className="min-h-screen bg-[#eef4fb] px-4 py-6 text-[#172033] sm:px-6">
      <section className="mx-auto max-w-5xl">
        <div className="certificate-toolbar mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link className="flex items-center gap-3" href="/welcome">
            <span className="grid size-11 place-items-center rounded-[8px] bg-[#22c55e] text-white shadow-[0_5px_0_#129447]">
              <BookOpen size={23} strokeWidth={3} />
            </span>
            <span className="font-heading text-xl font-black">BaleBelajar</span>
          </Link>
          <button className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#2563eb] px-5 py-4 font-heading font-black text-white shadow-[0_6px_0_#1d4ed8]" type="button">
            <Download size={18} />
            Cetak / Simpan PDF
          </button>
        </div>

        <CertificatePageOne />
        <CertificatePageTwo />
        <CertificatePageThree />
      </section>
    </main>
  );
}

function CertificatePageOne() {
  return (
    <article className="certificate-page relative overflow-hidden rounded-[8px] border-[10px] border-[#172033] bg-[#fffdf7] p-6 shadow-[0_16px_0_#cbd5e1] sm:p-10">
      <CertificatePattern />
      <div className="relative z-10 grid min-h-[720px] content-between">
        <header className="flex items-start justify-between gap-4">
          <BrandMark />
          <div className="text-right">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2563eb]">No. BB-DTC-2026-001</p>
            <p className="mt-1 text-sm font-bold text-slate-500">Diterbitkan: 25 Juli 2026</p>
          </div>
        </header>

        <section className="py-10 text-center">
          <Award className="mx-auto text-[#f59e0b]" size={72} />
          <p className="mt-5 text-sm font-black uppercase tracking-[0.24em] text-[#2563eb]">Sertifikat Penyelesaian</p>
          <h1 className="font-heading mx-auto mt-4 max-w-3xl text-5xl font-black leading-tight sm:text-7xl">
            Kelas Detektif Pemula
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg font-bold leading-8 text-slate-600">
            Dengan bangga diberikan kepada
          </p>
          <p className="font-heading mt-3 text-5xl font-black text-[#6d28d9] sm:text-6xl">
            Alya Putri
          </p>
          <p className="mx-auto mt-5 max-w-3xl font-bold leading-8 text-slate-600">
            Telah menyelesaikan perjalanan belajar Detectivia: membaca bukti, membedakan fakta dan dugaan, menyusun timeline, serta membuat kesimpulan yang adil.
          </p>

          <div className="mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
            <ScoreCard label="Nilai akhir" value="91" />
            <ScoreCard label="Predikat" value="Sangat Baik" />
            <ScoreCard label="Level" value="Pembaca Bukti" />
          </div>
        </section>

        <footer className="grid gap-6 sm:grid-cols-[1fr_180px_1fr] sm:items-end">
          <Signature title="Mentor BaleBelajar" name="Tim Kurikulum BaleBelajar" />
          <OfficialSeal />
          <Signature title="Kepala Program" name="BaleBelajar Indonesia" align="right" />
        </footer>
      </div>
    </article>
  );
}

function CertificatePageTwo() {
  return (
    <article className="certificate-page mt-8 rounded-[8px] border border-slate-200 bg-white p-6 shadow-[0_12px_0_#cbd5e1] sm:p-10">
      <header className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <BrandMark />
        <div className="rounded-[8px] bg-[#f0fdf4] px-4 py-3 text-sm font-black text-[#166534]">
          Kurikulum selesai 4/4 modul
        </div>
      </header>

      <section className="mt-8">
        <p className="text-sm font-black uppercase text-[#2563eb]">Halaman 2</p>
        <h2 className="font-heading mt-2 text-4xl font-black">Kurikulum yang diselesaikan</h2>
        <p className="mt-3 max-w-3xl font-bold leading-7 text-slate-600">
          Ringkasan ini membantu siswa, orang tua, dan guru melihat materi apa saja yang sudah selesai serta capaian akhirnya.
        </p>

        <div className="mt-6 grid gap-4">
          {curriculum.map(([title, description, score], index) => (
            <article className="grid gap-4 rounded-[8px] border border-slate-200 bg-[#f8fafc] p-4 sm:grid-cols-[56px_1fr_110px] sm:items-center" key={title}>
              <span className="grid size-12 place-items-center rounded-[8px] bg-[#172033] font-heading text-xl font-black text-white">
                {index + 1}
              </span>
              <div>
                <h3 className="font-heading text-xl font-black">{title}</h3>
                <p className="mt-1 text-sm font-bold leading-6 text-slate-600">{description}</p>
              </div>
              <div className="rounded-[8px] bg-white p-3 text-center shadow-sm">
                <p className="font-heading text-3xl font-black text-[#2563eb]">{score}</p>
                <p className="text-xs font-black uppercase text-slate-400">Nilai</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <SummaryCard icon={<ClipboardCheck size={24} />} title="Final Project" text="Misteri Dokumen Presentasi" />
        <SummaryCard icon={<ShieldCheck size={24} />} title="Status" text="Lulus dan siap lanjut" />
        <SummaryCard icon={<Medal size={24} />} title="Badge" text="Detektif Teliti" />
      </section>
    </article>
  );
}

function CertificatePageThree() {
  return (
    <article className="certificate-page mt-8 rounded-[8px] border border-slate-200 bg-white p-6 shadow-[0_12px_0_#cbd5e1] sm:p-10">
      <header className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <BrandMark />
        <OfficialSeal compact />
      </header>

      <section className="mt-8">
        <p className="text-sm font-black uppercase text-[#6d28d9]">Halaman 3</p>
        <h2 className="font-heading mt-2 text-4xl font-black">Skill improvement dan rekomendasi</h2>
        <p className="mt-3 max-w-3xl font-bold leading-7 text-slate-600">
          Halaman ini dibuat agar sertifikat tidak hanya menjadi hadiah, tetapi juga bukti perkembangan belajar yang bisa dibaca guru dan orang tua.
        </p>

        <div className="mt-6 grid gap-4">
          {improvements.map(([skill, progress, status]) => (
            <article className="rounded-[8px] border border-slate-200 bg-[#f8fafc] p-5" key={skill}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-heading text-xl font-black">{skill}</h3>
                  <p className="mt-1 text-sm font-bold text-slate-500">{progress}</p>
                </div>
                <span className="rounded-full bg-[#dcfce7] px-4 py-2 text-sm font-black text-[#166534]">
                  {status}
                </span>
              </div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-white">
                <div className="h-full rounded-full bg-[#22c55e]" style={{ width: status === "Kuat" ? "88%" : "92%" }} />
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_0.9fr]">
          <section className="rounded-[8px] bg-[#172033] p-5 text-white">
            <TrendingUp className="text-[#f9c74f]" size={30} />
            <h3 className="font-heading mt-3 text-2xl font-black">Rekomendasi berikutnya</h3>
            <div className="mt-4 grid gap-3">
              {[
                "Lanjut ke Kelas Detektif Menengah: Analisis Saksi dan Motif.",
                "Latihan 10 menit per hari untuk memperkuat kesimpulan tertulis.",
                "Coba satu kasus baru setiap minggu agar kemampuan tidak hanya hafalan.",
              ].map((item) => (
                <p className="flex gap-2 rounded-[8px] bg-white/10 p-3 text-sm font-bold leading-6" key={item}>
                  <CheckCircle2 className="mt-0.5 shrink-0 text-[#22c55e]" size={17} />
                  {item}
                </p>
              ))}
            </div>
          </section>
          <section className="rounded-[8px] border border-[#fed7aa] bg-[#fff7ed] p-5">
            <Sparkles className="text-[#c2410c]" size={30} />
            <h3 className="font-heading mt-3 text-2xl font-black text-[#9a3412]">Catatan BaleBelajar</h3>
            <p className="mt-3 font-bold leading-7 text-[#9a3412]">
              Alya menunjukkan perkembangan kuat dalam membaca bukti dan menyusun alasan. Tantangan berikutnya adalah membuat laporan investigasi yang lebih ringkas, runtut, dan mudah dipahami.
            </p>
          </section>
        </div>
      </section>
    </article>
  );
}

function BrandMark() {
  return (
    <div className="flex items-center gap-3">
      <span className="grid size-12 place-items-center rounded-[8px] bg-[#22c55e] text-white shadow-[0_5px_0_#129447]">
        <BookOpen size={26} strokeWidth={3} />
      </span>
      <div>
        <p className="font-heading text-2xl font-black">BaleBelajar</p>
        <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Learning Certificate</p>
      </div>
    </div>
  );
}

function OfficialSeal({ compact = false }: { compact?: boolean }) {
  return (
    <div className={["certificate-seal mx-auto grid place-items-center rounded-full border-4 border-[#2563eb] text-center text-[#2563eb]", compact ? "size-28" : "size-36"].join(" ")}>
      <div className="grid place-items-center">
        <BookOpen size={compact ? 25 : 34} strokeWidth={3} />
        <p className="font-heading mt-1 text-xs font-black uppercase leading-tight">
          Stempel
          <br />
          BaleBelajar
        </p>
      </div>
    </div>
  );
}

function Signature({
  align = "left",
  name,
  title,
}: {
  align?: "left" | "right";
  name: string;
  title: string;
}) {
  return (
    <div className={align === "right" ? "text-right" : "text-left"}>
      <p className="font-heading text-3xl font-black italic text-[#2563eb]">BaleBelajar</p>
      <div className="mt-2 border-t-2 border-slate-300 pt-2">
        <p className="font-heading font-black">{name}</p>
        <p className="text-sm font-bold text-slate-500">{title}</p>
      </div>
    </div>
  );
}

function ScoreCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[8px] border border-slate-200 bg-white/80 p-4 shadow-sm">
      <p className="font-heading text-3xl font-black text-[#172033]">{value}</p>
      <p className="mt-1 text-xs font-black uppercase text-slate-500">{label}</p>
    </div>
  );
}

function SummaryCard({ icon, text, title }: { icon: React.ReactNode; text: string; title: string }) {
  return (
    <div className="rounded-[8px] border border-slate-200 bg-[#f8fafc] p-5">
      <div className="text-[#2563eb]">{icon}</div>
      <p className="font-heading mt-3 text-xl font-black">{title}</p>
      <p className="mt-1 text-sm font-bold text-slate-500">{text}</p>
    </div>
  );
}

function CertificatePattern() {
  return (
    <div aria-hidden className="absolute inset-0 opacity-60">
      <div className="absolute -left-20 -top-20 size-56 rounded-full border-[28px] border-[#f9c74f]" />
      <div className="absolute -bottom-24 -right-16 size-64 rounded-full border-[32px] border-[#bfdbfe]" />
    </div>
  );
}
