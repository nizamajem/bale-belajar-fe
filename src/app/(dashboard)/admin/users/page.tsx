"use client";

import { Download, Edit3, Loader2, Plus, Search, Trash2, Upload } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { ApiError, ApiMeta, apiFetch } from "@/lib/api";
import { AdminUser, AdminUserRole } from "@/lib/types";
import { DashboardShell } from "../../_components/dashboard-shell";

type UserStatus = AdminUser["status"];
type FormMode = "add" | "update";
type UserLearningHistory = {
  user: { id: string; name: string; email?: string; role: string; gradeLevel?: number };
  onboarding: Record<string, unknown> | null;
  placementAttempts: {
    id: string;
    worldKey?: string;
    status: string;
    submittedAt?: string;
    answers: LearningAnswer[];
  }[];
  questAttempts: {
    id: string;
    world: { key: string; name: string };
    quest: { code: string; title: string };
    status: string;
    overallScore?: number | null;
    submittedAt?: string;
    answers: LearningAnswer[];
  }[];
};
type LearningAnswer = {
  id: string;
  questionId?: string;
  questionCode?: string;
  questionText: string;
  questionType: string;
  competency?: { code: string; name: string } | null;
  selectedAnswer: unknown;
  correctAnswer?: unknown;
  isCorrect?: boolean | null;
  score?: number | null;
  isSkipped?: boolean;
  answeredAt?: string;
};

const roles: { label: string; value: AdminUserRole }[] = [
  { label: "Siswa", value: "STUDENT" },
  { label: "Guru", value: "TEACHER" },
  { label: "Orangtua", value: "PARENT" },
];

const statusOptions: { label: string; value: "" | UserStatus }[] = [
  { label: "All", value: "" },
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
  { label: "Suspended", value: "SUSPENDED" },
];

const defaultMeta: ApiMeta = { page: 1, limit: 10, total: 0, totalPages: 1 };

export default function AdminUsersPage() {
  return (
    <Suspense
      fallback={
        <DashboardShell title="Users">
          <div className="grid min-h-64 place-items-center rounded-[8px] bg-white">
            <Loader2 className="animate-spin text-slate-400" size={32} />
          </div>
        </DashboardShell>
      }
    >
      <AdminUsersContent />
    </Suspense>
  );
}

function AdminUsersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeRole, setActiveRole] = useState<AdminUserRole>("STUDENT");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [meta, setMeta] = useState<ApiMeta>(defaultMeta);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"" | UserStatus>("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formMode, setFormMode] = useState<FormMode | null>(null);
  const [history, setHistory] = useState<UserLearningHistory | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  const selectedUser = useMemo(
    () => users.find((user) => user.id === selectedIds[0]),
    [selectedIds, users],
  );

  const loadUsers = useCallback(async (nextPage: number) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const { data, meta: nextMeta } = await apiFetch<AdminUser[]>("/users", {
        query: {
          page: nextPage,
          limit,
          role: activeRole,
          search: search || undefined,
          phone: phone || undefined,
          email: email || undefined,
          status: status || undefined,
        },
      });
      setUsers(data);
      setMeta(nextMeta ?? defaultMeta);
      setSelectedIds([]);
    } catch (err) {
      setUsers([]);
      setMeta(defaultMeta);
      setErrorMessage(
        err instanceof ApiError
          ? `${err.message} (${err.status})`
          : "Data user belum bisa dimuat.",
      );
    } finally {
      setLoading(false);
    }
  }, [activeRole, email, limit, phone, search, status]);

  useEffect(() => {
    const role = searchParams.get("role");
    if (role === "STUDENT" || role === "TEACHER" || role === "PARENT") {
      setActiveRole(role);
    }
  }, [searchParams]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPage(1);
      void loadUsers(1);
    }, 300);
    return () => clearTimeout(timeout);
  }, [activeRole, limit, search, phone, email, status, loadUsers]);

  function selectRole(role: AdminUserRole) {
    setActiveRole(role);
    setPage(1);
    router.push(`/admin/users?role=${role}`);
  }

  function toggleSelected(id: string) {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  function toggleAll() {
    setSelectedIds((current) =>
      current.length === users.length ? [] : users.map((user) => user.id),
    );
  }

  async function deleteSelected() {
    if (selectedIds.length === 0) return;
    const ok = window.confirm(`Hapus ${selectedIds.length} user terpilih?`);
    if (!ok) return;
    setSaving(true);
    setErrorMessage(null);
    try {
      await Promise.all(
        selectedIds.map((id) => apiFetch(`/users/${id}`, { method: "DELETE" })),
      );
      await loadUsers(page);
    } catch (err) {
      setErrorMessage(err instanceof ApiError ? err.message : "Gagal menghapus user.");
    } finally {
      setSaving(false);
    }
  }

  function exportUsers() {
    const rows = users.map((user) =>
      [
        user.id,
        displayName(user),
        user.phone ?? "",
        user.email ?? "",
        user.role,
        user.status,
        user.createdAt ? formatDateTime(user.createdAt) : "",
      ]
        .map((value) => `"${String(value).replaceAll('"', '""')}"`)
        .join(","),
    );
    const csv = ["User ID,Full Name,Phone Number,Email,Role,Auth Status,Register Time", ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `users-${activeRole.toLowerCase()}-page-${page}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function changePage(nextPage: number) {
    const boundedPage = Math.min(Math.max(nextPage, 1), Math.max(meta.totalPages, 1));
    setPage(boundedPage);
    await loadUsers(boundedPage);
  }

  async function openHistory(user: AdminUser) {
    setSelectedIds([user.id]);
    setHistoryLoading(true);
    setErrorMessage(null);
    try {
      const { data } = await apiFetch<UserLearningHistory>(`/users/${user.id}/history`);
      setHistory(data);
    } catch (err) {
      setErrorMessage(err instanceof ApiError ? err.message : "History user gagal dimuat.");
    } finally {
      setHistoryLoading(false);
    }
  }

  const pageNumbers = getPageNumbers(meta.page, meta.totalPages);

  return (
    <DashboardShell title="Users">
      <section className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="grid gap-4 lg:grid-cols-3">
          <FilterField label="Search">
            <input className="filter-input" onChange={(event) => setSearch(event.target.value)} value={search} />
          </FilterField>
          <FilterField label="Phone Number">
            <input className="filter-input" onChange={(event) => setPhone(event.target.value)} value={phone} />
          </FilterField>
          <FilterField label="Email">
            <input className="filter-input" onChange={(event) => setEmail(event.target.value)} value={email} />
          </FilterField>
          <FilterField label="Role">
            <select className="filter-input" onChange={(event) => selectRole(event.target.value as AdminUserRole)} value={activeRole}>
              {roles.map((role) => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>
          </FilterField>
          <FilterField label="Auth Status">
            <select className="filter-input" onChange={(event) => setStatus(event.target.value as "" | UserStatus)} value={status}>
              {statusOptions.map((option) => (
                <option key={option.value || "ALL"} value={option.value}>{option.label}</option>
              ))}
            </select>
          </FilterField>
          <FilterField label="Register Time">
            <div className="filter-input flex items-center text-slate-400">Select date and time range</div>
          </FilterField>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#0E3A5F] px-5 py-2 text-sm font-black text-white shadow-[0_4px_0_#082944]"
            onClick={() => {
              setSearch("");
              setPhone("");
              setEmail("");
              setStatus("");
            }}
            type="button"
          >
            <Search size={16} />
            Reset
          </button>
        </div>
      </section>

      <section className="mt-5 rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-wrap gap-3 border-b border-slate-200 pb-4">
          <ActionButton icon={<Plus size={16} />} label="Add" onClick={() => setFormMode("add")} />
          <ActionButton
            disabled={!selectedUser || selectedIds.length !== 1}
            icon={<Edit3 size={15} />}
            label="Update"
            onClick={() => setFormMode("update")}
          />
          <ActionButton
            danger
            disabled={selectedIds.length === 0 || saving}
            icon={<Trash2 size={15} />}
            label="Delete"
            onClick={deleteSelected}
          />
          <ActionButton disabled={users.length === 0} icon={<Download size={16} />} label="Export" onClick={exportUsers} />
          <ActionButton disabled icon={<Upload size={16} />} label="Import" />
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
          <p>Showing {users.length} of {meta.total} users</p>
          <label className="flex items-center gap-2">
            Rows per page
            <select
              className="rounded-[8px] border border-slate-200 bg-white px-2 py-1 font-bold"
              onChange={(event) => setLimit(Number(event.target.value))}
              value={limit}
            >
              {[10, 20, 50, 100].map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </label>
        </div>

        {errorMessage ? (
          <div className="mt-4 rounded-[8px] bg-[#fff1f2] px-4 py-3 text-sm font-bold text-[#e11d48]">
            {errorMessage}
          </div>
        ) : null}

        <div className="hide-scrollbar mt-4 overflow-x-auto">
          <table className="w-full min-w-[1120px] border-collapse text-sm">
            <thead className="bg-[#f8fafc] text-xs font-black uppercase text-slate-400">
              <tr>
                <th className="w-12 px-4 py-3 text-left">
                  <input checked={users.length > 0 && selectedIds.length === users.length} onChange={toggleAll} type="checkbox" />
                </th>
                <th className="px-4 py-3 text-left">User ID</th>
                <th className="px-4 py-3 text-left">Full Name</th>
                <th className="px-4 py-3 text-left">Phone Number</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Auth Status</th>
                <th className="px-4 py-3 text-left">Register Time</th>
                <th className="px-4 py-3 text-left">Operation</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-4 py-12 text-center" colSpan={9}>
                    <Loader2 className="mx-auto animate-spin text-slate-400" size={28} />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td className="px-4 py-12 text-center font-bold text-slate-500" colSpan={9}>
                    {activeRole === "PARENT"
                      ? "Role orangtua belum aktif di backend."
                      : "Belum ada user yang cocok."}
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr className="border-b border-slate-100 hover:bg-[#f8fafc]" key={user.id}>
                    <td className="px-4 py-3">
                      <input checked={selectedIds.includes(user.id)} onChange={() => toggleSelected(user.id)} type="checkbox" />
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">{shortId(user.id)}</td>
                    <td className="px-4 py-3 font-bold text-[#0E3A5F]">{displayName(user)}</td>
                    <td className="px-4 py-3 text-[#2f80d8]">{user.phone ?? "-"}</td>
                    <td className="px-4 py-3 text-slate-600">{user.email ?? "-"}</td>
                    <td className="px-4 py-3 text-slate-600">{roleLabel(user.role)}</td>
                    <td className="px-4 py-3 text-slate-600">{statusLabel(user.status)}</td>
                    <td className="px-4 py-3 text-slate-600">{formatDateTime(user.createdAt)}</td>
                    <td className="px-4 py-3">
                      <button className="mr-3 font-bold text-[#0E3A5F]" onClick={() => setSelectedIds([user.id])} type="button">
                        Pilih
                      </button>
                      <button className="font-bold text-[#2f80d8]" onClick={() => openHistory(user)} type="button">
                        History
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
          <p>Total Data: {meta.total}</p>
          <div className="flex items-center gap-2">
            <button className="pager-text" disabled={meta.page <= 1} onClick={() => changePage(meta.page - 1)} type="button">Prev</button>
            {pageNumbers.map((item) => (
              <button
                className={item === meta.page ? "pager-active" : "pager"}
                key={item}
                onClick={() => changePage(item)}
                type="button"
              >
                {item}
              </button>
            ))}
            <button className="pager-text" disabled={meta.page >= meta.totalPages} onClick={() => changePage(meta.page + 1)} type="button">Next</button>
          </div>
          <GoToPage totalPages={meta.totalPages} onGo={changePage} />
        </div>
      </section>

      {formMode ? (
        <UserFormModal
          activeRole={activeRole}
          mode={formMode}
          onClose={() => setFormMode(null)}
          onSaved={() => {
            setFormMode(null);
            void loadUsers(page);
          }}
          user={formMode === "update" ? selectedUser : undefined}
        />
      ) : null}
      {history || historyLoading ? (
        <HistoryModal
          history={history}
          loading={historyLoading}
          onClose={() => setHistory(null)}
        />
      ) : null}
    </DashboardShell>
  );
}

function FilterField({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <label className="block text-xs font-bold text-slate-600">
      {label}
      <div className="mt-1">{children}</div>
    </label>
  );
}

function ActionButton({
  danger,
  disabled,
  icon,
  label,
  onClick,
}: {
  danger?: boolean;
  disabled?: boolean;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      className={[
        "inline-flex min-w-28 items-center justify-center gap-2 rounded-[8px] border px-4 py-2 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-40",
        danger
          ? "border-[#ef4444] text-[#ef4444]"
          : "border-[#2f80d8] text-[#2f80d8]",
      ].join(" ")}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {icon}
      {label}
    </button>
  );
}

function UserFormModal({
  activeRole,
  mode,
  onClose,
  onSaved,
  user,
}: {
  activeRole: AdminUserRole;
  mode: FormMode;
  onClose: () => void;
  onSaved: () => void;
  user?: AdminUser;
}) {
  const [role, setRole] = useState<AdminUserRole>(user?.role ?? (activeRole === "PARENT" ? "STUDENT" : activeRole));
  const [name, setName] = useState(displayName(user));
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [password, setPassword] = useState("");
  const [gradeLevel, setGradeLevel] = useState(user?.studentProfile?.gradeLevel?.toString() ?? "");
  const [academicYear, setAcademicYear] = useState(user?.studentProfile?.academicYear ?? "");
  const [participantCode, setParticipantCode] = useState(user?.studentProfile?.participantCode ?? "");
  const [subjectSpecialization, setSubjectSpecialization] = useState(user?.teacherProfile?.subjectSpecialization ?? "");
  const [schoolId, setSchoolId] = useState(user?.studentProfile?.school?.id ?? user?.teacherProfile?.school?.id ?? "");
  const [status, setStatus] = useState<UserStatus>(user?.status ?? "ACTIVE");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setErrorMessage(null);
    try {
      await apiFetch(mode === "add" ? "/users" : `/users/${user?.id}`, {
        method: mode === "add" ? "POST" : "PATCH",
        body: {
          role,
          name,
          email: email || undefined,
          phone: phone || undefined,
          password: password || undefined,
          status,
          participantCode: participantCode || undefined,
          gradeLevel: gradeLevel ? Number(gradeLevel) : undefined,
          academicYear: academicYear || undefined,
          schoolId: schoolId || undefined,
          subjectSpecialization: subjectSpecialization || undefined,
        },
      });
      onSaved();
    } catch (err) {
      setErrorMessage(err instanceof ApiError ? err.message : "Gagal menyimpan user.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
      <form className="w-full max-w-xl rounded-[8px] bg-white p-5 shadow-2xl" onSubmit={submit}>
        <div className="mb-4">
          <p className="text-xs font-black uppercase text-[#0E3A5F]">{mode === "add" ? "Tambah user" : "Update user"}</p>
          <h2 className="font-heading text-xl font-black">{mode === "add" ? "Data akun baru" : displayName(user)}</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <FilterField label="Role">
            <select className="filter-input" disabled={mode === "update"} onChange={(event) => setRole(event.target.value as AdminUserRole)} value={role}>
              <option value="STUDENT">Siswa</option>
              <option value="TEACHER">Guru</option>
            </select>
          </FilterField>
          <FilterField label="Auth Status">
            <select className="filter-input" onChange={(event) => setStatus(event.target.value as UserStatus)} value={status}>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </FilterField>
          <FilterField label="Nama">
            <input className="filter-input" onChange={(event) => setName(event.target.value)} required value={name} />
          </FilterField>
          <FilterField label="Email">
            <input className="filter-input" onChange={(event) => setEmail(event.target.value)} type="email" value={email} />
          </FilterField>
          <FilterField label="Phone Number">
            <input className="filter-input" onChange={(event) => setPhone(event.target.value)} value={phone} />
          </FilterField>
          <FilterField label={mode === "add" ? "Password" : "Password baru"}>
            <input className="filter-input" minLength={8} onChange={(event) => setPassword(event.target.value)} type="password" value={password} />
          </FilterField>
          {role === "STUDENT" ? (
            <>
              <FilterField label="School ID">
                <input className="filter-input" onChange={(event) => setSchoolId(event.target.value)} placeholder="Opsional" value={schoolId} />
              </FilterField>
              <FilterField label="Kode Peserta">
                <input className="filter-input" onChange={(event) => setParticipantCode(event.target.value)} value={participantCode} />
              </FilterField>
              <FilterField label="Kelas">
                <input className="filter-input" max={12} min={1} onChange={(event) => setGradeLevel(event.target.value)} type="number" value={gradeLevel} />
              </FilterField>
              <FilterField label="Tahun Ajaran">
                <input className="filter-input" onChange={(event) => setAcademicYear(event.target.value)} placeholder="2026/2027" value={academicYear} />
              </FilterField>
            </>
          ) : (
            <>
              <FilterField label="School ID">
                <input className="filter-input" onChange={(event) => setSchoolId(event.target.value)} required value={schoolId} />
              </FilterField>
              <FilterField label="Mapel Guru">
                <input className="filter-input" onChange={(event) => setSubjectSpecialization(event.target.value)} value={subjectSpecialization} />
              </FilterField>
            </>
          )}
        </div>
        {errorMessage ? <p className="mt-3 text-sm font-bold text-[#e11d48]">{errorMessage}</p> : null}
        <div className="mt-5 flex justify-end gap-3">
          <button className="rounded-[8px] border border-slate-200 px-4 py-2 font-bold text-slate-600" onClick={onClose} type="button">Batal</button>
          <button className="rounded-[8px] bg-[#F4B400] px-5 py-2 font-heading font-black text-[#172033] shadow-[0_4px_0_#C28F00] disabled:opacity-50" disabled={saving} type="submit">
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}

function HistoryModal({
  history,
  loading,
  onClose,
}: {
  history: UserLearningHistory | null;
  loading: boolean;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
      <div className="max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-[8px] bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase text-[#0E3A5F]">History belajar</p>
            <h2 className="font-heading text-xl font-black">
              {history?.user.name ?? "Memuat data..."}
            </h2>
            <p className="text-sm font-bold text-slate-500">
              {history?.user.email ?? "-"} {history?.user.gradeLevel ? `- Kelas ${history.user.gradeLevel}` : ""}
            </p>
          </div>
          <button className="rounded-[8px] border border-slate-200 px-3 py-1 font-bold text-slate-500" onClick={onClose} type="button">
            Tutup
          </button>
        </div>

        {loading ? (
          <div className="grid min-h-64 place-items-center">
            <Loader2 className="animate-spin text-slate-400" size={30} />
          </div>
        ) : history ? (
          <div className="space-y-5">
            <section className="rounded-[8px] bg-[#f8fafc] p-4">
              <p className="font-heading font-black">Onboarding 7 Pertanyaan</p>
              <div className="mt-3 grid gap-2 text-sm font-bold text-slate-600 md:grid-cols-3">
                <span>Status: {history.onboarding?.completedAt ? "Selesai" : "Belum selesai"}</span>
                <span>Dunia: {String(history.onboarding?.learningWorld ?? "-")}</span>
                <span>Level awal: {String(history.onboarding?.selfReportedLevel ?? "-")}</span>
                <span>Tujuan: {String(history.onboarding?.learningGoal ?? "-")}</span>
                <span>Kelas: {String(history.onboarding?.gradeChoice ?? "-")}</span>
                <span>Durasi: {String(history.onboarding?.dailyDuration ?? "-")}</span>
              </div>
            </section>

            <HistorySection
              emptyText="Belum ada history cek awal."
              groups={history.placementAttempts.map((attempt) => ({
                id: attempt.id,
                title: `Cek awal ${attempt.worldKey ?? "-"}`,
                subtitle: `${attempt.status}${attempt.submittedAt ? ` - ${formatDateTime(attempt.submittedAt)}` : ""}`,
                answers: attempt.answers,
              }))}
              title="History Cek Awal"
            />

            <HistorySection
              emptyText="Belum ada history misi."
              groups={history.questAttempts.map((attempt) => ({
                id: attempt.id,
                title: `${attempt.quest.title} (${attempt.world.name})`,
                subtitle: `${attempt.status}${attempt.overallScore != null ? ` - skor ${attempt.overallScore}` : ""}`,
                answers: attempt.answers,
              }))}
              title="History Misi dan Kompetensi"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function HistorySection({
  emptyText,
  groups,
  title,
}: {
  emptyText: string;
  groups: { id: string; title: string; subtitle: string; answers: LearningAnswer[] }[];
  title: string;
}) {
  return (
    <section className="rounded-[8px] border border-slate-200 p-4">
      <h3 className="font-heading text-lg font-black">{title}</h3>
      {groups.length === 0 ? (
        <p className="mt-3 font-bold text-slate-500">{emptyText}</p>
      ) : (
        <div className="mt-3 space-y-4">
          {groups.map((group) => (
            <div className="rounded-[8px] bg-[#f8fafc] p-3" key={group.id}>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <p className="font-heading font-black text-[#0E3A5F]">{group.title}</p>
                <p className="text-sm font-bold text-slate-500">{group.subtitle}</p>
              </div>
              <div className="hide-scrollbar overflow-x-auto">
                <table className="w-full min-w-[900px] border-collapse text-sm">
                  <thead className="bg-white text-xs font-black uppercase text-slate-400">
                    <tr>
                      <th className="px-3 py-2 text-left">Pertanyaan</th>
                      <th className="px-3 py-2 text-left">Tipe</th>
                      <th className="px-3 py-2 text-left">Kompetensi</th>
                      <th className="px-3 py-2 text-left">Jawaban User</th>
                      <th className="px-3 py-2 text-left">Jawaban Benar</th>
                      <th className="px-3 py-2 text-left">Hasil</th>
                      <th className="px-3 py-2 text-left">Skor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.answers.map((answer) => (
                      <tr className="border-b border-white" key={answer.id}>
                        <td className="max-w-sm px-3 py-3 font-bold text-[#0E3A5F]">{answer.questionText}</td>
                        <td className="px-3 py-3 text-slate-600">{answer.questionType}</td>
                        <td className="px-3 py-3 text-slate-600">{answer.competency?.name ?? "-"}</td>
                        <td className="px-3 py-3 text-slate-600">{formatAnswerValue(answer.selectedAnswer)}</td>
                        <td className="px-3 py-3 text-slate-600">{formatAnswerValue(answer.correctAnswer)}</td>
                        <td className="px-3 py-3"><ResultBadge value={answer.isCorrect} skipped={answer.isSkipped} /></td>
                        <td className="px-3 py-3 text-slate-600">{answer.score ?? "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function ResultBadge({ skipped, value }: { skipped?: boolean; value?: boolean | null }) {
  if (skipped) return <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-black text-slate-600">SKIP</span>;
  if (value === true) return <span className="rounded-full bg-[#dcfce7] px-3 py-1 text-xs font-black text-[#166534]">BENAR</span>;
  if (value === false) return <span className="rounded-full bg-[#fee2e2] px-3 py-1 text-xs font-black text-[#991b1b]">SALAH</span>;
  return <span className="rounded-full bg-[#FFF3E0] px-3 py-1 text-xs font-black text-[#7A4A00]">REVIEW</span>;
}

function GoToPage({ onGo, totalPages }: { onGo: (page: number) => void; totalPages: number }) {
  const [value, setValue] = useState("1");
  return (
    <div className="flex items-center gap-2">
      <span>Go to page</span>
      <input className="w-16 rounded-[8px] border border-slate-200 px-2 py-1 font-bold" min={1} onChange={(event) => setValue(event.target.value)} type="number" value={value} />
      <button className="rounded-[8px] bg-[#2f80d8] px-3 py-1 font-bold text-white" onClick={() => onGo(Number(value) || 1)} type="button">Go</button>
      <span>of {Math.max(totalPages, 1)}</span>
    </div>
  );
}

function getPageNumbers(page: number, totalPages: number) {
  const start = Math.max(1, page - 1);
  const end = Math.min(Math.max(totalPages, 1), start + 3);
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

function displayName(user?: AdminUser) {
  if (!user) return "";
  return user.studentProfile?.fullName || user.name;
}

function shortId(id: string) {
  return id.length > 18 ? `${id.slice(0, 10)}...${id.slice(-4)}` : id;
}

function roleLabel(role: AdminUserRole) {
  if (role === "STUDENT") return "Student";
  if (role === "TEACHER") return "Teacher";
  return "Parent";
}

function statusLabel(status: UserStatus) {
  if (status === "ACTIVE") return "Verified";
  if (status === "INACTIVE") return "Inactive";
  return "Suspended";
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
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
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
