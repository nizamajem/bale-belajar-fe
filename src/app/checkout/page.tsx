"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { FormEvent, useState } from "react";
import { apiFetch, ApiError } from "@/lib/api";
import { trackEvent } from "@/lib/analytics";

export default function CheckoutInterestPage() {
  const [schoolName, setSchoolName] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [plan, setPlan] = useState("Sekolah");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setStatus("loading");
    setFeedback("");
    trackEvent("checkout_interest_submit", { plan });

    try {
      await apiFetch("/public/leads", {
        method: "POST",
        auth: false,
        body: {
          schoolName,
          contactName,
          phone,
          source: "checkout-interest",
          message: `Minat paket: ${plan}. Mohon follow-up harga dan jadwal demo.`,
          website: "",
        },
      });
      setStatus("success");
      setFeedback("Minat paket terkirim. Tim BaleBelajar akan menghubungi Anda dengan opsi harga dan jadwal demo.");
      setSchoolName("");
      setContactName("");
      setPhone("");
    } catch (err) {
      setStatus("error");
      setFeedback(err instanceof ApiError ? err.message : "Data belum terkirim. Coba lagi sebentar.");
    }
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-6 sm:px-6">
      <section className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <Link className="flex items-center gap-3" href="/welcome">
            <span className="grid size-11 place-items-center rounded-[8px] bg-[#22c55e] text-white shadow-[0_5px_0_#129447]">
              <BookOpen size={23} strokeWidth={3} />
            </span>
            <span className="font-heading text-xl font-black">BaleBelajar</span>
          </Link>
          <p className="mt-10 text-sm font-black uppercase text-[#2563eb]">Checkout interest</p>
          <h1 className="font-heading mt-3 text-4xl font-black leading-tight sm:text-6xl">
            Pilih paket dulu, pembayaran bisa disiapkan setelah demo.
          </h1>
          <p className="mt-4 font-bold leading-8 text-slate-600">
            Untuk tahap awal, alur ini menangkap minat paket dan mengirim data ke CRM lead agar tim sales bisa follow-up cepat.
          </p>
          <div className="mt-6 grid gap-3">
            {["Tidak perlu bayar sebelum demo", "Data masuk CRM admin", "Cocok untuk sekolah dan bimbel"].map((item) => (
              <p className="flex items-center gap-2 rounded-[8px] bg-white p-4 font-bold text-slate-600 shadow-sm" key={item}>
                <CheckCircle2 className="text-[#22c55e]" size={18} />
                {item}
              </p>
            ))}
          </div>
        </div>

        <form className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6" onSubmit={submit}>
          <ShieldCheck className="text-[#22c55e]" size={32} />
          <h2 className="font-heading mt-4 text-3xl font-black">Saya tertarik paket BaleBelajar</h2>
          <div className="mt-5 grid gap-3">
            <label className="block">
              <span className="mb-2 block text-sm font-black text-slate-600">Paket</span>
              <select className="w-full rounded-[8px] border-2 border-slate-200 px-4 py-3 font-bold outline-none focus:border-[#22c55e]" onChange={(event) => setPlan(event.target.value)} value={plan}>
                <option>Sekolah</option>
                <option>Premium Siswa</option>
                <option>Pilot 1 Kelas</option>
                <option>Bimbel / Komunitas</option>
              </select>
            </label>
            <Field label="Nama sekolah/organisasi" onChange={setSchoolName} required value={schoolName} />
            <Field label="Nama kontak" onChange={setContactName} required value={contactName} />
            <Field label="Nomor WhatsApp" onChange={setPhone} required value={phone} />
          </div>
          {feedback ? (
            <p className={`mt-4 rounded-[8px] p-4 text-sm font-bold ${status === "success" ? "bg-[#dcfce7] text-[#166534]" : "bg-[#fff1f2] text-[#be123c]"}`}>
              {feedback}
            </p>
          ) : null}
          <button className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#22c55e] px-5 py-4 font-heading font-black text-white shadow-[0_6px_0_#129447]" disabled={status === "loading"} type="submit">
            {status === "loading" ? <Loader2 className="animate-spin" size={18} /> : <ArrowRight size={18} />}
            Kirim minat paket
          </button>
        </form>
      </section>
    </main>
  );
}

function Field({
  label,
  onChange,
  required = false,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  required?: boolean;
  value: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-slate-600">{label}</span>
      <input className="w-full rounded-[8px] border-2 border-slate-200 px-4 py-3 font-bold outline-none focus:border-[#22c55e]" onChange={(event) => onChange(event.target.value)} required={required} value={value} />
    </label>
  );
}
