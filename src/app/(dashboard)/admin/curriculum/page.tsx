"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  BookOpen,
  CaseSensitive,
  Database,
  Download,
  Loader2,
  Plus,
  RefreshCcw,
  Upload,
  Wand2,
} from "lucide-react";
import { ApiError, apiFetch } from "@/lib/api";
import { WorldCurriculum } from "@/lib/types";
import { DashboardShell } from "../../_components/dashboard-shell";

const lessonTypes = [
  "CONCEPT",
  "PROFESSIONAL_HABIT",
  "EXAMPLE",
  "CHECKLIST",
  "RUBRIC",
  "MASTERY_PATH",
];

export default function AdminCurriculumPage() {
  const [worldKey, setWorldKey] = useState("detectivia");
  const [curriculum, setCurriculum] = useState<WorldCurriculum | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [readiness, setReadiness] = useState<Record<string, unknown> | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const selectedModule = curriculum?.modules.find((module) => module.id === selectedModuleId);

  async function load() {
    setLoading(true);
    setMessage(null);
    try {
      const { data } = await apiFetch<WorldCurriculum>(`/admin/curriculum/worlds/${worldKey}`);
      setCurriculum(data);
      setSelectedModuleId((current) => current || data.modules[0]?.id || "");
    } catch (err) {
      setCurriculum(null);
      setMessage(err instanceof ApiError ? err.message : "Kurikulum gagal dimuat.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    void loadReadiness();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [worldKey]);

  async function loadReadiness() {
    try {
      const { data } = await apiFetch<Record<string, unknown>>("/admin/curriculum/readiness");
      setReadiness(data);
    } catch {
      setReadiness(null);
    }
  }

  async function downloadTemplate() {
    setMessage(null);
    try {
      const { data } = await apiFetch<Record<string, unknown>>("/admin/curriculum/import-template");
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "template-kurikulum-baleverse.json";
      link.click();
      URL.revokeObjectURL(url);
      setMessage("Template import berhasil diunduh.");
    } catch (err) {
      setMessage(err instanceof ApiError ? err.message : "Template gagal diunduh.");
    }
  }

  async function importCurriculum() {
    if (!selectedFile) {
      setMessage("Pilih file JSON kurikulum dulu.");
      return;
    }
    setImporting(true);
    setMessage(null);
    try {
      const text = await selectedFile.text();
      const curriculumJson = JSON.parse(text) as Record<string, unknown>;
      const { data } = await apiFetch<{
        importedRows: number;
        sheetsWithData: number;
        normalized: boolean;
      }>("/admin/curriculum/import-json", {
        method: "POST",
        body: { curriculum: curriculumJson, normalize: true },
      });
      await Promise.all([load(), loadReadiness()]);
      setSelectedFile(null);
      setMessage(
        `Import selesai: ${data.importedRows} baris dari ${data.sheetsWithData} sheet. Normalisasi aktif: ${
          data.normalized ? "ya" : "tidak"
        }.`,
      );
    } catch (err) {
      if (err instanceof SyntaxError) {
        setMessage("File bukan JSON valid. Gunakan template yang diunduh dari halaman ini.");
      } else {
        setMessage(err instanceof ApiError ? err.message : "Import kurikulum gagal.");
      }
    } finally {
      setImporting(false);
    }
  }

  async function createModule(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);
    const form = new FormData(event.currentTarget);
    try {
      await apiFetch(`/admin/curriculum/worlds/${worldKey}/modules`, {
        method: "POST",
        body: {
          title: String(form.get("title") || ""),
          slug: String(form.get("slug") || ""),
          simpleGoal: String(form.get("simpleGoal") || ""),
          bigIdea: String(form.get("bigIdea") || ""),
          estimatedMinutes: Number(form.get("estimatedMinutes") || 20),
        },
      });
      event.currentTarget.reset();
      await load();
      setMessage("Modul baru berhasil dibuat.");
    } catch (err) {
      setMessage(err instanceof ApiError ? err.message : "Modul gagal dibuat.");
    } finally {
      setSubmitting(false);
    }
  }

  async function createLesson(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedModule) return;
    setSubmitting(true);
    setMessage(null);
    const form = new FormData(event.currentTarget);
    try {
      await apiFetch(`/admin/curriculum/modules/${selectedModule.id}/lessons`, {
        method: "POST",
        body: {
          title: String(form.get("title") || ""),
          type: String(form.get("type") || "CONCEPT"),
          body: String(form.get("body") || ""),
          examples: lines(form.get("examples")),
          items: lines(form.get("items")),
        },
      });
      event.currentTarget.reset();
      await load();
      setMessage("Materi berhasil ditambahkan.");
    } catch (err) {
      setMessage(err instanceof ApiError ? err.message : "Materi gagal dibuat.");
    } finally {
      setSubmitting(false);
    }
  }

  async function createCaseStudy(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedModule) return;
    setSubmitting(true);
    setMessage(null);
    const form = new FormData(event.currentTarget);
    try {
      await apiFetch(`/admin/curriculum/modules/${selectedModule.id}/case-studies`, {
        method: "POST",
        body: {
          title: String(form.get("title") || ""),
          story: String(form.get("story") || ""),
          analysisSteps: lines(form.get("analysisSteps")),
          commonMistake: String(form.get("commonMistake") || ""),
        },
      });
      event.currentTarget.reset();
      await load();
      setMessage("Studi kasus berhasil ditambahkan.");
    } catch (err) {
      setMessage(err instanceof ApiError ? err.message : "Studi kasus gagal dibuat.");
    } finally {
      setSubmitting(false);
    }
  }

  async function createRemedialRule(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedModule) return;
    setSubmitting(true);
    setMessage(null);
    const form = new FormData(event.currentTarget);
    try {
      await apiFetch(`/admin/curriculum/modules/${selectedModule.id}/remedial-rules`, {
        method: "POST",
        body: {
          minScoreExclusive: Number(form.get("minScoreExclusive") || 60),
          recommendationTitle: String(form.get("recommendationTitle") || ""),
          recommendationMessage: String(form.get("recommendationMessage") || ""),
          actionType: "NEXT_SIMILAR_CASE",
        },
      });
      event.currentTarget.reset();
      await load();
      setMessage("Aturan remedial berhasil ditambahkan.");
    } catch (err) {
      setMessage(err instanceof ApiError ? err.message : "Aturan remedial gagal dibuat.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DashboardShell title="Curriculum Builder">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black uppercase text-[#0E3A5F]">Engine Kurikulum</p>
          <h2 className="font-heading text-2xl font-black">Bangun roadmap belajar per cita-cita</h2>
        </div>
        <div className="flex gap-2">
          <input
            className="rounded-[8px] border-2 border-slate-200 px-3 py-2 font-bold"
            onChange={(event) => setWorldKey(event.target.value)}
            value={worldKey}
          />
          <button
            className="inline-flex items-center gap-2 rounded-[8px] bg-[#F4B400] px-4 py-2 font-heading font-black text-[#0E3A5F]"
            onClick={load}
            type="button"
          >
            <RefreshCcw size={17} />
            Muat
          </button>
        </div>
      </div>

      {message ? (
        <div className="mb-4 rounded-[8px] border border-slate-200 bg-white p-4 text-sm font-bold text-slate-600 shadow-sm">
          {message}
        </div>
      ) : null}

      <section className="mb-5 grid gap-4 rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-[1fr_auto]">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid size-10 place-items-center rounded-[8px] bg-[#FFF3E0] text-[#0E3A5F]">
              <Database size={20} />
            </span>
            <div>
              <p className="font-heading text-xl font-black">Import Kurikulum BaleVerse</p>
              <p className="text-sm font-bold text-slate-500">
                Unduh template, isi data world/chapter/misi/soal, lalu upload JSON untuk import dan normalisasi.
              </p>
            </div>
          </div>
          {readiness ? (
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-black text-slate-600">
              {Object.entries(readiness).slice(0, 6).map(([key, value]) => (
                <span className="rounded-[8px] bg-slate-100 px-3 py-2" key={key}>
                  {key}: {typeof value === "object" ? JSON.stringify(value) : String(value)}
                </span>
              ))}
            </div>
          ) : null}
        </div>
        <div className="flex flex-col gap-2 sm:min-w-80">
          <button
            className="inline-flex items-center justify-center gap-2 rounded-[8px] border-2 border-slate-200 bg-white px-4 py-3 font-heading font-black text-[#0E3A5F]"
            onClick={downloadTemplate}
            type="button"
          >
            <Download size={18} />
            Download Template
          </button>
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-[8px] border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm font-black text-slate-600">
            <Upload size={18} />
            {selectedFile ? selectedFile.name : "Pilih File JSON"}
            <input
              accept="application/json,.json"
              className="hidden"
              onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
              type="file"
            />
          </label>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#22c55e] px-4 py-3 font-heading font-black text-white shadow-[0_5px_0_#129447] disabled:opacity-60"
            disabled={importing}
            onClick={importCurriculum}
            type="button"
          >
            {importing ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
            Import dan Normalisasi
          </button>
        </div>
      </section>

      {loading ? (
        <div className="grid min-h-64 place-items-center rounded-[8px] bg-white">
          <Loader2 className="animate-spin text-slate-400" size={32} />
        </div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
          <section className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="font-heading text-xl font-black">{curriculum?.name ?? worldKey}</p>
            <p className="mt-1 text-sm font-bold text-slate-500">{curriculum?.themeDescription}</p>
            <div className="mt-4 space-y-3">
              {curriculum?.modules.map((module) => (
                <button
                  className={[
                    "w-full rounded-[8px] border-2 p-4 text-left transition",
                    selectedModuleId === module.id ? "border-[#F4B400] bg-[#FFF3E0]" : "border-slate-200 bg-white",
                  ].join(" ")}
                  key={module.id}
                  onClick={() => setSelectedModuleId(module.id)}
                  type="button"
                >
                  <p className="font-heading font-black">{module.title}</p>
                  <p className="mt-1 text-sm font-bold leading-5 text-slate-500">{module.simpleGoal}</p>
                  <p className="mt-2 text-xs font-black text-slate-400">
                    {module.lessons.length} materi - {module.caseStudies.length} studi kasus - {module.remedialRules.length} remedial
                  </p>
                </button>
              ))}
            </div>

            <form className="mt-5 rounded-[8px] bg-[#f8fafc] p-4" onSubmit={createModule}>
              <p className="font-heading font-black">Tambah modul</p>
              <Input name="title" placeholder="Judul modul" />
              <Input name="slug" placeholder="slug-modul" />
              <Textarea name="simpleGoal" placeholder="Tujuan sederhana" />
              <Textarea name="bigIdea" placeholder="Ide besar" />
              <Input name="estimatedMinutes" placeholder="20" type="number" />
              <SubmitButton label="Tambah Modul" loading={submitting} />
            </form>
          </section>

          <section className="space-y-5">
            {selectedModule ? (
              <>
                <div className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm font-black uppercase text-[#6d28d9]">Modul aktif</p>
                  <h3 className="font-heading text-2xl font-black">{selectedModule.title}</h3>
                  <p className="mt-2 font-bold leading-6 text-slate-600">{selectedModule.simpleGoal}</p>
                </div>

                <BuilderForm icon={<BookOpen size={19} />} title="Tambah materi" onSubmit={createLesson}>
                  <Input name="title" placeholder="Judul materi" />
                  <select className="mt-3 w-full rounded-[8px] border-2 border-slate-200 px-3 py-3 font-bold" name="type">
                    {lessonTypes.map((type) => <option key={type}>{type}</option>)}
                  </select>
                  <Textarea name="body" placeholder="Isi materi" />
                  <Textarea name="examples" placeholder="Contoh, satu per baris" />
                  <Textarea name="items" placeholder="Checklist/item, satu per baris" />
                  <SubmitButton label="Tambah Materi" loading={submitting} />
                </BuilderForm>

                <BuilderForm icon={<CaseSensitive size={19} />} title="Tambah studi kasus" onSubmit={createCaseStudy}>
                  <Input name="title" placeholder="Judul studi kasus" />
                  <Textarea name="story" placeholder="Cerita kasus" />
                  <Textarea name="analysisSteps" placeholder="Langkah analisis, satu per baris" />
                  <Textarea name="commonMistake" placeholder="Kesalahan umum" />
                  <SubmitButton label="Tambah Studi Kasus" loading={submitting} />
                </BuilderForm>

                <BuilderForm icon={<Wand2 size={19} />} title="Tambah aturan remedial" onSubmit={createRemedialRule}>
                  <Input name="minScoreExclusive" placeholder="60" type="number" />
                  <Input name="recommendationTitle" placeholder="Judul rekomendasi" />
                  <Textarea name="recommendationMessage" placeholder="Pesan remedial" />
                  <SubmitButton label="Tambah Remedial" loading={submitting} />
                </BuilderForm>
              </>
            ) : null}
          </section>
        </div>
      )}
    </DashboardShell>
  );
}

function lines(value: FormDataEntryValue | null) {
  return String(value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function BuilderForm({
  children,
  icon,
  onSubmit,
  title,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  title: string;
}) {
  return (
    <form className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm" onSubmit={onSubmit}>
      <div className="flex items-center gap-2">
        <span className="grid size-9 place-items-center rounded-[8px] bg-[#FFF3E0] text-[#0E3A5F]">{icon}</span>
        <p className="font-heading text-xl font-black">{title}</p>
      </div>
      {children}
    </form>
  );
}

function Input({ name, placeholder, type = "text" }: { name: string; placeholder: string; type?: string }) {
  return (
    <input
      className="mt-3 w-full rounded-[8px] border-2 border-slate-200 px-3 py-3 font-bold outline-none focus:border-[#F4B400]"
      name={name}
      placeholder={placeholder}
      type={type}
    />
  );
}

function Textarea({ name, placeholder }: { name: string; placeholder: string }) {
  return (
    <textarea
      className="mt-3 w-full rounded-[8px] border-2 border-slate-200 px-3 py-3 font-bold outline-none focus:border-[#F4B400]"
      name={name}
      placeholder={placeholder}
      rows={3}
    />
  );
}

function SubmitButton({ label, loading }: { label: string; loading: boolean }) {
  return (
    <button
      className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#22c55e] px-4 py-3 font-heading font-black text-white shadow-[0_5px_0_#129447] disabled:opacity-60 sm:w-auto"
      disabled={loading}
      type="submit"
    >
      {loading ? <Loader2 className="animate-spin" size={17} /> : <Plus size={17} />}
      {label}
    </button>
  );
}
