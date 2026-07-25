"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  GraduationCap,
  Loader2,
  Mail,
  Map,
  Phone,
  School,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { FormEvent, useState } from "react";
import { apiFetch, ApiError } from "@/lib/api";

const productFlow = [
  ["1", "Pilih cita-cita", "Siswa memilih jalur seperti detektif, dokter, programmer, atau guru."],
  ["2", "Belajar dulu", "Materi singkat, contoh, dan studi kasus muncul sebelum latihan."],
  ["3", "Kerjakan tes", "Jawaban dinilai untuk membaca skill yang kuat dan yang perlu latihan lagi."],
  ["4", "Dapat rekomendasi", "AI dipakai untuk analisis dan saran belajar, bukan mengganti keputusan guru."],
];

const benefits = [
  {
    title: "Untuk siswa",
    text: "Belajar terasa seperti perjalanan karier, bukan daftar tugas panjang.",
    icon: Sparkles,
  },
  {
    title: "Untuk guru",
    text: "Lebih cepat tahu siapa yang perlu remedial dan materi apa yang harus diulang.",
    icon: GraduationCap,
  },
  {
    title: "Untuk sekolah",
    text: "Progress kelas, asesmen, dan laporan tersimpan rapi di dashboard.",
    icon: School,
  },
];

const pricing = [
  {
    name: "Pilot Sekolah",
    price: "Mulai dari 1 kelas",
    description: "Cocok untuk validasi awal sebelum dipakai satu sekolah.",
    points: ["Akun siswa", "Dunia Detektif", "Laporan guru", "Sesi evaluasi pilot"],
  },
  {
    name: "Paket Sekolah",
    price: "Per siswa / semester",
    description: "Untuk sekolah yang ingin memakai asesmen dan rekomendasi belajar rutin.",
    points: ["Dashboard admin", "Manajemen kelas", "Bank tes", "Kelompok latihan ulang"],
  },
  {
    name: "Custom",
    price: "Sesuai kebutuhan",
    description: "Untuk yayasan, bimbel, komunitas belajar, atau kurikulum khusus.",
    points: ["Kurikulum tambahan", "Integrasi data", "Branding sekolah", "Dukungan prioritas"],
  },
];

const faqs = [
  ["Apakah ini hanya untuk Detektif?", "Tidak. Detectivia dipakai sebagai kurikulum testing. Struktur yang sama bisa dipakai untuk dokter, programmer, guru, matematika, bahasa, dan jalur lain."],
  ["Apakah data belajar tersimpan sungguhan?", "Ya. Halaman produksi diarahkan ke akun, progress, kurikulum, dan hasil yang dibaca dari backend BaleBelajar."],
  ["Kalau siswa salah, apakah bisa belajar ulang?", "Bisa. Hasil tes masuk ke rekomendasi remedial sehingga skill lemah muncul lagi di materi atau tes berikutnya."],
];

