"use client";

import { Download, Edit3, Loader2, Plus, RefreshCcw, Trash2, Upload } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { ApiError, apiFetch } from "@/lib/api";
import { CurriculumModuleSummary, WorldCurriculum } from "@/lib/types";
import { DashboardShell } from "../../_components/dashboard-shell";

type ViewMode = "list" | "questions" | "import";
type ItemType = "module" | "lesson" | "case" | "remedial";
type FormMode = "add" | "update";

type CurriculumReadiness = {
  ready?: boolean;
  counts?: {
    sourceRows?: number;
    worlds?: number;
    activeQuests?: number;
    activeQuestQuestions?: number;
  };
  issues?: string[];
};

type QuestOption = { id: string; code: string; title: string; status: string };
type CompetencyOption = { id: string; code: string; name: string };
type QuestQuestion = {
  id: string;
  code: string;
  questionType: string;
  questionText: string;
  difficulty?: string;
  status: string;
  orderNumber: number;
  competencyId: string;
  competency?: CompetencyOption;
  optionCount: number;
  quest: QuestOption;
};
type QuestionPayload = {
  world: { id: string; key: string; name: string };
  quests: QuestOption[];
  competencies: CompetencyOption[];
  questions: QuestQuestion[];
};

const lessonTypes = ["CONCEPT", "PROFESSIONAL_HABIT", "EXAMPLE", "CHECKLIST", "RUBRIC", "MASTERY_PATH"];
const questionTypes = [
  "SINGLE_CHOICE",
  "MULTIPLE_SELECT",
  "BINARY_CHOICE",
  "SHORT_TEXT",
  "MATCHING",
  "ORDERING",
  "IMAGE_CHOICE",
  "AUDIO_CHOICE",
  "LONG_TEXT",
  "CODE_INPUT",
  "IMAGE_HOTSPOT",
  "VOICE_RESPONSE",
  "TIMELINE_BUILDER",
  "EVIDENCE_BOARD",
];
const questionStatuses = ["DRAFT", "ACTIVE", "INACTIVE", "ARCHIVED"];

export default function AdminCurriculumPage() {
  return (
    <Suspense
      fallback={
        <DashboardShell title="Curriculum Builder">
          <div className="grid min-h-64 place-items-center rounded-[8px] bg-white">
            <Loader2 className="animate-spin text-slate-400" size={32} />
          </div>
        </DashboardShell>
      }
    >
      <AdminCurriculumContent />
    </Suspense>
  );
}

