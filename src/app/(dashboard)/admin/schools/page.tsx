"use client";

import { motion } from "framer-motion";
import { Plus, Search, School } from "lucide-react";
import { DashboardShell } from "../../_components/dashboard-shell";

const schools = [
  ["SDN 1 Mataram", "Mataram", "ACTIVE_PILOT", "412 siswa"],
  ["SMP Tunas Ilmu", "Lombok Barat", "DEMO", "286 siswa"],
  ["SDN 4 Ampenan", "Mataram", "CONTACTED", "198 siswa"],
  ["MI Nurul Hikmah", "Lombok Tengah", "PROSPECT", "154 siswa"],
];

export default function AdminSchoolsPage() {
  return (
    <DashboardShell role="admin" title="Data Sekolah">
      <section className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase text-[#2563eb]">
              Master data
            </p>
            <h2 className="font-heading text-2xl font-black">Sekolah pilot</h2>
          </div>
          <button className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#2563eb] px-4 py-3 font-heading font-black text-white shadow-[0_5px_0_#1d4ed8] active:translate-y-1 active:shadow-none">
            <Plus size={18} />
            Tambah sekolah
          </button>
        </div>

        <label className="mt-5 flex items-center gap-3 rounded-[8px] border-2 border-slate-200 px-4 py-3">
          <Search className="text-slate-400" size={20} />
          <input
            className="w-full bg-transparent font-bold outline-none"
            placeholder="Cari sekolah, kota, atau status"
          />
        </label>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[760px] border-separate border-spacing-y-2">
            <thead>
              <tr className="text-left text-xs font-black uppercase text-slate-400">
                <th className="px-4 py-2">Sekolah</th>
                <th className="px-4 py-2">Kota</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Siswa</th>
                <th className="px-4 py-2 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {schools.map(([name, city, status, students], index) => (
                <motion.tr
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#f8fafc]"
                  initial={{ opacity: 0, y: 8 }}
                  key={name}
                  transition={{ delay: index * 0.04 }}
                >
                  <td className="rounded-l-[8px] px-4 py-4">
                    <div className="flex items-center gap-3">
                      <span className="grid size-10 place-items-center rounded-[8px] bg-white text-[#2563eb]">
                        <School size={19} />
                      </span>
                      <span className="font-heading font-black">{name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 font-bold text-slate-600">{city}</td>
                  <td className="px-4 py-4">
                    <span className="rounded-full bg-[#eff6ff] px-3 py-1 text-xs font-black text-[#2563eb]">
                      {status}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-bold text-slate-600">
                    {students}
                  </td>
                  <td className="rounded-r-[8px] px-4 py-4 text-right">
                    <button className="font-heading font-black text-[#2563eb]">
                      Detail
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </DashboardShell>
  );
}

