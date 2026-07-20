"use client";

import { motion } from "framer-motion";
import { BookOpen, GraduationCap, IdCard, School, Star } from "lucide-react";
import { StudentShell } from "../_components/student-shell";

const profile = [
  ["Kode peserta", "BB-S001", IdCard],
  ["Sekolah", "SDN 1 Mataram", School],
  ["Kelas", "VI A", GraduationCap],
  ["Materi aktif", "Matematika", BookOpen],
];

export default function StudentProfilePage() {
  return (
    <StudentShell>
      <section className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[8px] bg-[#22c55e] p-6 text-white shadow-[0_10px_0_#129447]"
          initial={{ opacity: 0, y: 16 }}
        >
          <div className="grid size-20 place-items-center rounded-full bg-white font-heading text-3xl font-black text-[#16a34a]">
            A
          </div>
          <h1 className="font-heading mt-5 text-3xl font-black">
            Aulia Rahman
          </h1>
          <p className="mt-2 font-bold text-white/86">
            Kamu sudah menjaga streak belajar selama 7 hari.
          </p>
        </motion.div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {profile.map(([label, value, Icon], index) => (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm"
              initial={{ opacity: 0, y: 12 }}
              key={label as string}
              transition={{ delay: index * 0.04 }}
            >
              <Icon className="mb-4 text-[#2563eb]" size={24} />
              <p className="text-sm font-black uppercase text-slate-400">
                {label as string}
              </p>
              <p className="font-heading mt-1 text-xl font-black">
                {value as string}
              </p>
            </motion.div>
          ))}
        </div>

        <section className="mt-5 rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <Star className="text-[#f9c74f]" fill="#f9c74f" size={24} />
            <h2 className="font-heading text-xl font-black">Capaian</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {["Rajin 7 hari", "2 misi selesai", "5 kompetensi dikuasai"].map(
              (item) => (
                <div
                  className="rounded-[8px] bg-[#f8fafc] p-4 text-center font-heading font-black"
                  key={item}
                >
                  {item}
                </div>
              ),
            )}
          </div>
        </section>
      </section>
    </StudentShell>
  );
}