export default function WelcomePage() {
  const [schoolName, setSchoolName] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [studentCount, setStudentCount] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  async function submitLead(event: FormEvent) {
    event.preventDefault();
    setStatus("loading");
    setFeedback("");
    try {
      await apiFetch("/public/leads", {
        method: "POST",
        auth: false,
        body: {
          schoolName,
          contactName,
          phone,
          email: email || undefined,
          studentCount: studentCount ? Number(studentCount) : undefined,
          message: message || undefined,
          source: "company-profile",
          website: "",
        },
      });
      setStatus("success");
      setFeedback("Pengajuan pilot terkirim. Tim BaleBelajar akan menghubungi sekolah Anda.");
      setSchoolName("");
      setContactName("");
      setPhone("");
      setEmail("");
      setStudentCount("");
      setMessage("");
    } catch (err) {
      setStatus("error");
      setFeedback(err instanceof ApiError ? err.message : "Pengajuan belum berhasil dikirim. Coba lagi sebentar.");
    }
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] text-[#172033]">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link className="flex min-w-0 items-center gap-3" href="/welcome">
            <span className="grid size-11 place-items-center rounded-[8px] bg-[#22c55e] text-white shadow-[0_6px_0_#129447]">
              <BookOpen size={24} strokeWidth={3} />
            </span>
            <span className="truncate font-heading text-xl font-black">BaleBelajar</span>
          </Link>
          <div className="flex shrink-0 items-center gap-2">
            <Link className="hidden rounded-[8px] px-4 py-3 font-heading font-black text-slate-600 sm:inline-flex" href="/student/login">
              Masuk Siswa
            </Link>
            <Link className="rounded-[8px] bg-[#22c55e] px-4 py-3 font-heading font-black text-white shadow-[0_5px_0_#129447]" href="#pilot">
              Ajukan Pilot
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-14">
        <motion.div animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 16 }}>
          <span className="inline-flex items-center gap-2 rounded-full bg-[#eff6ff] px-3 py-2 text-sm font-black text-[#2563eb]">
            <Sparkles size={17} />
            Platform belajar berbasis cita-cita
          </span>
          <h1 className="font-heading mt-5 text-4xl font-black leading-tight sm:text-6xl">
            Bantu siswa tahu harus belajar apa, kenapa itu penting, dan langkah berikutnya.
          </h1>
          <p className="mt-5 max-w-2xl text-lg font-bold leading-8 text-slate-600">
            BaleBelajar mengubah kurikulum menjadi petualangan karier: siswa belajar materi, membedah studi kasus, mengerjakan tes, lalu mendapat rekomendasi remedial yang bisa dipantau guru.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link className="light-trail inline-flex min-h-12 items-center justify-center gap-2 rounded-[8px] bg-[#22c55e] px-5 py-4 font-heading font-black text-white shadow-[0_7px_0_#129447]" href="/student/login">
              Coba sebagai Siswa
              <ArrowRight size={18} />
            </Link>
            <Link className="inline-flex min-h-12 items-center justify-center rounded-[8px] border-2 border-slate-200 bg-white px-5 py-4 font-heading font-black text-slate-700 shadow-[0_7px_0_#d8e2ef]" href="#pilot">
              Jadwalkan Pilot Sekolah
            </Link>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {["Materi dulu", "Tes adaptif", "Laporan guru"].map((item) => (
              <div className="flex items-center gap-2 rounded-[8px] bg-white px-3 py-3 text-sm font-black text-slate-600 shadow-sm" key={item}>
                <CheckCircle2 className="text-[#22c55e]" size={18} />
                {item}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="game-grid-surface rounded-[8px] bg-[#172033] p-5 text-white shadow-[0_12px_0_#020617]"
          initial={{ opacity: 0, y: 18 }}
          transition={{ delay: 0.08 }}
        >
          <div className="rounded-[8px] bg-white p-4 text-[#172033]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase text-[#6d28d9]">Detectivia</p>
                <h2 className="font-heading text-2xl font-black">Jalur calon detektif</h2>
              </div>
              <span className="game-float grid size-14 place-items-center rounded-[8px] bg-[#fef3c7] text-[#92400e]">
                <Target size={28} />
              </span>
            </div>
            <div className="mt-5 grid gap-3">
              {productFlow.map(([step, title, text]) => (
                <div className="flex gap-3 rounded-[8px] bg-[#f8fafc] p-4" key={step}>
                  <span className="grid size-9 shrink-0 place-items-center rounded-[8px] bg-[#2563eb] font-heading font-black text-white">
                    {step}
                  </span>
                  <span>
                    <span className="block font-heading font-black">{title}</span>
                    <span className="mt-1 block text-sm font-bold leading-6 text-slate-500">{text}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Metric value="4" label="Langkah belajar" />
            <Metric value="AI" label="Analisis rekomendasi" />
            <Metric value="Guru" label="Tetap memegang kendali" />
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-5">
          <p className="text-sm font-black uppercase text-[#2563eb]">Kenapa sekolah butuh ini</p>
          <h2 className="font-heading text-3xl font-black">Produk yang menjelaskan langkah belajar, bukan cuma memberi skor.</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <article className="interactive-card rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm" key={benefit.title}>
                <span className="grid size-12 place-items-center rounded-[8px] bg-[#eff6ff] text-[#2563eb]">
                  <Icon size={24} />
                </span>
                <h3 className="font-heading mt-4 text-xl font-black">{benefit.title}</h3>
                <p className="mt-2 font-bold leading-7 text-slate-600">{benefit.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-5">
          <p className="text-sm font-black uppercase text-[#22c55e]">Paket penggunaan</p>
          <h2 className="font-heading text-3xl font-black">Mulai kecil, ukur hasilnya, lalu perluas.</h2>
          <p className="mt-2 max-w-2xl font-bold leading-7 text-slate-600">
            Sekolah bisa mencoba dari satu kelas dulu. Setelah guru melihat laporan dan siswa nyaman, penggunaan bisa diperluas.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {pricing.map((plan) => (
            <article className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm" key={plan.name}>
              <h3 className="font-heading text-2xl font-black">{plan.name}</h3>
              <p className="mt-2 rounded-full bg-[#eff6ff] px-3 py-2 text-sm font-black text-[#2563eb]">
                {plan.price}
              </p>
              <p className="mt-3 text-sm font-bold leading-6 text-slate-600">{plan.description}</p>
              <div className="mt-4 space-y-2">
                {plan.points.map((point) => (
                  <p className="flex items-center gap-2 text-sm font-bold text-slate-600" key={point}>
                    <CheckCircle2 className="shrink-0 text-[#22c55e]" size={17} />
                    {point}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Untuk sekolah", "Membantu guru membaca kebutuhan belajar siswa tanpa menunggu rekap manual."],
            ["Untuk bimbel", "Membuat latihan terasa lebih personal dan punya alasan yang jelas."],
            ["Untuk komunitas", "Cocok untuk program literasi, logika, dan eksplorasi cita-cita."],
          ].map(([title, text]) => (
            <div className="rounded-[8px] bg-[#172033] p-5 text-white" key={title}>
              <p className="font-heading text-xl font-black">{title}</p>
              <p className="mt-2 text-sm font-bold leading-6 text-white/70">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-4 py-8 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]" id="pilot">
        <div className="rounded-[8px] bg-[#172033] p-6 text-white">
          <Mail className="text-[#f9c74f]" size={28} />
          <h2 className="font-heading mt-4 text-3xl font-black">Ajukan pilot untuk sekolah Anda.</h2>
          <p className="mt-3 font-bold leading-7 text-white/75">
            Cocok untuk sekolah yang ingin mencoba asesmen, kurikulum berbasis cita-cita, dan laporan remedial sebelum membeli paket penuh.
          </p>
          <div className="mt-5 space-y-3 text-sm font-bold leading-6 text-white/80">
            <p className="flex gap-2"><ShieldCheck className="shrink-0 text-[#22c55e]" size={19} /> Data siswa dipisahkan berdasarkan akun dan sekolah.</p>
            <p className="flex gap-2"><BrainCircuit className="shrink-0 text-[#22c55e]" size={19} /> AI digunakan untuk rekomendasi belajar, dengan dashboard guru sebagai kontrol utama.</p>
            <p className="flex gap-2"><Map className="shrink-0 text-[#22c55e]" size={19} /> Kurikulum Detectivia siap dipakai sebagai testing awal.</p>
          </div>
        </div>

        <form className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm" onSubmit={submitLead}>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Nama sekolah" onChange={setSchoolName} required value={schoolName} />
            <Field label="Nama kontak" onChange={setContactName} required value={contactName} />
            <Field label="Nomor WhatsApp" onChange={setPhone} required type="tel" value={phone} />
            <Field label="Email sekolah" onChange={setEmail} type="email" value={email} />
            <Field label="Jumlah siswa" onChange={setStudentCount} type="number" value={studentCount} />
          </div>
          <label className="mt-3 block">
            <span className="mb-2 block text-sm font-black text-slate-600">Kebutuhan sekolah</span>
            <textarea
              className="min-h-28 w-full rounded-[8px] border-2 border-slate-200 px-4 py-3 font-bold outline-none focus:border-[#22c55e]"
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Contoh: ingin pilot untuk kelas 7 dan melihat laporan remedial."
              value={message}
            />
          </label>
          {feedback ? (
            <p className={`mt-3 rounded-[8px] p-4 text-sm font-bold ${status === "success" ? "bg-[#dcfce7] text-[#166534]" : "bg-[#fff1f2] text-[#be123c]"}`}>
              {feedback}
            </p>
          ) : null}
          <button
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#22c55e] px-5 py-4 font-heading font-black text-white shadow-[0_7px_0_#129447] disabled:opacity-70"
            disabled={status === "loading"}
            type="submit"
          >
            {status === "loading" ? <Loader2 className="animate-spin" size={19} /> : <Phone size={19} />}
            Kirim Pengajuan Pilot
          </button>
        </form>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-black uppercase text-[#6d28d9]">FAQ</p>
          <div className="mt-4 grid gap-3">
            {faqs.map(([question, answer]) => (
              <article className="rounded-[8px] bg-[#f8fafc] p-4" key={question}>
                <h3 className="font-heading font-black">{question}</h3>
                <p className="mt-2 text-sm font-bold leading-6 text-slate-600">{answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white px-4 py-6 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 text-sm font-bold text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>BaleBelajar - asesmen, kurikulum, dan rekomendasi belajar untuk sekolah.</p>
          <div className="flex gap-4">
            <Link href="/privacy">Privasi</Link>
            <Link href="/terms">Ketentuan</Link>
            <a href="https://wa.me/628111111111" rel="noreferrer" target="_blank">WhatsApp</a>
            <Link href="/staff/login">Masuk Platform</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-[8px] bg-white/10 p-4 text-center">
      <p className="font-heading text-2xl font-black">{value}</p>
      <p className="mt-1 text-xs font-black uppercase text-white/60">{label}</p>
    </div>
  );
}

function Field({
  label,
  onChange,
  required = false,
  type = "text",
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
  value: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-slate-600">{label}</span>
      <input
        className="w-full rounded-[8px] border-2 border-slate-200 px-4 py-3 font-bold outline-none focus:border-[#22c55e]"
        onChange={(event) => onChange(event.target.value)}
        required={required}
        type={type}
        value={value}
      />
    </label>
  );
}