function AdminCurriculumContent() {
  const searchParams = useSearchParams();
  const view = normalizeView(searchParams.get("view"));
  const [worldKey, setWorldKey] = useState("detectivia");
  const [curriculum, setCurriculum] = useState<WorldCurriculum | null>(null);
  const [questionsData, setQuestionsData] = useState<QuestionPayload | null>(null);
  const [readiness, setReadiness] = useState<CurriculumReadiness | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [selectedItemType, setSelectedItemType] = useState<ItemType>("module");
  const [selectedItemId, setSelectedItemId] = useState("");
  const [selectedQuestionId, setSelectedQuestionId] = useState("");
  const [itemModal, setItemModal] = useState<{ type: ItemType; mode: FormMode } | null>(null);
  const [questionModal, setQuestionModal] = useState<FormMode | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const selectedModule = useMemo(
    () => curriculum?.modules.find((module) => module.id === selectedModuleId),
    [curriculum, selectedModuleId],
  );
  const selectedQuestion = useMemo(
    () => questionsData?.questions.find((question) => question.id === selectedQuestionId),
    [questionsData, selectedQuestionId],
  );

  const load = useCallback(async () => {
    setLoading(true);
    setMessage(null);
    try {
      const [curriculumRes, readinessRes] = await Promise.all([
        apiFetch<WorldCurriculum>(`/admin/curriculum/worlds/${worldKey}`),
        apiFetch<CurriculumReadiness>("/admin/curriculum/readiness").catch(() => ({ data: null })),
      ]);
      setCurriculum(curriculumRes.data);
      setReadiness(readinessRes.data);
      setSelectedModuleId((current) => current || curriculumRes.data.modules[0]?.id || "");
      if (view === "questions") {
        const { data } = await apiFetch<QuestionPayload>(`/admin/curriculum/worlds/${worldKey}/questions`);
        setQuestionsData(data);
      }
    } catch (err) {
      setCurriculum(null);
      setQuestionsData(null);
      setMessage(err instanceof ApiError ? err.message : "Kurikulum gagal dimuat.");
    } finally {
      setLoading(false);
    }
  }, [view, worldKey]);

  useEffect(() => {
    void load();
  }, [load]);

  function selectItem(type: ItemType, id: string) {
    setSelectedItemType(type);
    setSelectedItemId((current) => (current === id ? "" : id));
  }

  async function removeSelectedItem() {
    if (!selectedItemId) return;
    const ok = window.confirm("Hapus data terpilih?");
    if (!ok) return;
    const path = itemDeletePath(selectedItemType, selectedItemId);
    setSaving(true);
    setMessage(null);
    try {
      await apiFetch(path, { method: "DELETE" });
      setSelectedItemId("");
      await load();
      setMessage(selectedItemType === "module" ? "Modul berhasil diarsipkan." : "Data berhasil dihapus.");
    } catch (err) {
      setMessage(err instanceof ApiError ? err.message : "Data gagal dihapus.");
    } finally {
      setSaving(false);
    }
  }

  async function removeSelectedQuestion() {
    if (!selectedQuestionId) return;
    const ok = window.confirm("Hapus pertanyaan terpilih?");
    if (!ok) return;
    setSaving(true);
    setMessage(null);
    try {
      await apiFetch(`/admin/curriculum/questions/${selectedQuestionId}`, { method: "DELETE" });
      setSelectedQuestionId("");
      await load();
      setMessage("Pertanyaan berhasil dihapus.");
    } catch (err) {
      setMessage(err instanceof ApiError ? err.message : "Pertanyaan gagal dihapus.");
    } finally {
      setSaving(false);
    }
  }

  async function importCurriculum() {
    if (!selectedFile) {
      setMessage("Pilih file JSON kurikulum dulu.");
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const curriculumJson = JSON.parse(await selectedFile.text()) as Record<string, unknown>;
      const { data } = await apiFetch<{ importedRows: number; sheetsWithData: number; normalized: boolean }>(
        "/admin/curriculum/import-json",
        { method: "POST", body: { curriculum: curriculumJson, normalize: true } },
      );
      setSelectedFile(null);
      await load();
      setMessage(`Import selesai: ${data.importedRows} baris dari ${data.sheetsWithData} sheet.`);
    } catch (err) {
      setMessage(err instanceof SyntaxError ? "File bukan JSON valid." : err instanceof ApiError ? err.message : "Import gagal.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <DashboardShell title={view === "questions" ? "List Pertanyaan" : view === "import" ? "Import Kurikulum" : "List Kurikulum"}>
      <section className="mb-5 rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto] lg:items-end">
          <label className="block text-xs font-bold text-slate-600">
            World Key
            <input className="filter-input mt-1" onChange={(event) => setWorldKey(event.target.value)} value={worldKey} />
          </label>
          <button className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#F4B400] px-5 py-3 font-heading font-black text-[#0E3A5F] shadow-[0_4px_0_#C28F00]" onClick={load} type="button">
            <RefreshCcw size={17} />
            Muat
          </button>
          <ReadinessBadge readiness={readiness} />
        </div>
        {message ? <div className="mt-4 rounded-[8px] bg-[#FFF3E0] px-4 py-3 text-sm font-bold text-[#7A4A00]">{message}</div> : null}
      </section>

      {view === "import" ? (
        <ImportPanel
          onDownloadExample={() => downloadCsv("contoh-isian-pakar-kurikulum.csv", expertExampleRows)}
          onDownloadExpert={() => downloadCsv("template-untuk-pakar-kurikulum.csv", expertTemplateRows)}
          onDownloadJson={async () => {
            const { data } = await apiFetch<Record<string, unknown>>("/admin/curriculum/import-template");
            downloadBlob("template-kurikulum-baleverse.json", JSON.stringify(data, null, 2), "application/json");
          }}
          onImport={importCurriculum}
          saving={saving}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
        />
      ) : null}

      {view === "list" ? (
        <CurriculumListView
          curriculum={curriculum}
          loading={loading}
          onAdd={(type) => setItemModal({ type, mode: "add" })}
          onDelete={removeSelectedItem}
          onSelect={selectItem}
          onUpdate={() => setItemModal({ type: selectedItemType, mode: "update" })}
          saving={saving}
          selectedItemId={selectedItemId}
          selectedItemType={selectedItemType}
          selectedModule={selectedModule}
          selectedModuleId={selectedModuleId}
          setSelectedModuleId={setSelectedModuleId}
        />
      ) : null}

      {view === "questions" ? (
        <QuestionsView
          data={questionsData}
          loading={loading}
          onAdd={() => setQuestionModal("add")}
          onDelete={removeSelectedQuestion}
          onSelect={setSelectedQuestionId}
          onUpdate={() => setQuestionModal("update")}
          saving={saving}
          selectedQuestionId={selectedQuestionId}
        />
      ) : null}

      {itemModal ? (
        <ItemModal
          curriculum={curriculum}
          item={findSelectedItem(curriculum, selectedItemType, selectedItemId)}
          mode={itemModal.mode}
          onClose={() => setItemModal(null)}
          onSaved={async () => {
            setItemModal(null);
            await load();
          }}
          selectedModule={selectedModule}
          type={itemModal.type}
          worldKey={worldKey}
        />
      ) : null}

      {questionModal ? (
        <QuestionModal
          data={questionsData}
          mode={questionModal}
          onClose={() => setQuestionModal(null)}
          onSaved={async () => {
            setQuestionModal(null);
            await load();
          }}
          question={questionModal === "update" ? selectedQuestion : undefined}
        />
      ) : null}
    </DashboardShell>
  );
}

function CurriculumListView(props: {
  curriculum: WorldCurriculum | null;
  loading: boolean;
  onAdd: (type: ItemType) => void;
  onDelete: () => void;
  onSelect: (type: ItemType, id: string) => void;
  onUpdate: () => void;
  saving: boolean;
  selectedItemId: string;
  selectedItemType: ItemType;
  selectedModule?: CurriculumModuleSummary;
  selectedModuleId: string;
  setSelectedModuleId: (id: string) => void;
}) {
  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_1.25fr]">
      <DataPanel
        addLabel="Add Modul"
        canDelete={Boolean(props.selectedItemId && props.selectedItemType === "module")}
        canUpdate={Boolean(props.selectedItemId && props.selectedItemType === "module")}
        onAdd={() => props.onAdd("module")}
        onDelete={props.onDelete}
        onUpdate={props.onUpdate}
        title="List Kurikulum"
      >
        <TableShell loading={props.loading} empty={!props.curriculum?.modules.length} colSpan={7}>
          <thead className="table-head">
            <tr>
              <th className="w-12 px-4 py-3"><span /></th>
              <th className="px-4 py-3 text-left">Order</th>
              <th className="px-4 py-3 text-left">Judul</th>
              <th className="px-4 py-3 text-left">Slug</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Menit</th>
              <th className="px-4 py-3 text-left">Operation</th>
            </tr>
          </thead>
          <tbody>
            {props.curriculum?.modules.map((module) => (
              <tr className="border-b border-slate-100 hover:bg-[#f8fafc]" key={module.id}>
                <td className="px-4 py-3">
                  <input checked={props.selectedItemId === module.id && props.selectedItemType === "module"} onChange={() => props.onSelect("module", module.id)} type="checkbox" />
                </td>
                <td className="px-4 py-3 text-slate-600">{module.orderNumber}</td>
                <td className="px-4 py-3 font-bold text-[#0E3A5F]">{module.title}</td>
                <td className="px-4 py-3 text-slate-600">{module.slug}</td>
                <td className="px-4 py-3 text-slate-600">{module.status ?? "ACTIVE"}</td>
                <td className="px-4 py-3 text-slate-600">{module.estimatedMinutes}</td>
                <td className="px-4 py-3">
                  <button className="font-bold text-[#2f80d8]" onClick={() => props.setSelectedModuleId(module.id)} type="button">Buka</button>
                </td>
              </tr>
            ))}
          </tbody>
        </TableShell>
      </DataPanel>

      <div className="space-y-5">
        <SelectedModuleHeader module={props.selectedModule} />
        <ChildTable
          addLabel="Add Materi"
          columns={["Order", "Judul", "Tipe", "Isi"]}
          itemType="lesson"
          items={props.selectedModule?.lessons ?? []}
          onAdd={props.onAdd}
          onDelete={props.onDelete}
          onSelect={props.onSelect}
          onUpdate={props.onUpdate}
          selectedItemId={props.selectedItemId}
          selectedItemType={props.selectedItemType}
          title="List Materi"
        />
        <ChildTable
          addLabel="Add Studi Kasus"
          columns={["Order", "Judul", "Cerita", "Kesalahan Umum"]}
          itemType="case"
          items={props.selectedModule?.caseStudies ?? []}
          onAdd={props.onAdd}
          onDelete={props.onDelete}
          onSelect={props.onSelect}
          onUpdate={props.onUpdate}
          selectedItemId={props.selectedItemId}
          selectedItemType={props.selectedItemType}
          title="List Studi Kasus"
        />
        <ChildTable
          addLabel="Add Remedial"
          columns={["Skor <", "Judul", "Pesan", "Action"]}
          itemType="remedial"
          items={props.selectedModule?.remedialRules ?? []}
          onAdd={props.onAdd}
          onDelete={props.onDelete}
          onSelect={props.onSelect}
          onUpdate={props.onUpdate}
          selectedItemId={props.selectedItemId}
          selectedItemType={props.selectedItemType}
          title="List Remedial"
        />
      </div>
    </div>
  );
}

