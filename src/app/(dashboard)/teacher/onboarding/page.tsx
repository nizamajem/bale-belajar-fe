"use client";

import Link from "next/link";
import { BookOpen, CheckCircle2, ClipboardList, GraduationCap, UsersRound } from "lucide-react";
import { DashboardShell } from "../../_components/dashboard-shell";

const steps = [
  {
    title: "Cek kelas",
    text: "Pastikan kelas dan jumlah siswa sudah benar sebelum memberi misi.",
    href: "/teacher/classrooms",
    icon: UsersRound,
  },
  {
    title: "Pilih asesmen",
    text: "Gunakan asesmen aktif atau minta admin membuat asesmen baru.",
    href: "/teacher/assessments",
    icon: ClipboardList,
  },
  {
    title: "Pantau pengerjaan",
    text: "Lihat siapa belum mulai, sedang mengerjakan, atau sudah selesai.",
    href: "/teacher/dashboard",
    icon: GraduationCap,
  },
  {
    title: "Baca laporan",
    text: "Ambil keputusan remedial berdasarkan bagian kemampuan yang lemah.",
    href: "/teacher/reports",
    icon: BookOpen,
  },
];

export default function TeacherOnboardingPage() {
  return (
    <DashboardShell role="teacher" title="Mulai Pakai BaleBelajar">
      <section className="rounded-[8px] bg-[#172033] p-5 text-white shadow-[0_10px_0_#020617]">
        <p className="text-sm font-black uppercase text-[#f9c74f]">Onboarding guru</p>
        <h1 className="font-heading mt-2 text-3xl font-black sm:text-5xl">
          Empat langkah supaya kelas siap belajar.
        </h1>
        <p className="mt-3 max-w-3xl font-bold leading-7 text-white/72">
          Guru tidak perlu memahami semua fitur sekaligus. Ikuti urutan ini: cek kelas, pilih asesmen, pantau pengerjaan, lalu baca laporan.
        </p>
      </section>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <Link className="interactive-card rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm" href={step.href} key={step.title}>
              <div className="flex items-start gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-[8px] bg-[#eff6ff] text-[#2563eb]">
                  <Icon size={23} />
                </span>
                <div>
                  <p className="text-sm font-black uppercase text-[#2563eb]">Langkah {index + 1}</p>
                  <h2 className="font-heading text-2xl font-black">{step.title}</h2>
                  <p className="mt-2 text-sm font-bold leading-6 text-slate-600">{step.text}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <section className="mt-5 rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-heading text-2xl font-black">Checklist sebelum kelas mulai</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {["Semua siswa punya akun/kode peserta", "Asesmen sudah aktif", "Siswa tahu durasi pengerjaan", "Guru membuka laporan setelah mayoritas selesai"].map((item) => (
            <p className="flex items-center gap-2 rounded-[8px] bg-[#f8fafc] p-4 font-bold text-slate-600" key={item}>
              <CheckCircle2 className="text-[#22c55e]" size={18} />
              {item}
            </p>
          ))}
        </div>
      </section>
    </DashboardShell>
  );
}
