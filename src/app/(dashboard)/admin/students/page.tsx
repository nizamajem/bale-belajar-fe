"use client";

import { motion } from "framer-motion";
import { Download, FileSpreadsheet, Search, Upload } from "lucide-react";
import { DashboardShell } from "../../_components/dashboard-shell";

const students = [
  ["BB-S001", "Aulia Rahman", "VI A", "SDN 1 Mataram", "Aktif"],
  ["BB-S002", "Bima Saputra", "VI A", "SDN 1 Mataram", "Aktif"],
  ["BB-S003", "Citra Lestari", "VI B", "SDN 1 Mataram", "Aktif"],
  ["BB-S004", "Dimas Pratama", "VII A", "SMP Tunas Ilmu", "Aktif"],
];

export default function AdminStudentsPage() {
  return (
    <DashboardShell role="admin" title="Data Siswa">
      <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
        <section className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase text-[#22c55e]">
                Peserta asesmen
              </p>
              <h2 className="font-heading text-2xl font-black">Daftar siswa</h2>
            </div>
            <div className="flex gap-2">
              <button className="grid size-11 place-items-center rounded-[8px] border-2 border-slate-200 bg-white text-slate-600 shadow-[0_4px_0_#e2e8f0]">
                <Download size={19} />
              </button>
              <button className="inline-flex items-center gap-2 rounded-[8px] bg-[#22c55e] px-4 py-3 font-heading font-black text-white shadow-[0_5px_0_#129447]">
                <Upload size={18} />
                Import
              </button>
            </div>
          </div>

          <label className="mt-5 flex items-center gap-3 rounded-[8px] border-2 border-slate-200 px-4 py-3">
            <Search className="text-slate-400" size={20} />
            <input
              className="w-full bg-transparent font-bold outline-none"
              placeholder="Cari nama, kode peserta, kelas"
            />
          </label>

          <div className="mt-5 overflow-x-auto">
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
                {students.map(([code, name, classroom, school, status], index) => (
                  <motion.tr
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#f8fafc]"
                    initial={{ opacity: 0, y: 8 }}
                    key={code}
                    transition={{ delay: index * 0.04 }}
                  >
                    <td className="rounded-l-[8px] px-4 py-4 font-heading font-black text-[#2563eb]">
                      {code}
                    </td>
                    <td className="px-4 py-4 font-heading font-black">{name}</td>
                    <td className="px-4 py-4 font-bold text-slate-600">
                      {classroom}
                    </td>
                    <td className="px-4 py-4 font-bold text-slate-600">
                      {school}
                    </td>
                    <td className="rounded-r-[8px] px-4 py-4">
                      <span className="rounded-full bg-[#dcfce7] px-3 py-1 text-xs font-black text-[#166534]">
                        {status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
          <FileSpreadsheet className="text-[#22c55e]" size={30} />
          <h2 className="font-heading mt-4 text-2xl font-black">
            Import siswa
          </h2>
          <p className="mt-2 font-semibold leading-7 text-slate-600">
            Template menerima nama lengkap, kode peserta, sekolah, kelas, dan
            tahun ajaran. Data belum disimpan sebelum konfirmasi.
          </p>
          <button className="mt-5 w-full rounded-[8px] border-2 border-slate-200 bg-white px-4 py-3 font-heading font-black text-slate-700 shadow-[0_5px_0_#e2e8f0]">
            Unduh template
          </button>
        </aside>
      </div>
    </DashboardShell>
  );
}

