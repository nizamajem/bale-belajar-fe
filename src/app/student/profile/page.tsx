"use client";

import { motion } from "framer-motion";
import { CalendarDays, IdCard, Loader2, LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { StudentShell } from "../_components/student-shell";

type Me = {
  id: string;
  name: string;
  studentProfile: {
    id: string;
    participantCode: string;
    fullName: string;
    academicYear: string;
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
    { label: "Tahun ajaran", value: me?.studentProfile?.academicYear ?? "-", icon: CalendarDays },
  ];

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
          <h1 className="font-heading mt-5 text-3xl font-black">
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
              <p className="font-heading mt-1 text-xl font-black">
                {value}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </StudentShell>
  );
}