function QuestionsView(props: {
  data: QuestionPayload | null;
  loading: boolean;
  onAdd: () => void;
  onDelete: () => void;
  onSelect: (id: string) => void;
  onUpdate: () => void;
  saving: boolean;
  selectedQuestionId: string;
}) {
  return (
    <DataPanel
      addLabel="Add Pertanyaan"
      canDelete={Boolean(props.selectedQuestionId)}
      canUpdate={Boolean(props.selectedQuestionId)}
      onAdd={props.onAdd}
      onDelete={props.onDelete}
      onUpdate={props.onUpdate}
      title="List Pertanyaan"
    >
      <TableShell loading={props.loading} empty={!props.data?.questions.length} colSpan={9}>
        <thead className="table-head">
          <tr>
            <th className="w-12 px-4 py-3"><span /></th>
            <th className="px-4 py-3 text-left">Code</th>
            <th className="px-4 py-3 text-left">Quest</th>
            <th className="px-4 py-3 text-left">Pertanyaan</th>
            <th className="px-4 py-3 text-left">Tipe</th>
            <th className="px-4 py-3 text-left">Kompetensi</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Opsi</th>
            <th className="px-4 py-3 text-left">Order</th>
          </tr>
        </thead>
        <tbody>
          {props.data?.questions.map((question) => (
            <tr className="border-b border-slate-100 hover:bg-[#f8fafc]" key={question.id}>
              <td className="px-4 py-3">
                <input checked={props.selectedQuestionId === question.id} onChange={() => props.onSelect(question.id)} type="checkbox" />
              </td>
              <td className="px-4 py-3 font-mono text-xs text-slate-600">{question.code}</td>
              <td className="px-4 py-3 text-slate-600">{question.quest.title}</td>
              <td className="max-w-md px-4 py-3 font-bold text-[#0E3A5F]">{question.questionText}</td>
              <td className="px-4 py-3 text-slate-600">{question.questionType}</td>
              <td className="px-4 py-3 text-slate-600">{question.competency?.name ?? question.competencyId}</td>
              <td className="px-4 py-3 text-slate-600">{question.status}</td>
              <td className="px-4 py-3 text-slate-600">{question.optionCount}</td>
              <td className="px-4 py-3 text-slate-600">{question.orderNumber}</td>
            </tr>
          ))}
        </tbody>
      </TableShell>
    </DataPanel>
  );
}

