"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CalendarDays, GraduationCap, IdCard, Loader2, LucideIcon, School as SchoolIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { StudentShell } from "../_components/student-shell";

type Me = {
  id: string;
  name: string;
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

  useEffect(() => {
    apiFetch<Me>("/auth/me")
      .then(({ data }) => setMe(data))
      .catch(() => setMe(null))
      .finally(() => setLoading(false));
  }, []);

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
              href="/student/onboarding?step=school"
            >
              {school ? "Ubah" : "Hubungkan"}
              <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </section>
    </StudentShell>
  );
}
