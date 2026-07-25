"use client";

import { ArrowLeft, CheckCircle2, Loader2, Search, School as SchoolIcon, XCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch, ApiError } from "@/lib/api";
import { SchoolSearchResult } from "@/lib/types";
import { StudentShell } from "../_components/student-shell";

export default function StudentSchoolPage() {
  const [search, setSearch] = useState("");
  const [schools, setSchools] = useState<SchoolSearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoading(true);
      apiFetch<SchoolSearchResult[]>("/student/account/schools", {
        query: { search },
      })
        .then(({ data }) => setSchools(data))
        .catch(() => setSchools([]))
        .finally(() => setLoading(false));
    }, 250);

    return () => window.clearTimeout(timer);
  }, [search]);

  async function linkSchool(schoolId: string) {
    setSavingId(schoolId);
    setFeedback("");
    try {
      await apiFetch("/student/account/school-link", {
        method: "POST",
        body: { schoolId },
      });
      setFeedback("Akunmu sudah terhubung ke sekolah. Data kelas dan kode peserta akan mengikuti pengaturan sekolah.");
    } catch (err) {
      setFeedback(err instanceof ApiError ? err.message : "Sekolah belum bisa dihubungkan. Coba lagi.");
    } finally {
      setSavingId(null);
    }
  }

  async function unlinkSchool() {
    setSavingId("unlink");
    setFeedback("");
    try {
      await apiFetch("/student/account/school-link", { method: "DELETE" });
      setFeedback("Koneksi sekolah sudah dilepas.");
    } catch (err) {
      setFeedback(err instanceof ApiError ? err.message : "Koneksi sekolah belum bisa dilepas.");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <StudentShell>
      <section className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <Link className="inline-flex items-center gap-2 font-heading font-black text-slate-500" href="/student/profile">
          <ArrowLeft size={18} />
          Kembali ke profil
        </Link>

        <div className="mt-5 rounded-[8px] bg-[#172033] p-6 text-white shadow-[0_9px_0_#020617]">
          <SchoolIcon className="text-[#f9c74f]" size={30} />
          <h1 className="font-heading mt-4 text-3xl font-black">Hubungkan akun ke sekolah</h1>
          <p className="mt-2 font-bold leading-7 text-white/75">
            Pilih sekolah agar guru bisa melihat perjalanan belajarmu, memberi tes, dan mengatur kelasmu.
          </p>
        </div>

        <div className="mt-5 rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
          <label className="block">
            <span className="mb-2 block text-sm font-black text-slate-600">Cari nama sekolah atau kota</span>
            <span className="flex items-center gap-3 rounded-[8px] border-2 border-slate-200 px-4 py-3">
              <Search className="text-slate-400" size={20} />
              <input
                className="w-full border-0 bg-transparent font-bold outline-none"
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Contoh: Mataram"
                value={search}
              />
            </span>
          </label>

          {feedback ? (
            <p className="mt-4 rounded-[8px] bg-[#eff6ff] p-4 text-sm font-bold leading-6 text-[#1d4ed8]">
              {feedback}
            </p>
          ) : null}

          <div className="mt-4 grid gap-3">
            {loading ? (
              <div className="grid place-items-center py-8">
                <Loader2 className="animate-spin text-slate-400" size={26} />
              </div>
            ) : schools.length === 0 ? (
              <p className="rounded-[8px] bg-[#f8fafc] p-4 text-sm font-bold text-slate-500">
                Sekolah belum ditemukan. Coba kata kunci lain atau minta admin sekolah mendaftarkan sekolah.
              </p>
            ) : (
              schools.map((school) => (
                <article className="flex flex-col gap-3 rounded-[8px] bg-[#f8fafc] p-4 sm:flex-row sm:items-center sm:justify-between" key={school.id}>
                  <div>
                    <h2 className="font-heading text-lg font-black">{school.name}</h2>
                    <p className="text-sm font-bold text-slate-500">
                      {school.city}, {school.province}
                    </p>
                  </div>
                  <button
                    className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#22c55e] px-4 py-3 font-heading font-black text-white shadow-[0_5px_0_#129447] disabled:opacity-60"
                    disabled={savingId !== null}
                    onClick={() => linkSchool(school.id)}
                    type="button"
                  >
                    {savingId === school.id ? <Loader2 className="animate-spin" size={17} /> : <CheckCircle2 size={17} />}
                    Hubungkan
                  </button>
                </article>
              ))
            )}
          </div>

          <button
            className="mt-5 inline-flex items-center gap-2 rounded-[8px] border-2 border-slate-200 bg-white px-4 py-3 font-heading font-black text-slate-500"
            disabled={savingId !== null}
            onClick={unlinkSchool}
            type="button"
          >
            {savingId === "unlink" ? <Loader2 className="animate-spin" size={17} /> : <XCircle size={17} />}
            Lepas koneksi sekolah
          </button>
        </div>
      </section>
    </StudentShell>
  );
}
