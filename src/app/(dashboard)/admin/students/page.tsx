"use client";

import { motion } from "framer-motion";
import { Download, FileSpreadsheet, Loader2, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { DashboardShell } from "../../_components/dashboard-shell";
import { StudentProfile } from "@/lib/types";

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(true);
      apiFetch<StudentProfile[]>("/students", {
        query: { page: 1, limit: 50, search: search || undefined },
      })
        .then(({ data }) => setStudents(data))
        .catch(() => setStudents([]))
        .finally(() => setLoading(false));
    }, 350);
    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <DashboardShell role="admin" title="Data Siswa">
      <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
        <section className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase text-[#22c55e]">
                Peserta asesmen
              </p>
              <h2 className="font-heading text-2xl font-black">Daftar siswa</h2>
            </div>
            <button className="grid size-11 place-items-center rounded-[8px] border-2 border-slate-200 bg-white text-slate-600 shadow-[0_4px_0_#e2e8f0]">
              <Download size={19} />
            </button>
          </div>

          <label className="mt-5 flex items-center gap-3 rounded-[8px] border-2 border-slate-200 px-4 py-3">
            <Search className="text-slate-400" size={20} />
            <input
              className="w-full bg-transparent font-bold outline-none"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari nama, kode peserta, kelas"
              value={search}
            />
          </label>

          <div className="hide-scrollbar mt-5 overflow-x-auto">
            {loading ? (
              <div className="grid place-items-center py-10">
                <Loader2 className="animate-spin text-slate-400" size={28} />
              </div>
            ) : students.length === 0 ? (
              <p className="py-10 text-center font-bold text-slate-500">
                Belum ada siswa yang cocok.
              </p>
            ) : (
              <table className="w-full min-w-[820px] border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-left text-xs font-black uppercase text-slate-400">
                    <th className="px-4 py-2">Kode</th>
                    <th className="px-4 py-2">Nama</th>
                    <th className="px-4 py-2">Kelas</th>
                    <th className="px-4 py-2">Sekolah</th>
                    <th className="px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, index) => (
                    <motion.tr
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-[#f8fafc]"
                      initial={{ opacity: 0, y: 8 }}
                      key={student.id}
                      transition={{ delay: index * 0.04 }}
                    >
                      <td className="rounded-l-[8px] px-4 py-4 font-heading font-black text-[#2563eb]">
                        {student.participantCode}
                      </td>
                      <td className="px-4 py-4 font-heading font-black">{student.fullName}</td>
                      <td className="px-4 py-4 font-bold text-slate-600">
                        {student.classrooms?.[0]?.classroom.name ?? "-"}
                      </td>
                      <td className="px-4 py-4 font-bold text-slate-600">
                        {student.school?.name ?? "-"}
                      </td>
                      <td className="rounded-r-[8px] px-4 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-black ${
                            student.isActive
                              ? "bg-[#dcfce7] text-[#166534]"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {student.isActive ? "Aktif" : "Nonaktif"}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        <aside className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <FileSpreadsheet className="text-[#22c55e]" size={30} />
          <h2 className="font-heading mt-4 text-2xl font-black">
            Import siswa
          </h2>
          <p className="mt-2 font-semibold leading-7 text-slate-600">
            Template menerima nama lengkap, kode peserta, sekolah, kelas, dan
            tahun ajaran. Fitur import massal sedang dalam pengembangan.
          </p>
          <button
            className="mt-5 w-full cursor-not-allowed rounded-[8px] border-2 border-slate-200 bg-white px-4 py-3 font-heading font-black text-slate-400 shadow-[0_5px_0_#e2e8f0]"
            disabled
            type="button"
          >
            Segera hadir
          </button>
        </aside>
      </div>
    </DashboardShell>
  );
}
