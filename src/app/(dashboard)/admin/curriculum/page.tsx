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

type CurriculumReadiness = {
  ready?: boolean;
  counts?: {
    sourceRows?: number;
    worlds?: number;
    activeQuests?: number;
    activeQuestQuestions?: number;
    placementTemplates?: number;
  };
  worlds?: { key: string; name: string; chapters: number; activeQuests: number; ready: boolean }[];
  missingPlacementTypes?: string[];
  issues?: string[];
};

export default function AdminCurriculumPage() {
  const [worldKey, setWorldKey] = useState("detectivia");
  const [curriculum, setCurriculum] = useState<WorldCurriculum | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [readiness, setReadiness] = useState<CurriculumReadiness | null>(null);
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
      const { data } = await apiFetch<CurriculumReadiness>("/admin/curriculum/readiness");
      setReadiness(data);
    } catch {
      setReadiness(null);
    }
  }

  function downloadExpertTemplate() {
    downloadCsv("template-untuk-pakar-kurikulum.csv", expertTemplateRows);
    setMessage("Template pakar berhasil diunduh. File ini bisa dibuka di Excel atau Google Sheets.");
  }

  function downloadExpertExample() {
    downloadCsv("contoh-isian-pakar-kurikulum.csv", expertExampleRows);
    setMessage("Contoh isian berhasil diunduh.");
  }

  async function downloadSystemTemplate() {
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
      setMessage("Template teknis JSON berhasil diunduh.");
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

      <section className="mb-5 rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid size-10 place-items-center rounded-[8px] bg-[#FFF3E0] text-[#0E3A5F]">
              <Database size={20} />
            </span>
            <div>
              <p className="font-heading text-xl font-black">Import Kurikulum BaleVerse</p>
              <p className="text-sm font-bold text-slate-500">
                Kirim template pakar ke ahli kurikulum, lalu gunakan template teknis JSON untuk import ke sistem.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 lg:grid-cols-3">
            <button
              className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#F4B400] px-4 py-3 font-heading font-black text-[#0E3A5F]"
              onClick={downloadExpertTemplate}
              type="button"
            >
              <Download size={18} />
              Download Template Pakar
            </button>
            <button
              className="inline-flex items-center justify-center gap-2 rounded-[8px] border-2 border-slate-200 bg-white px-4 py-3 font-heading font-black text-[#0E3A5F]"
              onClick={downloadExpertExample}
              type="button"
            >
              <Download size={18} />
              Download Contoh Isian
            </button>
            <button
              className="inline-flex items-center justify-center gap-2 rounded-[8px] border-2 border-slate-200 bg-white px-4 py-3 font-heading font-black text-[#0E3A5F]"
              onClick={downloadSystemTemplate}
              type="button"
            >
              <Download size={18} />
              Template Teknis JSON
            </button>
          </div>

          <div className="mt-4 rounded-[8px] bg-slate-50 p-4">
            <p className="font-heading font-black text-slate-900">Yang perlu diisi pakar</p>
            <div className="mt-3 grid gap-2 text-sm font-bold text-slate-600 md:grid-cols-2 xl:grid-cols-4">
              <span>Dunia belajar dan topik besar</span>
              <span>Bab/modul dan tujuan belajar</span>
              <span>Misi harian untuk siswa</span>
              <span>Soal, pilihan, jawaban benar, pembahasan</span>
            </div>
            <p className="mt-3 text-xs font-bold text-slate-500">
              File pakar berbentuk CSV agar mudah dibuka di Excel/Google Sheets. Setelah konten final, admin/kurikulum ops bisa memindahkan ke template teknis JSON untuk import sistem.
            </p>
          </div>

          {readiness ? (
            <div className="mt-5">
              <p className="font-heading font-black text-slate-900">Status data sistem</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                <ReadinessCard label="Siap BaleVerse" value={readiness.ready ? "Ya" : "Belum"} tone={readiness.ready ? "green" : "yellow"} />
                <ReadinessCard label="World" value={readiness.counts?.worlds ?? 0} />
                <ReadinessCard label="Misi Aktif" value={readiness.counts?.activeQuests ?? 0} />
                <ReadinessCard label="Soal Misi" value={readiness.counts?.activeQuestQuestions ?? 0} />
                <ReadinessCard label="Baris Sumber" value={readiness.counts?.sourceRows ?? 0} />
              </div>
              {readiness.issues?.length ? (
                <div className="mt-3 rounded-[8px] bg-[#FFF3E0] p-3 text-sm font-bold text-[#7A4A00]">
                  {readiness.issues.slice(0, 3).join(" ")}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="mt-5 grid gap-2 lg:grid-cols-[1fr_auto]">
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

function downloadCsv(filename: string, rows: Record<string, string>[]) {
  const headers = Object.keys(rows[0] ?? {});
  const content = [
    headers.join(";"),
    ...rows.map((row) => headers.map((header) => csvCell(row[header] ?? "")).join(";")),
  ].join("\n");
  const blob = new Blob([`\uFEFF${content}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function csvCell(value: string) {
  const escaped = value.replaceAll('"', '""');
  return `"${escaped}"`;
}

function ReadinessCard({
  label,
  tone = "slate",
  value,
}: {
  label: string;
  tone?: "green" | "slate" | "yellow";
  value: number | string;
}) {
  const toneClass =
    tone === "green"
      ? "bg-emerald-50 text-emerald-700"
      : tone === "yellow"
        ? "bg-[#FFF3E0] text-[#7A4A00]"
        : "bg-slate-100 text-slate-700";
  return (
    <div className={`rounded-[8px] p-3 ${toneClass}`}>
      <p className="text-xs font-black uppercase">{label}</p>
      <p className="mt-1 font-heading text-2xl font-black">{value}</p>
    </div>
  );
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

const expertTemplateRows = [
  {
    "Dunia Belajar": "",
    "Tema Dunia": "",
    "Bab/Modul": "",
    "Tujuan Bab": "",
    "Misi Harian": "",
    "Instruksi Siswa": "",
    "Kompetensi": "",
    "Tipe Soal": "",
    "Pertanyaan": "",
    "Pilihan A": "",
    "Pilihan B": "",
    "Pilihan C": "",
    "Pilihan D": "",
    "Jawaban Benar": "",
    "Pembahasan": "",
    "Level Kesulitan": "",
    "Estimasi Menit": "",
    "Catatan Pakar": "",
  },
];

const expertExampleRows = [
  {
    "Dunia Belajar": "Scientia",
    "Tema Dunia": "Sains lewat observasi dan eksperimen sederhana",
    "Bab/Modul": "Sel dan Organisasi Kehidupan",
    "Tujuan Bab": "Siswa bisa membedakan benda hidup dan tak hidup dari bukti pengamatan.",
    "Misi Harian": "Misi Bukti Kehidupan",
    "Instruksi Siswa": "Baca kasus singkat, pilih bukti paling kuat, lalu jelaskan alasannya.",
    "Kompetensi": "Mengidentifikasi ciri makhluk hidup",
    "Tipe Soal": "Pilihan Ganda",
    "Pertanyaan": "Bukti mana yang paling menunjukkan bahwa objek adalah makhluk hidup?",
    "Pilihan A": "Objek bertambah besar dari waktu ke waktu.",
    "Pilihan B": "Objek berwarna kuning.",
    "Pilihan C": "Objek berada di dekat air.",
    "Pilihan D": "Objek terlihat mengilap.",
    "Jawaban Benar": "A",
    "Pembahasan": "Pertumbuhan adalah salah satu ciri makhluk hidup, sedangkan warna atau posisi belum cukup menjadi bukti.",
    "Level Kesulitan": "Mudah",
    "Estimasi Menit": "10",
    "Catatan Pakar": "Gunakan contoh yang dekat dengan kehidupan siswa.",
  },
  {
    "Dunia Belajar": "Detectivia",
    "Tema Dunia": "Logika, bukti, dan investigasi",
    "Bab/Modul": "Membedakan Fakta dan Dugaan",
    "Tujuan Bab": "Siswa mampu memilah pernyataan berbasis bukti dan pernyataan yang masih dugaan.",
    "Misi Harian": "Kasus Jejak di Halaman",
    "Instruksi Siswa": "Tandai mana bukti, mana dugaan, lalu pilih kesimpulan paling masuk akal.",
    "Kompetensi": "Menarik kesimpulan dari bukti",
    "Tipe Soal": "Benar/Salah",
    "Pertanyaan": "Kalimat 'tanah basah berarti tadi hujan' selalu pasti benar.",
    "Pilihan A": "Benar",
    "Pilihan B": "Salah",
    "Pilihan C": "",
    "Pilihan D": "",
    "Jawaban Benar": "B",
    "Pembahasan": "Tanah basah bisa karena hujan, disiram, atau tumpahan air. Jadi itu dugaan yang perlu bukti tambahan.",
    "Level Kesulitan": "Mudah",
    "Estimasi Menit": "8",
    "Catatan Pakar": "Cocok untuk latihan penalaran awal.",
  },
];
