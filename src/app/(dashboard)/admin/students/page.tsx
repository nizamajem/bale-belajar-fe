"use client";

import { motion } from "framer-motion";
import { Download, Loader2, Plus, Search, UserPlus, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { ApiError, apiFetch } from "@/lib/api";
import { DashboardShell } from "../../_components/dashboard-shell";
import { Classroom, School, StudentProfile } from "@/lib/types";

const emptyForm = {
  schoolId: "",
  classroomId: "",
  participantCode: "",
  studentNumber: "",
  fullName: "",
  phone: "",
  gender: "",
  birthDate: "",
  academicYear: "",
};

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function exportStudents() {
    const rows = students.map((student) =>
      [
        student.participantCode,
        student.fullName,
        student.studentNumber ?? "",
        student.school?.name ?? "",
        student.classrooms?.[0]?.classroom.name ?? "",
        student.academicYear,
        student.isActive ? "Aktif" : "Nonaktif",
      ]
        .map((value) => `"${String(value).replaceAll('"', '""')}"`)
        .join(","),
    );
    const csv = [
      "Kode Peserta,Nama,Nomor Induk,Sekolah,Kelas,Tahun Ajaran,Status",
      ...rows,
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "data-siswa-balebelajar.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  async function loadStudents(searchTerm: string) {
    setLoading(true);
    try {
      const { data } = await apiFetch<StudentProfile[]>("/students", {
        query: { page: 1, limit: 50, search: searchTerm || undefined },
      });
      setStudents(data);
    } catch {
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => void loadStudents(search), 350);
    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    apiFetch<School[]>("/schools", { query: { page: 1, limit: 100 } })
      .then(({ data }) => setSchools(data))
      .catch(() => setSchools([]));
    apiFetch<Classroom[]>("/classrooms", { query: { page: 1, limit: 100 } })
      .then(({ data }) => setClassrooms(data))
      .catch(() => setClassrooms([]));
  }, []);

  function updateField(field: keyof typeof emptyForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      const { data: student } = await apiFetch<StudentProfile>("/students", {
        method: "POST",
        body: {
          schoolId: form.schoolId,
          participantCode: form.participantCode,
          studentNumber: form.studentNumber || undefined,
          fullName: form.fullName,
          phone: form.phone || undefined,
          gender: form.gender || undefined,
          birthDate: form.birthDate || undefined,
          academicYear: form.academicYear,
          isActive: true,
        },
      });

      if (form.classroomId) {
        await apiFetch(`/classrooms/${form.classroomId}/students`, {
          method: "POST",
          body: { studentId: student.id },
        });
      }

      setShowModal(false);
      setForm(emptyForm);
      await loadStudents(search);
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Siswa belum bisa disimpan.");
    } finally {
      setSubmitting(false);
    }
  }

  const availableClassrooms = classrooms.filter((classroom) =>
    form.schoolId ? classroom.schoolId === form.schoolId : true,
  );

  return (
    <DashboardShell role="admin" title="Data Siswa">
      <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
        <section className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase text-[#22c55e]">
                Data dari backend
              </p>
              <h2 className="font-heading text-2xl font-black">Daftar siswa</h2>
            </div>
            <div className="flex gap-2">
              <button
                className="grid size-11 place-items-center rounded-[8px] border-2 border-slate-200 bg-white text-slate-600 shadow-[0_4px_0_#e2e8f0] disabled:opacity-50"
                disabled={students.length === 0}
                onClick={exportStudents}
                title="Unduh data siswa"
                type="button"
              >
                <Download size={19} />
              </button>
              <button
                className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#2563eb] px-4 py-3 font-heading font-black text-white shadow-[0_5px_0_#1d4ed8] active:translate-y-1 active:shadow-none"
                onClick={() => setShowModal(true)}
                type="button"
              >
                <Plus size={18} />
                Tambah siswa
              </button>
            </div>
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
          <UserPlus className="text-[#22c55e]" size={30} />
          <h2 className="font-heading mt-4 text-2xl font-black">
            Alur data siswa
          </h2>
          <p className="mt-2 font-semibold leading-7 text-slate-600">
            Tambahkan siswa melalui form agar data langsung tersimpan ke backend.
            Setelah siswa masuk kelas, guru dapat menugaskan dan memantau asesmen.
          </p>
          <button
            className="mt-5 w-full rounded-[8px] bg-[#22c55e] px-4 py-3 font-heading font-black text-white shadow-[0_5px_0_#129447] transition active:translate-y-1 active:shadow-none"
            onClick={() => setShowModal(true)}
            type="button"
          >
            Tambah siswa baru
          </button>
        </aside>
      </div>

      {showModal ? (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/40 px-4 py-6">
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className="max-h-[calc(100vh-48px)] w-full max-w-2xl overflow-y-auto rounded-[8px] bg-white p-5 shadow-xl sm:p-6"
            initial={{ opacity: 0, scale: 0.96 }}
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="font-heading text-xl font-black">Tambah siswa</h3>
                <p className="text-sm font-bold text-slate-500">
                  Data akan tersimpan ke backend dan bisa dipakai untuk login siswa.
                </p>
              </div>
              <button
                className="grid size-9 shrink-0 place-items-center rounded-[8px] bg-slate-100"
                onClick={() => setShowModal(false)}
                type="button"
              >
                <X size={20} />
              </button>
            </div>

            <form className="grid gap-3" onSubmit={handleCreate}>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-black text-slate-600">Sekolah</span>
                  <select
                    className="w-full rounded-[8px] border-2 border-slate-200 px-4 py-3 font-bold outline-none"
                    onChange={(event) => {
                      updateField("schoolId", event.target.value);
                      updateField("classroomId", "");
                    }}
                    required
                    value={form.schoolId}
                  >
                    <option value="">Pilih sekolah</option>
                    {schools.map((school) => (
                      <option key={school.id} value={school.id}>
                        {school.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-black text-slate-600">Kelas</span>
                  <select
                    className="w-full rounded-[8px] border-2 border-slate-200 px-4 py-3 font-bold outline-none"
                    onChange={(event) => updateField("classroomId", event.target.value)}
                    value={form.classroomId}
                  >
                    <option value="">Belum masuk kelas</option>
                    {availableClassrooms.map((classroom) => (
                      <option key={classroom.id} value={classroom.id}>
                        {classroom.name} - {classroom.academicYear}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Field
                  label="Nama lengkap"
                  name="fullName"
                  onChange={(value) => updateField("fullName", value)}
                  required
                  value={form.fullName}
                />
                <Field
                  label="Kode peserta"
                  name="participantCode"
                  onChange={(value) => updateField("participantCode", value.toUpperCase())}
                  required
                  value={form.participantCode}
                />
                <Field
                  label="Nomor induk"
                  name="studentNumber"
                  onChange={(value) => updateField("studentNumber", value)}
                  value={form.studentNumber}
                />
                <Field
                  label="Tahun ajaran"
                  name="academicYear"
                  onChange={(value) => updateField("academicYear", value)}
                  placeholder="2026/2027"
                  required
                  value={form.academicYear}
                />
                <Field
                  label="Telepon"
                  name="phone"
                  onChange={(value) => updateField("phone", value)}
                  value={form.phone}
                />
                <Field
                  label="Tanggal lahir"
                  name="birthDate"
                  onChange={(value) => updateField("birthDate", value)}
                  type="date"
                  value={form.birthDate}
                />
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-black text-slate-600">Gender</span>
                <select
                  className="w-full rounded-[8px] border-2 border-slate-200 px-4 py-3 font-bold outline-none"
                  onChange={(event) => updateField("gender", event.target.value)}
                  value={form.gender}
                >
                  <option value="">Tidak diisi</option>
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </label>

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
                Simpan siswa
              </button>
            </form>
          </motion.div>
        </div>
      ) : null}
    </DashboardShell>
  );
}

function Field({
  label,
  name,
  onChange,
  placeholder,
  required,
  type = "text",
  value,
}: {
  label: string;
  name: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
  value: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-slate-600">{label}</span>
      <input
        className="w-full rounded-[8px] border-2 border-slate-200 px-4 py-3 font-bold outline-none focus:border-[#2563eb]"
        name={name}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        type={type}
        value={value}
      />
    </label>
  );
}
