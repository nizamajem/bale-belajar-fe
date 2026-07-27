"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  CalendarDays,
  CheckCircle2,
  Download,
  GraduationCap,
  IdCard,
  Loader2,
  LucideIcon,
  Presentation,
  School as SchoolIcon,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { apiFetch, ApiError } from "@/lib/api";
import { addRole, UserRole } from "@/lib/auth";
import { StudentShell } from "../_components/student-shell";

type Me = {
  id: string;
  name: string;
  roles: UserRole[];
  studentProfile: {
    id: string;
    participantCode: string | null;
    fullName: string;
    academicYear: string | null;
    gradeLevel: number | null;
    school: { id: string; name: string; city: string } | null;
  } | null;
};

export default function StudentProfilePage() {
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const [addingRole, setAddingRole] = useState(false);
  const [roleError, setRoleError] = useState<string | null>(null);

  function loadMe() {
    return apiFetch<Me>("/auth/me")
      .then(({ data }) => setMe(data))
      .catch(() => setMe(null));
  }

  useEffect(() => {
    loadMe().finally(() => setLoading(false));
  }, []);

  async function handleAddTeacherRole() {
    setAddingRole(true);
    setRoleError(null);
    try {
      await addRole("TEACHER");
      await loadMe();
    } catch (err) {
      setRoleError(err instanceof ApiError ? err.message : "Gagal menambah peran Guru. Coba lagi.");
    } finally {
      setAddingRole(false);
    }
  }

  if (loading) {
    return (
      <StudentShell>
        <div className="grid place-items-center py-20">
          <Loader2 className="animate-spin text-slate-400" size={28} />
        </div>
      </StudentShell>
    );
  }

  const profile: { label: string; value: string; icon: LucideIcon }[] = [
    { label: "Kode peserta", value: me?.studentProfile?.participantCode ?? "-", icon: IdCard },
    {
      label: "Kelas",
      value: me?.studentProfile?.gradeLevel ? `Kelas ${me.studentProfile.gradeLevel}` : "-",
      icon: GraduationCap,
    },
    { label: "Tahun ajaran", value: me?.studentProfile?.academicYear ?? "-", icon: CalendarDays },
  ];
  const school = me?.studentProfile?.school ?? null;

  return (
    <StudentShell>
      <section className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[8px] bg-[#22c55e] p-6 text-white shadow-[0_10px_0_#129447]"
          initial={{ opacity: 0, y: 16 }}
        >
          <div className="grid size-20 place-items-center rounded-full bg-white font-heading text-3xl font-black text-[#16a34a]">
            {(me?.studentProfile?.fullName ?? me?.name ?? "?").charAt(0).toUpperCase()}
          </div>
          <h1 className="font-heading mt-5 text-3xl font-black text-balance-soft">
            {me?.studentProfile?.fullName ?? me?.name ?? "Siswa"}
          </h1>
        </motion.div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {profile.map(({ label, value, icon: Icon }, index) => (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm"
              initial={{ opacity: 0, y: 12 }}
              key={label}
              transition={{ delay: index * 0.04 }}
            >
              <Icon className="mb-4 text-[#2563eb]" size={24} />
              <p className="text-sm font-black uppercase text-slate-400">
                {label}
              </p>
              <p className="font-heading mt-1 break-words text-xl font-black">
                {value}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm"
          initial={{ opacity: 0, y: 12 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <SchoolIcon className="text-[#6d28d9]" size={24} />
              <div>
                <p className="text-sm font-black uppercase text-slate-400">Sekolah</p>
                <p className="font-heading text-lg font-black">
                  {school ? `${school.name} - ${school.city}` : "Belum terhubung"}
                </p>
              </div>
            </div>
            <Link
              className="inline-flex shrink-0 items-center gap-2 rounded-[8px] bg-[#6d28d9] px-4 py-3 font-heading font-black text-white shadow-[0_5px_0_#4c1d95] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
              href="/student/school"
            >
              {school ? "Ubah" : "Hubungkan"}
              <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 overflow-hidden rounded-[8px] border border-[#bfdbfe] bg-white shadow-sm"
          initial={{ opacity: 0, y: 12 }}
          transition={{ delay: 0.12 }}
        >
          <div className="grid gap-0 lg:grid-cols-[1fr_320px]">
            <div className="p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <span className="grid size-12 place-items-center rounded-[8px] bg-[#f59e0b] text-white shadow-[0_5px_0_#d97706]">
                  <Award size={25} />
                </span>
                <div>
                  <p className="text-sm font-black uppercase text-[#2563eb]">Sertifikat Keahlian</p>
                  <h2 className="font-heading text-2xl font-black">Bukti kamu sudah bisa</h2>
                </div>
              </div>
              <p className="mt-3 max-w-2xl font-bold leading-7 text-slate-600">
                Setelah menyelesaikan satu kelas dan lulus proyek akhir, sertifikat bisa tampil di profil.
                Isinya bukan cuma selesai belajar, tetapi juga skill, nilai, dan rekomendasi kelas berikutnya.
              </p>
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                {["Kelas selesai", "Proyek lulus", "Skill tercatat"].map((item) => (
                  <div className="flex items-center gap-2 rounded-[8px] bg-[#f8fafc] px-3 py-3 text-sm font-black text-slate-700" key={item}>
                    <CheckCircle2 className="shrink-0 text-[#16a34a]" size={17} />
                    {item}
                  </div>
                ))}
              </div>
              <Link
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#2563eb] px-4 py-3 font-heading font-black text-white shadow-[0_5px_0_#1d4ed8] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none sm:w-auto"
                href="/demo/certificate"
              >
                <Download size={17} />
                Lihat contoh sertifikat
              </Link>
            </div>

            <div className="bg-[#eff6ff] p-5">
              <div className="rounded-[8px] border-4 border-[#172033] bg-[#fffdf7] p-4 text-center shadow-[0_8px_0_#cbd5e1]">
                <div className="mx-auto grid size-14 place-items-center rounded-full border-4 border-[#f59e0b] text-[#f59e0b]">
                  <ShieldCheck size={28} />
                </div>
                <p className="mt-3 text-[10px] font-black uppercase tracking-[0.16em] text-[#2563eb]">
                  Certificate of Skill
                </p>
                <p className="font-heading mt-2 text-2xl font-black leading-tight">
                  Detektif Pemula
                </p>
                <p className="mt-2 text-xs font-bold text-slate-500">Diberikan kepada</p>
                <p className="font-heading mt-1 text-xl font-black text-[#6d28d9]">
                  {me?.studentProfile?.fullName ?? me?.name ?? "Nama Siswa"}
                </p>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <MiniCertificateStat label="Nilai" value="91" />
                  <MiniCertificateStat label="Modul" value="4/4" />
                  <MiniCertificateStat label="Badge" value="Teliti" />
                </div>
                <p className="mt-4 rounded-[8px] bg-[#f0fdf4] p-3 text-xs font-black text-[#166534]">
                  Siap lanjut ke kelas berikutnya
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {me && !me.roles.includes("TEACHER") ? (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm"
            initial={{ opacity: 0, y: 12 }}
            transition={{ delay: 0.14 }}
          >
            <div className="flex items-center gap-3">
              <Presentation className="text-[#2563eb]" size={24} />
              <div>
                <p className="text-sm font-black uppercase text-slate-400">Peran tambahan</p>
                <p className="font-heading text-lg font-black">Ingin juga jadi Guru?</p>
              </div>
            </div>
            <p className="mt-3 text-sm font-bold leading-6 text-slate-500">
              Kamu bisa punya peran Guru di akun yang sama dan berpindah kapan saja lewat
              menu di header. {school ? "" : "Hubungkan akun ke sekolah dulu supaya bisa ditambahkan."}
            </p>
            {roleError ? (
              <p className="mt-3 rounded-[8px] bg-red-50 px-3 py-2 text-sm font-bold text-red-600">
                {roleError}
              </p>
            ) : null}
            <button
              className="mt-4 inline-flex items-center gap-2 rounded-[8px] bg-[#2563eb] px-4 py-3 font-heading font-black text-white shadow-[0_5px_0_#1d4ed8] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none disabled:opacity-60"
              disabled={addingRole || !school}
              onClick={handleAddTeacherRole}
              type="button"
            >
              {addingRole ? <Loader2 className="animate-spin" size={16} /> : <Presentation size={16} />}
              Tambah Peran Guru
            </button>
          </motion.div>
        ) : null}
      </section>
    </StudentShell>
  );
}

function MiniCertificateStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[8px] bg-white p-2 shadow-sm">
      <p className="font-heading text-lg font-black text-[#172033]">{value}</p>
      <p className="text-[10px] font-black uppercase text-slate-400">{label}</p>
    </div>
  );
}
