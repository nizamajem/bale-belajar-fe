"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Loader2, Sparkles } from "lucide-react";
import { FormEvent, useState } from "react";
import { registerMethods, StudentRegisterMethod } from "@/features/auth/data/auth-dummy-data";
import { registerDummyStudent } from "@/features/auth/services/auth-dummy-service";
import { saveOnboardingState } from "@/features/onboarding/services/onboarding-dummy-service";

export default function RegisterStudentPage() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [method, setMethod] = useState<StudentRegisterMethod>("google");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    try {
      await registerDummyStudent({ nickname, method, contact });
      await saveOnboardingState({ nickname });
      router.push("/onboarding/student/grade");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-5 sm:px-6">
      <section className="mx-auto grid min-h-[calc(100vh-40px)] max-w-5xl gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-[8px] bg-[#22c55e] text-white shadow-[0_6px_0_#129447]">
              <BookOpen size={26} strokeWidth={3} />
            </span>
            <span className="font-heading text-xl font-black">BaleBelajar</span>
          </div>
          <p className="mt-10 text-sm font-black uppercase text-[#2563eb]">Daftar siswa</p>
          <h1 className="font-heading mt-3 text-4xl font-black leading-tight text-[#172033] sm:text-5xl">
            Buat akun cepat. Misi pertama menunggu.
          </h1>
          <p className="mt-4 max-w-xl font-bold leading-8 text-slate-600">
            Kita tidak minta profil panjang dulu. Setelah masuk, kamu pilih level, tujuan, dunia, lalu langsung coba misi.
          </p>
        </div>

        <motion.form
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-xl sm:p-7"
          initial={{ opacity: 0, y: 18 }}
          onSubmit={handleSubmit}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-[#eff6ff] px-3 py-2 text-sm font-black text-[#2563eb]">
            <Sparkles size={17} />
            Mulai dalam 3 menit
          </span>

          <label className="mt-5 block">
            <span className="mb-2 block text-sm font-black text-slate-600">Nama panggilan</span>
            <input
              className="w-full rounded-[8px] border-2 border-slate-200 px-4 py-4 font-heading text-xl font-black outline-none focus:border-[#22c55e] focus:ring-4 focus:ring-[#bbf7d0]"
              onChange={(event) => setNickname(event.target.value)}
              placeholder="Contoh: Dimas"
              required
              value={nickname}
            />
          </label>

          <div className="mt-5">
            <p className="mb-2 text-sm font-black text-slate-600">Metode masuk</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {registerMethods.map((item) => (
                <button
                  className={[
                    "rounded-[8px] border-2 p-3 text-left transition",
                    method === item.id ? "border-[#22c55e] bg-[#f0fdf4]" : "border-slate-200 bg-white",
                  ].join(" ")}
                  key={item.id}
                  onClick={() => setMethod(item.id)}
                  type="button"
                >
                  <span className="font-heading font-black">{item.label}</span>
                  <span className="mt-1 block text-xs font-bold leading-5 text-slate-500">{item.description}</span>
                </button>
              ))}
            </div>
          </div>

          <label className="mt-5 block">
            <span className="mb-2 block text-sm font-black text-slate-600">
              {method === "whatsapp" ? "Nomor WhatsApp" : method === "email" ? "Email" : "Kontak opsional"}
            </span>
            <input
              className="w-full rounded-[8px] border-2 border-slate-200 px-4 py-3 font-bold outline-none focus:border-[#22c55e]"
              onChange={(event) => setContact(event.target.value)}
              placeholder={method === "whatsapp" ? "08xxxxxxxxxx" : method === "email" ? "kamu@email.com" : "Boleh dikosongkan"}
              value={contact}
            />
          </label>

          <button
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#22c55e] px-5 py-4 font-heading font-black text-white shadow-[0_7px_0_#129447] transition active:translate-y-1 active:shadow-none disabled:opacity-60"
            disabled={loading}
            type="submit"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : null}
            Buat Akun Siswa
            {!loading ? <ArrowRight size={18} /> : null}
          </button>
        </motion.form>
      </section>
    </main>
  );
}
