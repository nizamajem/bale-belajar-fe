"use client";

import { motion } from "framer-motion";
import { Loader2, Plus, Search, School as SchoolIcon, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { ApiError, apiFetch } from "@/lib/api";
import { DashboardShell } from "../../_components/dashboard-shell";
import { School } from "@/lib/types";

const emptyForm = {
  name: "",
  slug: "",
  npsn: "",
  address: "",
  province: "",
  city: "",
  district: "",
  contactName: "",
  contactPhone: "",
  contactEmail: "",
};

export default function AdminSchoolsPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function loadSchools(searchTerm: string) {
    setLoading(true);
    try {
      const { data } = await apiFetch<School[]>("/schools", {
        query: { page: 1, limit: 50, search: searchTerm || undefined },
      });
      setSchools(data);
    } catch {
      setSchools([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => void loadSchools(search), 350);
    return () => clearTimeout(timeout);
  }, [search]);

  function updateField(field: keyof typeof emptyForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      await apiFetch<School>("/schools", {
        method: "POST",
        body: {
          name: form.name,
          slug: form.slug,
          npsn: form.npsn || undefined,
          address: form.address,
          province: form.province,
          city: form.city,
          district: form.district || undefined,
          contactName: form.contactName || undefined,
          contactPhone: form.contactPhone || undefined,
          contactEmail: form.contactEmail || undefined,
        },
      });
      setShowModal(false);
      setForm(emptyForm);
      await loadSchools(search);
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Gagal menyimpan sekolah.");
    } finally {
      setSubmitting(false);
    }
  }

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
          <button
            className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#2563eb] px-4 py-3 font-heading font-black text-white shadow-[0_5px_0_#1d4ed8] active:translate-y-1 active:shadow-none"
            onClick={() => setShowModal(true)}
            type="button"
          >
            <Plus size={18} />
            Tambah sekolah
          </button>
        </div>

        <label className="mt-5 flex items-center gap-3 rounded-[8px] border-2 border-slate-200 px-4 py-3">
          <Search className="text-slate-400" size={20} />
          <input
            className="w-full bg-transparent font-bold outline-none"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari sekolah, kota, atau status"
            value={search}
          />
        </label>

        <div className="mt-5 overflow-x-auto">
          {loading ? (
            <div className="grid place-items-center py-10">
              <Loader2 className="animate-spin text-slate-400" size={28} />
            </div>
          ) : schools.length === 0 ? (
            <p className="py-10 text-center font-bold text-slate-500">
              Belum ada sekolah yang cocok.
            </p>
          ) : (
            <table className="w-full min-w-[760px] border-separate border-spacing-y-2">
              <thead>
                <tr className="text-left text-xs font-black uppercase text-slate-400">
                  <th className="px-4 py-2">Sekolah</th>
                  <th className="px-4 py-2">Kota</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Provinsi</th>
                </tr>
              </thead>
              <tbody>
                {schools.map((school, index) => (
                  <motion.tr
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#f8fafc]"
                    initial={{ opacity: 0, y: 8 }}
                    key={school.id}
                    transition={{ delay: index * 0.04 }}
                  >
                    <td className="rounded-l-[8px] px-4 py-4">
                      <div className="flex items-center gap-3">
                        <span className="grid size-10 place-items-center rounded-[8px] bg-white text-[#2563eb]">
                          <SchoolIcon size={19} />
                        </span>
                        <span className="font-heading font-black">{school.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-bold text-slate-600">{school.city}</td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-[#eff6ff] px-3 py-1 text-xs font-black text-[#2563eb]">
                        {school.pilotStatus}
                      </span>
                    </td>
                    <td className="rounded-r-[8px] px-4 py-4 font-bold text-slate-600">
                      {school.province}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {showModal ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4">
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg rounded-[8px] bg-white p-6 shadow-xl"
            initial={{ opacity: 0, scale: 0.96 }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-heading text-xl font-black">Tambah sekolah</h3>
              <button onClick={() => setShowModal(false)} type="button">
                <X size={20} />
              </button>
            </div>
            <form className="grid gap-3" onSubmit={handleCreate}>
              <input
                className="rounded-[8px] border-2 border-slate-200 px-4 py-2 font-bold outline-none"
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="Nama sekolah"
                required
                value={form.name}
              />
              <input
                className="rounded-[8px] border-2 border-slate-200 px-4 py-2 font-bold outline-none"
                onChange={(event) => updateField("slug", event.target.value)}
                placeholder="Slug (misal: sdn-1-mataram)"
                required
                value={form.slug}
              />
              <input
                className="rounded-[8px] border-2 border-slate-200 px-4 py-2 font-bold outline-none"
                onChange={(event) => updateField("npsn", event.target.value)}
                placeholder="NPSN (opsional)"
                value={form.npsn}
              />
              <input
                className="rounded-[8px] border-2 border-slate-200 px-4 py-2 font-bold outline-none"
                onChange={(event) => updateField("address", event.target.value)}
                placeholder="Alamat"
                required
                value={form.address}
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  className="rounded-[8px] border-2 border-slate-200 px-4 py-2 font-bold outline-none"
                  onChange={(event) => updateField("city", event.target.value)}
                  placeholder="Kota"
                  required
                  value={form.city}
                />
                <input
                  className="rounded-[8px] border-2 border-slate-200 px-4 py-2 font-bold outline-none"
                  onChange={(event) => updateField("province", event.target.value)}
                  placeholder="Provinsi"
                  required
                  value={form.province}
                />
              </div>
              <input
                className="rounded-[8px] border-2 border-slate-200 px-4 py-2 font-bold outline-none"
                onChange={(event) => updateField("contactName", event.target.value)}
                placeholder="Nama kontak (opsional)"
                value={form.contactName}
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  className="rounded-[8px] border-2 border-slate-200 px-4 py-2 font-bold outline-none"
                  onChange={(event) => updateField("contactPhone", event.target.value)}
                  placeholder="Telepon (opsional)"
                  value={form.contactPhone}
                />
                <input
                  className="rounded-[8px] border-2 border-slate-200 px-4 py-2 font-bold outline-none"
                  onChange={(event) => updateField("contactEmail", event.target.value)}
                  placeholder="Email (opsional)"
                  value={form.contactEmail}
                />
              </div>

              {formError ? (
                <p className="rounded-[8px] bg-[#fff1f2] px-4 py-3 text-sm font-bold text-[#e11d48]">
                  {formError}
                </p>
              ) : null}

              <button
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#2563eb] px-4 py-3 font-heading font-black text-white shadow-[0_5px_0_#1d4ed8] disabled:opacity-70"
                disabled={submitting}
                type="submit"
              >
                {submitting ? <Loader2 className="animate-spin" size={18} /> : null}
                Simpan sekolah
              </button>
            </form>
          </motion.div>
        </div>
      ) : null}
    </DashboardShell>
  );
}
