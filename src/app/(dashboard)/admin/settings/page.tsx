"use client";

import { Bell, Database, Globe2, ShieldCheck } from "lucide-react";
import { DashboardShell } from "../../_components/dashboard-shell";

const settings = [
  {
    icon: Globe2,
    title: "Frontend",
    value: process.env.NEXT_PUBLIC_APP_NAME ?? "BaleBelajar",
    text: "Nama aplikasi yang tampil di environment publik.",
  },
  {
    icon: Database,
    title: "API",
    value: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1",
    text: "Endpoint backend yang dipakai browser untuk login dan data dashboard.",
  },
  {
    icon: ShieldCheck,
    title: "Akses",
    value: "Role-based",
    text: "Admin, guru, dan siswa diarahkan ke dashboard sesuai role.",
  },
  {
    icon: Bell,
    title: "Notifikasi",
    value: "Draft",
    text: "Tombol notifikasi sudah tersedia di shell, integrasi event bisa ditambahkan berikutnya.",
  },
];

export default function AdminSettingsPage() {
  return (
    <DashboardShell role="admin" title="Pengaturan">
      <section className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <p className="text-sm font-black uppercase text-[#2563eb]">Konfigurasi</p>
        <h2 className="font-heading text-2xl font-black">Pengaturan platform</h2>
        <p className="mt-2 max-w-2xl font-semibold leading-7 text-slate-600">
          Ringkasan konfigurasi runtime untuk memastikan admin tahu aplikasi terhubung
          ke environment yang benar.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {settings.map(({ icon: Icon, title, value, text }) => (
            <article className="rounded-[8px] bg-[#f8fafc] p-4" key={title}>
              <Icon className="text-[#2563eb]" size={24} />
              <p className="font-heading mt-4 text-xl font-black">{title}</p>
              <p className="mt-1 break-words text-sm font-black text-[#16a34a]">{value}</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{text}</p>
            </article>
          ))}
        </div>
      </section>
    </DashboardShell>
  );
}
