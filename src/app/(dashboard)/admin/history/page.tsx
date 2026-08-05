"use client";

import { Download, Loader2, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { ApiError, ApiMeta, apiFetch } from "@/lib/api";
import { DashboardShell } from "../../_components/dashboard-shell";

type HistoryType = "ALL" | "ONBOARDING" | "PLACEMENT" | "QUEST";
type HistoryResult = "ALL" | "CORRECT" | "WRONG" | "SKIPPED" | "REVIEW";

type HistoryRow = {
  id: string;
  type: "ONBOARDING" | "PLACEMENT" | "QUEST";
  userId: string;
  studentName: string;
  email: string | null;
  world: string | null;
  activity: string;
  questionText: string;
  questionType: string;
  competency: string | null;
  selectedAnswer: unknown;
  correctAnswer: unknown;
  result: "CORRECT" | "WRONG" | "SKIPPED" | "REVIEW";
  score: number | null;
  answeredAt: string;
};

const defaultMeta: ApiMeta = { page: 1, limit: 10, total: 0, totalPages: 1 };

export default function AdminHistoryPage() {
  const [rows, setRows] = useState<HistoryRow[]>([]);
  const [meta, setMeta] = useState<ApiMeta>(defaultMeta);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [type, setType] = useState<HistoryType>("ALL");
  const [result, setResult] = useState<HistoryResult>("ALL");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadHistory = useCallback(async (nextPage: number) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const { data, meta: nextMeta } = await apiFetch<HistoryRow[]>("/users/history", {
        query: {
          page: nextPage,
          limit,
          search: search || undefined,
          type,
          result,
        },
      });
      setRows(data);
      setMeta(nextMeta ?? defaultMeta);
    } catch (err) {
      setRows([]);
      setMeta(defaultMeta);
      setErrorMessage(err instanceof ApiError ? err.message : "History gagal dimuat.");
    } finally {
      setLoading(false);
    }
  }, [limit, result, search, type]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPage(1);
      void loadHistory(1);
    }, 300);
    return () => clearTimeout(timeout);
  }, [loadHistory]);

  async function changePage(nextPage: number) {
    const boundedPage = Math.min(Math.max(nextPage, 1), Math.max(meta.totalPages, 1));
    setPage(boundedPage);
    await loadHistory(boundedPage);
  }

  function exportRows() {
    const csv = [
      "Siswa,Email,Tipe,Dunia,Aktivitas,Pertanyaan,Tipe Soal,Kompetensi,Jawaban User,Jawaban Benar,Hasil,Skor,Waktu",
      ...rows.map((row) =>
        [
          row.studentName,
          row.email ?? "",
          row.type,
          row.world ?? "",
          row.activity,
          row.questionText,
          row.questionType,
          row.competency ?? "",
          formatAnswerValue(row.selectedAnswer),
          formatAnswerValue(row.correctAnswer),
          row.result,
          row.score ?? "",
          formatDateTime(row.answeredAt),
        ].map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","),
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `history-belajar-page-${page}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  const pageNumbers = getPageNumbers(meta.page, meta.totalPages);

  return (
    <DashboardShell title="History">
      <section className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="grid gap-4 lg:grid-cols-4">
          <label className="block text-xs font-bold text-slate-600 lg:col-span-2">
            Search
            <input className="filter-input mt-1" onChange={(event) => setSearch(event.target.value)} placeholder="Cari nama siswa atau email" value={search} />
          </label>
          <label className="block text-xs font-bold text-slate-600">
            Type
            <select className="filter-input mt-1" onChange={(event) => setType(event.target.value as HistoryType)} value={type}>
              <option value="ALL">All</option>
              <option value="ONBOARDING">Onboarding</option>
              <option value="PLACEMENT">Cek Awal</option>
              <option value="QUEST">Misi</option>
            </select>
          </label>
          <label className="block text-xs font-bold text-slate-600">
            Result
            <select className="filter-input mt-1" onChange={(event) => setResult(event.target.value as HistoryResult)} value={result}>
              <option value="ALL">All</option>
              <option value="CORRECT">Benar</option>
              <option value="WRONG">Salah</option>
              <option value="SKIPPED">Skip</option>
              <option value="REVIEW">Review</option>
            </select>
          </label>
        </div>
        <div className="mt-4 flex justify-end">
          <button className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#0E3A5F] px-5 py-2 text-sm font-black text-white shadow-[0_4px_0_#082944]" onClick={() => { setSearch(""); setType("ALL"); setResult("ALL"); }} type="button">
            <Search size={16} />
            Reset
          </button>
        </div>
      </section>

      <section className="mt-5 rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <p className="text-sm font-black uppercase text-[#0E3A5F]">Data history dari backend</p>
            <h2 className="font-heading text-xl font-black">Semua jawaban user</h2>
          </div>
          <button className="inline-flex items-center justify-center gap-2 rounded-[8px] border border-[#2f80d8] px-4 py-2 text-sm font-bold text-[#2f80d8] disabled:opacity-40" disabled={rows.length === 0} onClick={exportRows} type="button">
            <Download size={16} />
            Export
          </button>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
          <p>Showing {rows.length} of {meta.total} records</p>
          <label className="flex items-center gap-2">
            Rows per page
            <select className="rounded-[8px] border border-slate-200 bg-white px-2 py-1 font-bold" onChange={(event) => setLimit(Number(event.target.value))} value={limit}>
              {[10, 20, 50, 100].map((size) => <option key={size} value={size}>{size}</option>)}
            </select>
          </label>
        </div>

        {errorMessage ? <div className="mt-4 rounded-[8px] bg-[#fff1f2] px-4 py-3 text-sm font-bold text-[#e11d48]">{errorMessage}</div> : null}

        <div className="hide-scrollbar mt-4 overflow-x-auto">
          <table className="w-full min-w-[1280px] border-collapse text-sm">
            <thead className="bg-[#f8fafc] text-xs font-black uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3 text-left">Siswa</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Dunia</th>
                <th className="px-4 py-3 text-left">Aktivitas</th>
                <th className="px-4 py-3 text-left">Pertanyaan</th>
                <th className="px-4 py-3 text-left">Kompetensi</th>
                <th className="px-4 py-3 text-left">Jawaban User</th>
                <th className="px-4 py-3 text-left">Jawaban Benar</th>
                <th className="px-4 py-3 text-left">Hasil</th>
                <th className="px-4 py-3 text-left">Skor</th>
                <th className="px-4 py-3 text-left">Waktu</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="px-4 py-12 text-center" colSpan={11}><Loader2 className="mx-auto animate-spin text-slate-400" size={28} /></td></tr>
              ) : rows.length === 0 ? (
                <tr><td className="px-4 py-12 text-center font-bold text-slate-500" colSpan={11}>Belum ada history yang cocok.</td></tr>
              ) : rows.map((row) => (
                <tr className="border-b border-slate-100 hover:bg-[#f8fafc]" key={`${row.type}-${row.id}`}>
                  <td className="px-4 py-3">
                    <p className="font-bold text-[#0E3A5F]">{row.studentName}</p>
                    <p className="text-xs font-bold text-slate-400">{row.email ?? "-"}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{typeLabel(row.type)}</td>
                  <td className="px-4 py-3 text-slate-600">{row.world ?? "-"}</td>
                  <td className="px-4 py-3 text-slate-600">{row.activity}</td>
                  <td className="max-w-md px-4 py-3 font-bold text-[#0E3A5F]">{row.questionText}</td>
                  <td className="px-4 py-3 text-slate-600">{row.competency ?? "-"}</td>
                  <td className="px-4 py-3 text-slate-600">{formatAnswerValue(row.selectedAnswer)}</td>
                  <td className="px-4 py-3 text-slate-600">{formatAnswerValue(row.correctAnswer)}</td>
                  <td className="px-4 py-3"><ResultBadge value={row.result} /></td>
                  <td className="px-4 py-3 text-slate-600">{row.score ?? "-"}</td>
                  <td className="px-4 py-3 text-slate-600">{formatDateTime(row.answeredAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
          <p>Total Data: {meta.total}</p>
          <div className="flex items-center gap-2">
            <button className="pager-text" disabled={meta.page <= 1} onClick={() => changePage(meta.page - 1)} type="button">Prev</button>
            {pageNumbers.map((item) => <button className={item === meta.page ? "pager-active" : "pager"} key={item} onClick={() => changePage(item)} type="button">{item}</button>)}
            <button className="pager-text" disabled={meta.page >= meta.totalPages} onClick={() => changePage(meta.page + 1)} type="button">Next</button>
          </div>
        </div>
      </section>
    </DashboardShell>
  );
}

function ResultBadge({ value }: { value: HistoryResult }) {
  if (value === "CORRECT") return <span className="rounded-full bg-[#dcfce7] px-3 py-1 text-xs font-black text-[#166534]">BENAR</span>;
  if (value === "WRONG") return <span className="rounded-full bg-[#fee2e2] px-3 py-1 text-xs font-black text-[#991b1b]">SALAH</span>;
  if (value === "SKIPPED") return <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-black text-slate-600">SKIP</span>;
  return <span className="rounded-full bg-[#FFF3E0] px-3 py-1 text-xs font-black text-[#7A4A00]">REVIEW</span>;
}

function getPageNumbers(page: number, totalPages: number) {
  const start = Math.max(1, page - 1);
  const end = Math.min(Math.max(totalPages, 1), start + 3);
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

function typeLabel(value: HistoryRow["type"]) {
  if (value === "PLACEMENT") return "Cek Awal";
  if (value === "QUEST") return "Misi";
  return "Onboarding";
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatAnswerValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map(formatAnswerValue).join(", ");
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (record.selectedOptionId) return String(record.selectedOptionId);
    if (record.value) return String(record.value);
    if (record.text) return String(record.text);
    return JSON.stringify(record);
  }
  return String(value);
}
