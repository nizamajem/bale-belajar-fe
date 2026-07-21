"use client";

import { motion } from "framer-motion";
import { CalendarClock, Loader2, Plus, Send, Settings2, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { ApiError, apiFetch } from "@/lib/api";
import { DashboardShell } from "../../_components/dashboard-shell";
import { Assessment, Classroom, Question, Subject } from "@/lib/types";

const emptyForm = {
  title: "",
  slug: "",
  subjectId: "",
  gradeLevel: "6",
  description: "",
  durationMinutes: "30",
};

export default function AdminAssessmentsPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [configAssessment, setConfigAssessment] = useState<Assessment | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [selectedQuestionId, setSelectedQuestionId] = useState("");
  const [selectedClassroomId, setSelectedClassroomId] = useState("");
  const [orderNumber, setOrderNumber] = useState("1");
  const [submitting, setSubmitting] = useState(false);
  const [configSubmitting, setConfigSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);

  async function loadAssessments() {
    setLoading(true);
    try {
      const { data } = await apiFetch<Assessment[]>("/assessments", {
        query: { page: 1, limit: 50 },
      });
      setAssessments(data);
    } catch {
      setAssessments([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadAssessments();
    void loadSupportingData();
  }, []);

  async function loadSupportingData() {
    const [subjectsRes, questionsRes, classroomsRes] = await Promise.allSettled([
      apiFetch<Subject[]>("/subjects", { query: { page: 1, limit: 100 } }),
      apiFetch<Question[]>("/questions", { query: { page: 1, limit: 100 } }),
      apiFetch<Classroom[]>("/classrooms", { query: { page: 1, limit: 100 } }),
    ]);
    setSubjects(subjectsRes.status === "fulfilled" ? subjectsRes.value.data : []);
    setQuestions(questionsRes.status === "fulfilled" ? questionsRes.value.data : []);
    setClassrooms(classroomsRes.status === "fulfilled" ? classroomsRes.value.data : []);
  }

  function updateField(field: keyof typeof emptyForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      await apiFetch<Assessment>("/assessments", {
        method: "POST",
        body: {
          title: form.title,
          slug: form.slug,
          subjectId: form.subjectId,
          gradeLevel: Number(form.gradeLevel),
          description: form.description || undefined,
          durationMinutes: form.durationMinutes ? Number(form.durationMinutes) : undefined,
        },
      });
      setShowModal(false);
      setForm(emptyForm);
      await loadAssessments();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Gagal membuat asesmen.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePublish(id: string) {
    setPublishingId(id);
    try {
      await apiFetch<Assessment>(`/assessments/${id}/publish`, { method: "POST" });
      await loadAssessments();
    } catch (err) {
      window.alert(err instanceof ApiError ? err.message : "Gagal mempublikasikan asesmen.");
    } finally {
      setPublishingId(null);
    }
  }

  function openConfig(assessment: Assessment) {
    setConfigAssessment(assessment);
    setConfigError(null);
    setSelectedQuestionId("");
    setSelectedClassroomId("");
    setOrderNumber(String((assessment._count?.questions ?? 0) + 1));
  }

  async function addQuestionToAssessment() {
    if (!configAssessment || !selectedQuestionId) return;
    setConfigError(null);
    setConfigSubmitting(true);
    try {
      await apiFetch(`/assessments/${configAssessment.id}/questions`, {
        method: "POST",
        body: {
          questionId: selectedQuestionId,
          orderNumber: Number(orderNumber),
        },
      });
      setSelectedQuestionId("");
      await loadAssessments();
    } catch (err) {
      setConfigError(err instanceof ApiError ? err.message : "Soal belum bisa ditambahkan.");
    } finally {
      setConfigSubmitting(false);
    }
  }

  async function addClassroomToAssessment() {
    if (!configAssessment || !selectedClassroomId) return;
    setConfigError(null);
    setConfigSubmitting(true);
    try {
      await apiFetch(`/assessments/${configAssessment.id}/classrooms`, {
        method: "POST",
        body: { classroomId: selectedClassroomId },
      });
      setSelectedClassroomId("");
      await loadAssessments();
    } catch (err) {
      setConfigError(err instanceof ApiError ? err.message : "Kelas belum bisa ditambahkan.");
    } finally {
      setConfigSubmitting(false);
    }
  }

  const compatibleQuestions = questions.filter((question) =>
    configAssessment
      ? question.subjectId === configAssessment.subjectId && question.status === "ACTIVE"
      : question.status === "ACTIVE",
  );

  return (
    <DashboardShell role="admin" title="Manajemen Asesmen">
      <section className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase text-[#2563eb]">
              Assessment engine
            </p>
            <h2 className="font-heading text-2xl font-black">Daftar asesmen</h2>
          </div>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#2563eb] px-4 py-3 font-heading font-black text-white shadow-[0_5px_0_#1d4ed8]"
            onClick={() => setShowModal(true)}
            type="button"
          >
            <Plus size={18} />
            Buat asesmen
          </button>
        </div>

        {loading ? (
          <div className="grid place-items-center py-10">
            <Loader2 className="animate-spin text-slate-400" size={28} />
          </div>
        ) : assessments.length === 0 ? (
          <p className="py-10 text-center font-bold text-slate-500">
            Belum ada asesmen dibuat.
          </p>
        ) : (
          <div className="mt-5 grid gap-4">
            {assessments.map((assessment, index) => (
              <motion.article
                animate={{ opacity: 1, y: 0 }}
                className="rounded-[8px] bg-[#f8fafc] p-4 sm:p-5"
                initial={{ opacity: 0, y: 10 }}
                key={assessment.id}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex min-w-0 gap-4">
                    <span className="grid size-12 shrink-0 place-items-center rounded-[8px] bg-white text-[#2563eb]">
                      <CalendarClock size={23} />
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-heading text-xl font-black text-balance-soft">{assessment.title}</h3>
                      <p className="mt-1 font-bold text-slate-500">
                        {assessment.subject?.name ?? "-"} - {assessment._count?.questions ?? 0} soal - {assessment._count?.classrooms ?? 0} kelas
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-600">
                      {assessment.status}
                    </span>
                    <button
                      className="inline-flex items-center gap-2 rounded-[8px] border-2 border-slate-200 bg-white px-4 py-3 font-heading font-black text-slate-600 shadow-[0_5px_0_#e2e8f0] active:translate-y-1 active:shadow-none"
                      onClick={() => openConfig(assessment)}
                      type="button"
                    >
                      <Settings2 size={17} />
                      Atur isi
                    </button>
                    {assessment.status === "DRAFT" ? (
                      <button
                        className="inline-flex items-center gap-2 rounded-[8px] bg-[#22c55e] px-4 py-3 font-heading font-black text-white shadow-[0_5px_0_#129447] disabled:opacity-70"
                        disabled={publishingId === assessment.id}
                        onClick={() => handlePublish(assessment.id)}
                        type="button"
                      >
                        {publishingId === assessment.id ? (
                          <Loader2 className="animate-spin" size={17} />
                        ) : (
                          <Send size={17} />
                        )}
                        Publikasi
                      </button>
                    ) : null}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>

      {showModal ? (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/40 px-4 py-6">
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className="max-h-[calc(100vh-48px)] w-full max-w-lg overflow-y-auto rounded-[8px] bg-white p-5 shadow-xl sm:p-6"
            initial={{ opacity: 0, scale: 0.96 }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-heading text-xl font-black">Buat asesmen</h3>
              <button onClick={() => setShowModal(false)} type="button">
                <X size={20} />
              </button>
            </div>
            <form className="grid gap-3" onSubmit={handleCreate}>
              <input
                className="rounded-[8px] border-2 border-slate-200 px-4 py-2 font-bold outline-none"
                onChange={(event) => updateField("title", event.target.value)}
                placeholder="Judul asesmen"
                required
                value={form.title}
              />
              <input
                className="rounded-[8px] border-2 border-slate-200 px-4 py-2 font-bold outline-none"
                onChange={(event) => updateField("slug", event.target.value)}
                placeholder="Slug asesmen"
                required
                value={form.slug}
              />
              <select
                className="rounded-[8px] border-2 border-slate-200 px-4 py-2 font-bold outline-none"
                onChange={(event) => updateField("subjectId", event.target.value)}
                required
                value={form.subjectId}
              >
                <option value="">Pilih mata pelajaran</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  className="rounded-[8px] border-2 border-slate-200 px-4 py-2 font-bold outline-none"
                  min={1}
                  max={12}
                  onChange={(event) => updateField("gradeLevel", event.target.value)}
                  placeholder="Tingkat kelas"
                  required
                  type="number"
                  value={form.gradeLevel}
                />
                <input
                  className="rounded-[8px] border-2 border-slate-200 px-4 py-2 font-bold outline-none"
                  min={1}
                  onChange={(event) => updateField("durationMinutes", event.target.value)}
                  placeholder="Durasi (menit)"
                  type="number"
                  value={form.durationMinutes}
                />
              </div>
              <textarea
                className="rounded-[8px] border-2 border-slate-200 px-4 py-2 font-bold outline-none"
                onChange={(event) => updateField("description", event.target.value)}
                placeholder="Deskripsi (opsional)"
                value={form.description}
              />

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
                Simpan asesmen
              </button>
              <p className="text-xs font-bold text-slate-400">
                Setelah dibuat, gunakan tombol Atur isi untuk memilih soal dan kelas dari backend.
              </p>
            </form>
          </motion.div>
        </div>
      ) : null}

      {configAssessment ? (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/40 px-4 py-6">
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className="max-h-[calc(100vh-48px)] w-full max-w-2xl overflow-y-auto rounded-[8px] bg-white p-5 shadow-xl sm:p-6"
            initial={{ opacity: 0, scale: 0.96 }}
          >
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-black uppercase text-[#2563eb]">Isi asesmen</p>
                <h3 className="font-heading text-xl font-black">{configAssessment.title}</h3>
                <p className="mt-1 text-sm font-bold text-slate-500">
                  Pilih soal aktif dan kelas dari data backend sebelum publikasi.
                </p>
              </div>
              <button
                className="grid size-9 shrink-0 place-items-center rounded-[8px] bg-slate-100"
                onClick={() => setConfigAssessment(null)}
                type="button"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <section className="rounded-[8px] bg-[#f8fafc] p-4">
                <h4 className="font-heading text-lg font-black">Tambah soal</h4>
                <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">
                  Hanya soal aktif dengan mata pelajaran yang sama yang ditampilkan.
                </p>
                <select
                  className="mt-4 w-full rounded-[8px] border-2 border-slate-200 bg-white px-4 py-3 font-bold outline-none"
                  onChange={(event) => setSelectedQuestionId(event.target.value)}
                  value={selectedQuestionId}
                >
                  <option value="">Pilih soal</option>
                  {compatibleQuestions.map((question) => (
                    <option key={question.id} value={question.id}>
                      {question.code} - {question.questionText.slice(0, 72)}
                    </option>
                  ))}
                </select>
                <input
                  className="mt-3 w-full rounded-[8px] border-2 border-slate-200 bg-white px-4 py-3 font-bold outline-none"
                  min={1}
                  onChange={(event) => setOrderNumber(event.target.value)}
                  placeholder="Urutan soal"
                  type="number"
                  value={orderNumber}
                />
                <button
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#2563eb] px-4 py-3 font-heading font-black text-white shadow-[0_5px_0_#1d4ed8] disabled:opacity-70"
                  disabled={configSubmitting || !selectedQuestionId}
                  onClick={addQuestionToAssessment}
                  type="button"
                >
                  {configSubmitting ? <Loader2 className="animate-spin" size={18} /> : null}
                  Tambahkan soal
                </button>
              </section>

              <section className="rounded-[8px] bg-[#f8fafc] p-4">
                <h4 className="font-heading text-lg font-black">Tambahkan kelas</h4>
                <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">
                  Siswa di kelas terpilih akan menerima assignment saat asesmen dipublikasikan.
                </p>
                <select
                  className="mt-4 w-full rounded-[8px] border-2 border-slate-200 bg-white px-4 py-3 font-bold outline-none"
                  onChange={(event) => setSelectedClassroomId(event.target.value)}
                  value={selectedClassroomId}
                >
                  <option value="">Pilih kelas</option>
                  {classrooms.map((classroom) => (
                    <option key={classroom.id} value={classroom.id}>
                      {classroom.name} - {classroom.academicYear}
                    </option>
                  ))}
                </select>
                <button
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#22c55e] px-4 py-3 font-heading font-black text-white shadow-[0_5px_0_#129447] disabled:opacity-70"
                  disabled={configSubmitting || !selectedClassroomId}
                  onClick={addClassroomToAssessment}
                  type="button"
                >
                  {configSubmitting ? <Loader2 className="animate-spin" size={18} /> : null}
                  Tambahkan kelas
                </button>
              </section>
            </div>

            {configError ? (
              <p className="mt-4 rounded-[8px] bg-[#fff1f2] px-4 py-3 text-sm font-bold text-[#e11d48]">
                {configError}
              </p>
            ) : null}
          </motion.div>
        </div>
      ) : null}
    </DashboardShell>
  );
}
