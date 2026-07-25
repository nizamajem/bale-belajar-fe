"use client";

import { FormEvent, useEffect, useState } from "react";
import { BookOpen, CaseSensitive, Loader2, Plus, RefreshCcw, Wand2 } from "lucide-react";
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [worldKey]);

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
    <DashboardShell role="admin" title="Curriculum Builder">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black uppercase text-[#2563eb]">Engine Kurikulum</p>
          <h2 className="font-heading text-2xl font-black">Bangun roadmap belajar per cita-cita</h2>
        </div>
        <div className="flex gap-2">
          <input
            className="rounded-[8px] border-2 border-slate-200 px-3 py-2 font-bold"
            onChange={(event) => setWorldKey(event.target.value)}
            value={worldKey}
          />
          <button
            className="inline-flex items-center gap-2 rounded-[8px] bg-[#2563eb] px-4 py-2 font-heading font-black text-white"
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
                    selectedModuleId === module.id ? "border-[#2563eb] bg-[#eff6ff]" : "border-slate-200 bg-white",
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
        <span className="grid size-9 place-items-center rounded-[8px] bg-[#eff6ff] text-[#2563eb]">{icon}</span>
        <p className="font-heading text-xl font-black">{title}</p>
      </div>
      {children}
    </form>
  );
}

function Input({ name, placeholder, type = "text" }: { name: string; placeholder: string; type?: string }) {
  return (
    <input
      className="mt-3 w-full rounded-[8px] border-2 border-slate-200 px-3 py-3 font-bold outline-none focus:border-[#2563eb]"
      name={name}
      placeholder={placeholder}
      type={type}
    />
  );
}

function Textarea({ name, placeholder }: { name: string; placeholder: string }) {
  return (
    <textarea
      className="mt-3 w-full rounded-[8px] border-2 border-slate-200 px-3 py-3 font-bold outline-none focus:border-[#2563eb]"
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