function DataPanel({
  addLabel,
  canDelete,
  canUpdate,
  children,
  onAdd,
  onDelete,
  onUpdate,
  title,
}: {
  addLabel: string;
  canDelete: boolean;
  canUpdate: boolean;
  children: React.ReactNode;
  onAdd: () => void;
  onDelete: () => void;
  onUpdate: () => void;
  title: string;
}) {
  return (
    <section className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <h2 className="font-heading text-xl font-black">{title}</h2>
        <div className="flex flex-wrap gap-2">
          <ActionButton icon={<Plus size={16} />} label={addLabel} onClick={onAdd} />
          <ActionButton disabled={!canUpdate} icon={<Edit3 size={15} />} label="Update" onClick={onUpdate} />
          <ActionButton danger disabled={!canDelete} icon={<Trash2 size={15} />} label="Delete" onClick={onDelete} />
        </div>
      </div>
      <div className="hide-scrollbar overflow-x-auto">{children}</div>
    </section>
  );
}

function ChildTable(props: {
  addLabel: string;
  columns: string[];
  itemType: ItemType;
  items: Record<string, unknown>[];
  onAdd: (type: ItemType) => void;
  onDelete: () => void;
  onSelect: (type: ItemType, id: string) => void;
  onUpdate: () => void;
  selectedItemId: string;
  selectedItemType: ItemType;
  title: string;
}) {
  return (
    <DataPanel
      addLabel={props.addLabel}
      canDelete={props.selectedItemType === props.itemType && Boolean(props.selectedItemId)}
      canUpdate={props.selectedItemType === props.itemType && Boolean(props.selectedItemId)}
      onAdd={() => props.onAdd(props.itemType)}
      onDelete={props.onDelete}
      onUpdate={props.onUpdate}
      title={props.title}
    >
      <table className="w-full min-w-[760px] border-collapse text-sm">
        <thead className="table-head">
          <tr>
            <th className="w-12 px-4 py-3"><span /></th>
            {props.columns.map((column) => <th className="px-4 py-3 text-left" key={column}>{column}</th>)}
          </tr>
        </thead>
        <tbody>
          {props.items.length === 0 ? (
            <tr><td className="px-4 py-10 text-center font-bold text-slate-500" colSpan={props.columns.length + 1}>Belum ada data.</td></tr>
          ) : props.items.map((item) => (
            <tr className="border-b border-slate-100 hover:bg-[#f8fafc]" key={String(item.id)}>
              <td className="px-4 py-3">
                <input checked={props.selectedItemType === props.itemType && props.selectedItemId === item.id} onChange={() => props.onSelect(props.itemType, String(item.id))} type="checkbox" />
              </td>
              {rowCells(props.itemType, item).map((value, index) => <td className="px-4 py-3 text-slate-600" key={index}>{String(value ?? "-")}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </DataPanel>
  );
}

function ItemModal({
  curriculum,
  item,
  mode,
  onClose,
  onSaved,
  selectedModule,
  type,
  worldKey,
}: {
  curriculum: WorldCurriculum | null;
  item?: Record<string, unknown>;
  mode: FormMode;
  onClose: () => void;
  onSaved: () => void;
  selectedModule?: CurriculumModuleSummary;
  type: ItemType;
  worldKey: string;
}) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const body = itemBody(type, form);
    const path = itemPath(type, mode, worldKey, selectedModule?.id, String(item?.id ?? ""));
    setSaving(true);
    setMessage(null);
    try {
      await apiFetch(path, { method: mode === "add" ? "POST" : "PATCH", body });
      onSaved();
    } catch (err) {
      setMessage(err instanceof ApiError ? err.message : "Gagal menyimpan data.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title={`${mode === "add" ? "Add" : "Update"} ${itemTypeLabel(type)}`} onClose={onClose}>
      <form onSubmit={submit}>
        {type === "module" ? (
          <>
            <Field name="title" defaultValue={String(item?.title ?? "")} label="Judul" required />
            <Field name="slug" defaultValue={String(item?.slug ?? "")} label="Slug" />
            <Field name="simpleGoal" defaultValue={String(item?.simpleGoal ?? "")} label="Tujuan" multiline />
            <Field name="bigIdea" defaultValue={String(item?.bigIdea ?? "")} label="Big Idea" multiline />
            <Field name="orderNumber" defaultValue={String(item?.orderNumber ?? (curriculum?.modules.length ?? 0) + 1)} label="Order" type="number" />
            <Field name="estimatedMinutes" defaultValue={String(item?.estimatedMinutes ?? 20)} label="Estimasi Menit" type="number" />
          </>
        ) : null}
        {type === "lesson" ? (
          <>
            <Field name="title" defaultValue={String(item?.title ?? "")} label="Judul" required />
            <SelectField name="type" defaultValue={String(item?.type ?? "CONCEPT")} label="Tipe" options={lessonTypes} />
            <Field name="body" defaultValue={String(item?.body ?? "")} label="Isi" multiline />
            <Field name="examples" defaultValue={arrayText(item?.examples)} label="Contoh" multiline />
            <Field name="items" defaultValue={arrayText(item?.items)} label="Items" multiline />
            <Field name="orderNumber" defaultValue={String(item?.orderNumber ?? "")} label="Order" type="number" />
          </>
        ) : null}
        {type === "case" ? (
          <>
            <Field name="title" defaultValue={String(item?.title ?? "")} label="Judul" required />
            <Field name="story" defaultValue={String(item?.story ?? "")} label="Cerita" multiline />
            <Field name="analysisSteps" defaultValue={arrayText(item?.analysisSteps)} label="Langkah Analisis" multiline />
            <Field name="commonMistake" defaultValue={String(item?.commonMistake ?? "")} label="Kesalahan Umum" multiline />
            <Field name="orderNumber" defaultValue={String(item?.orderNumber ?? "")} label="Order" type="number" />
          </>
        ) : null}
        {type === "remedial" ? (
          <>
            <Field name="minScoreExclusive" defaultValue={String(item?.minScoreExclusive ?? 60)} label="Skor di bawah" type="number" />
            <Field name="recommendationTitle" defaultValue={String(item?.recommendationTitle ?? "")} label="Judul" required />
            <Field name="recommendationMessage" defaultValue={String(item?.recommendationMessage ?? "")} label="Pesan" multiline />
            <Field name="actionType" defaultValue={String(item?.actionType ?? "NEXT_SIMILAR_CASE")} label="Action Type" />
          </>
        ) : null}
        {message ? <p className="mt-3 text-sm font-bold text-[#e11d48]">{message}</p> : null}
        <ModalActions loading={saving} onClose={onClose} />
      </form>
    </Modal>
  );
}

function QuestionModal({
  data,
  mode,
  onClose,
  onSaved,
  question,
}: {
  data: QuestionPayload | null;
  mode: FormMode;
  onClose: () => void;
  onSaved: () => void;
  question?: QuestQuestion;
}) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const questId = String(form.get("questId") || question?.quest.id || "");
    const body = {
      code: emptyToUndefined(form.get("code")),
      competencyId: emptyToUndefined(form.get("competencyId")),
      difficulty: emptyToUndefined(form.get("difficulty")),
      orderNumber: numberOrUndefined(form.get("orderNumber")),
      questionText: String(form.get("questionText") || ""),
      questionType: String(form.get("questionType") || "SINGLE_CHOICE"),
      status: String(form.get("status") || "DRAFT"),
    };
    setSaving(true);
    setMessage(null);
    try {
      await apiFetch(mode === "add" ? `/admin/curriculum/quests/${questId}/questions` : `/admin/curriculum/questions/${question?.id}`, {
        method: mode === "add" ? "POST" : "PATCH",
        body,
      });
      onSaved();
    } catch (err) {
      setMessage(err instanceof ApiError ? err.message : "Gagal menyimpan pertanyaan.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title={`${mode === "add" ? "Add" : "Update"} Pertanyaan`} onClose={onClose}>
      <form onSubmit={submit}>
        <SelectField disabled={mode === "update"} name="questId" defaultValue={question?.quest.id ?? data?.quests[0]?.id ?? ""} label="Quest" options={(data?.quests ?? []).map((quest) => ({ label: quest.title, value: quest.id }))} />
        <Field name="code" defaultValue={question?.code ?? ""} label="Code" />
        <Field name="questionText" defaultValue={question?.questionText ?? ""} label="Pertanyaan" multiline required />
        <SelectField name="questionType" defaultValue={question?.questionType ?? "SINGLE_CHOICE"} label="Tipe" options={questionTypes} />
        <SelectField name="competencyId" defaultValue={question?.competencyId ?? data?.competencies[0]?.id ?? ""} label="Kompetensi" options={(data?.competencies ?? []).map((item) => ({ label: `${item.code} - ${item.name}`, value: item.id }))} />
        <SelectField name="status" defaultValue={question?.status ?? "DRAFT"} label="Status" options={questionStatuses} />
        <Field name="difficulty" defaultValue={question?.difficulty ?? ""} label="Difficulty" />
        <Field name="orderNumber" defaultValue={String(question?.orderNumber ?? "")} label="Order" type="number" />
        {message ? <p className="mt-3 text-sm font-bold text-[#e11d48]">{message}</p> : null}
        <ModalActions loading={saving} onClose={onClose} />
      </form>
    </Modal>
  );
}

function ImportPanel(props: {
  onDownloadExample: () => void;
  onDownloadExpert: () => void;
  onDownloadJson: () => void;
  onImport: () => void;
  saving: boolean;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
}) {
  return (
    <section className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="font-heading text-xl font-black">Import Kurikulum BaleVerse</h2>
      <p className="mt-1 text-sm font-bold text-slate-500">Download template untuk pakar, lalu upload JSON teknis untuk normalisasi ke sistem.</p>
      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        <ActionButton icon={<Download size={16} />} label="Template Pakar" onClick={props.onDownloadExpert} />
        <ActionButton icon={<Download size={16} />} label="Contoh Isian" onClick={props.onDownloadExample} />
        <ActionButton icon={<Download size={16} />} label="Template JSON" onClick={props.onDownloadJson} />
      </div>
      <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_auto]">
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-[8px] border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm font-black text-slate-600">
          <Upload size={18} />
          {props.selectedFile ? props.selectedFile.name : "Pilih File JSON"}
          <input accept="application/json,.json" className="hidden" onChange={(event) => props.setSelectedFile(event.target.files?.[0] ?? null)} type="file" />
        </label>
        <button className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#22c55e] px-4 py-3 font-heading font-black text-white shadow-[0_5px_0_#129447] disabled:opacity-60" disabled={props.saving} onClick={props.onImport} type="button">
          {props.saving ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
          Import dan Normalisasi
        </button>
      </div>
    </section>
  );
}

function TableShell({ children, empty, loading }: { children: React.ReactNode; colSpan: number; empty: boolean; loading: boolean }) {
  if (loading) {
    return <div className="grid min-h-64 place-items-center"><Loader2 className="animate-spin text-slate-400" size={30} /></div>;
  }
  if (empty) {
    return <div className="grid min-h-40 place-items-center font-bold text-slate-500">Belum ada data.</div>;
  }
  return <table className="w-full min-w-[920px] border-collapse text-sm">{children}</table>;
}

function ActionButton({ danger, disabled, icon, label, onClick }: { danger?: boolean; disabled?: boolean; icon: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <button className={["inline-flex min-w-28 items-center justify-center gap-2 rounded-[8px] border px-4 py-2 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-40", danger ? "border-[#ef4444] text-[#ef4444]" : "border-[#2f80d8] text-[#2f80d8]"].join(" ")} disabled={disabled} onClick={onClick} type="button">
      {icon}
      {label}
    </button>
  );
}

function Modal({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[8px] bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 className="font-heading text-xl font-black">{title}</h2>
          <button className="rounded-[8px] border border-slate-200 px-3 py-1 font-bold text-slate-500" onClick={onClose} type="button">Tutup</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ defaultValue, label, multiline, name, required, type = "text" }: { defaultValue?: string; label: string; multiline?: boolean; name: string; required?: boolean; type?: string }) {
  return (
    <label className="mt-3 block text-xs font-bold text-slate-600">
      {label}
      {multiline ? (
        <textarea className="filter-input mt-1 min-h-24" defaultValue={defaultValue} name={name} required={required} />
      ) : (
        <input className="filter-input mt-1" defaultValue={defaultValue} name={name} required={required} type={type} />
      )}
    </label>
  );
}

function SelectField({ defaultValue, disabled, label, name, options }: { defaultValue: string; disabled?: boolean; label: string; name: string; options: (string | { label: string; value: string })[] }) {
  return (
    <label className="mt-3 block text-xs font-bold text-slate-600">
      {label}
      <select className="filter-input mt-1" defaultValue={defaultValue} disabled={disabled} name={name}>
        {options.map((option) => {
          const value = typeof option === "string" ? option : option.value;
          const labelText = typeof option === "string" ? option : option.label;
          return <option key={value} value={value}>{labelText}</option>;
        })}
      </select>
    </label>
  );
}

function ModalActions({ loading, onClose }: { loading: boolean; onClose: () => void }) {
  return (
    <div className="mt-5 flex justify-end gap-3">
      <button className="rounded-[8px] border border-slate-200 px-4 py-2 font-bold text-slate-600" onClick={onClose} type="button">Batal</button>
      <button className="rounded-[8px] bg-[#F4B400] px-5 py-2 font-heading font-black text-[#172033] shadow-[0_4px_0_#C28F00] disabled:opacity-50" disabled={loading} type="submit">{loading ? "Menyimpan..." : "Simpan"}</button>
    </div>
  );
}

function SelectedModuleHeader({ module }: { module?: CurriculumModuleSummary }) {
  return (
    <section className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase text-[#0E3A5F]">Modul aktif</p>
      <h2 className="font-heading text-xl font-black">{module?.title ?? "Pilih modul"}</h2>
      <p className="mt-1 text-sm font-bold text-slate-500">{module?.simpleGoal ?? "Klik Buka pada list kurikulum untuk melihat materi, studi kasus, dan remedial."}</p>
    </section>
  );
}

function ReadinessBadge({ readiness }: { readiness: CurriculumReadiness | null }) {
  return (
    <div className="rounded-[8px] bg-slate-100 px-4 py-3 text-sm font-black text-slate-600">
      Ready: {readiness?.ready ? "Ya" : "Belum"} - Quest: {readiness?.counts?.activeQuests ?? 0} - Soal: {readiness?.counts?.activeQuestQuestions ?? 0}
    </div>
  );
}

function normalizeView(value: string | null): ViewMode {
  if (value === "questions" || value === "import") return value;
  return "list";
}

function rowCells(type: ItemType, item: Record<string, unknown>) {
  if (type === "lesson") return [item.orderNumber, item.title, item.type, truncate(String(item.body ?? ""))];
  if (type === "case") return [item.orderNumber, item.title, truncate(String(item.story ?? "")), truncate(String(item.commonMistake ?? ""))];
  return [item.minScoreExclusive, item.recommendationTitle, truncate(String(item.recommendationMessage ?? "")), item.actionType];
}

function itemPath(type: ItemType, mode: FormMode, worldKey: string, moduleId?: string, itemId?: string) {
  if (type === "module") return mode === "add" ? `/admin/curriculum/worlds/${worldKey}/modules` : `/admin/curriculum/modules/${itemId}`;
  if (!moduleId && mode === "add") throw new Error("Pilih modul dulu.");
  if (type === "lesson") return mode === "add" ? `/admin/curriculum/modules/${moduleId}/lessons` : `/admin/curriculum/lessons/${itemId}`;
  if (type === "case") return mode === "add" ? `/admin/curriculum/modules/${moduleId}/case-studies` : `/admin/curriculum/case-studies/${itemId}`;
  return mode === "add" ? `/admin/curriculum/modules/${moduleId}/remedial-rules` : `/admin/curriculum/remedial-rules/${itemId}`;
}

function itemDeletePath(type: ItemType, id: string) {
  if (type === "module") return `/admin/curriculum/modules/${id}`;
  if (type === "lesson") return `/admin/curriculum/lessons/${id}`;
  if (type === "case") return `/admin/curriculum/case-studies/${id}`;
  return `/admin/curriculum/remedial-rules/${id}`;
}

function itemBody(type: ItemType, form: FormData) {
  if (type === "module") {
    return {
      title: String(form.get("title") || ""),
      slug: emptyToUndefined(form.get("slug")),
      simpleGoal: String(form.get("simpleGoal") || ""),
      bigIdea: emptyToUndefined(form.get("bigIdea")),
      orderNumber: numberOrUndefined(form.get("orderNumber")),
      estimatedMinutes: numberOrUndefined(form.get("estimatedMinutes")),
    };
  }
  if (type === "lesson") {
    return {
      title: String(form.get("title") || ""),
      type: String(form.get("type") || "CONCEPT"),
      body: String(form.get("body") || ""),
      examples: lines(form.get("examples")),
      items: lines(form.get("items")),
      orderNumber: numberOrUndefined(form.get("orderNumber")),
    };
  }
  if (type === "case") {
    return {
      title: String(form.get("title") || ""),
      story: String(form.get("story") || ""),
      analysisSteps: lines(form.get("analysisSteps")),
      commonMistake: String(form.get("commonMistake") || ""),
      orderNumber: numberOrUndefined(form.get("orderNumber")),
    };
  }
  return {
    minScoreExclusive: numberOrUndefined(form.get("minScoreExclusive")),
    recommendationTitle: String(form.get("recommendationTitle") || ""),
    recommendationMessage: String(form.get("recommendationMessage") || ""),
    actionType: String(form.get("actionType") || "NEXT_SIMILAR_CASE"),
  };
}

function findSelectedItem(curriculum: WorldCurriculum | null, type: ItemType, id: string): Record<string, unknown> | undefined {
  if (!id || !curriculum) return undefined;
  if (type === "module") return curriculum.modules.find((module) => module.id === id) as unknown as Record<string, unknown>;
  for (const curriculumModule of curriculum.modules) {
    const collections = {
      lesson: curriculumModule.lessons,
      case: curriculumModule.caseStudies,
      remedial: curriculumModule.remedialRules,
    };
    const found = collections[type].find((item) => item.id === id);
    if (found) return found as unknown as Record<string, unknown>;
  }
  return undefined;
}

function itemTypeLabel(type: ItemType) {
  if (type === "module") return "Modul";
  if (type === "lesson") return "Materi";
  if (type === "case") return "Studi Kasus";
  return "Remedial";
}

function lines(value: FormDataEntryValue | null) {
  return String(value || "").split("\n").map((item) => item.trim()).filter(Boolean);
}

function arrayText(value: unknown) {
  return Array.isArray(value) ? value.join("\n") : "";
}

function emptyToUndefined(value: FormDataEntryValue | null) {
  const text = String(value || "").trim();
  return text || undefined;
}

function numberOrUndefined(value: FormDataEntryValue | null) {
  const text = String(value || "").trim();
  return text ? Number(text) : undefined;
}

function truncate(value: string) {
  return value.length > 90 ? `${value.slice(0, 90)}...` : value;
}

function downloadBlob(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function downloadCsv(filename: string, rows: Record<string, string>[]) {
  const headers = Object.keys(rows[0] ?? {});
  const content = [
    headers.join(";"),
    ...rows.map((row) => headers.map((header) => `"${(row[header] ?? "").replaceAll('"', '""')}"`).join(";")),
  ].join("\n");
  downloadBlob(filename, `\uFEFF${content}`, "text/csv;charset=utf-8");
}

const expertTemplateRows = [{
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
}];

const expertExampleRows = [{
  "Dunia Belajar": "Detectivia",
  "Tema Dunia": "Logika, bukti, dan investigasi",
  "Bab/Modul": "Membedakan Fakta dan Dugaan",
  "Tujuan Bab": "Siswa mampu memilah bukti dan dugaan.",
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
  "Pembahasan": "Tanah basah bisa karena hujan, disiram, atau tumpahan air.",
  "Level Kesulitan": "Mudah",
  "Estimasi Menit": "8",
  "Catatan Pakar": "Cocok untuk latihan penalaran awal.",
}];
