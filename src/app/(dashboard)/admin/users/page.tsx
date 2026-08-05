"use client";

import { motion } from "framer-motion";
import { Download, Loader2, Search, UserRoundCheck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { AdminUser, AdminUserRole } from "@/lib/types";
import { DashboardShell, MetricCard } from "../../_components/dashboard-shell";

const tabs: { label: string; role: AdminUserRole }[] = [
  { label: "Siswa", role: "STUDENT" },
  { label: "Guru", role: "TEACHER" },
  { label: "Orangtua", role: "PARENT" },
];

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
  const [counts, setCounts] = useState<Record<AdminUserRole, number>>({
    STUDENT: 0,
    TEACHER: 0,
    PARENT: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  async function loadUsers(role: AdminUserRole, searchTerm: string) {
    setLoading(true);
    try {
      const { data, meta } = await apiFetch<AdminUser[]>("/users", {
        query: { page: 1, limit: 100, role, search: searchTerm || undefined },
      });
      setUsers(data);
      setCounts((current) => ({ ...current, [role]: meta?.total ?? data.length }));
    } catch {
      setUsers([]);
      setCounts((current) => ({ ...current, [role]: 0 }));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => void loadUsers(activeRole, search), 300);
    return () => clearTimeout(timeout);
  }, [activeRole, search]);

  useEffect(() => {
    const role = searchParams.get("role");
    if (role === "STUDENT" || role === "TEACHER" || role === "PARENT") {
      setActiveRole(role);
    }
  }, [searchParams]);

  function selectRole(role: AdminUserRole) {
    setActiveRole(role);
    router.push(`/admin/users?role=${role}`);
  }

  function exportUsers() {
    const rows = users.map((user) =>
      [
        user.role,
        displayName(user),
        user.email ?? "",
        user.phone ?? "",
        profileLabel(user),
        user.status,
        user.lastLoginAt ? formatDate(user.lastLoginAt) : "Belum pernah login",
        formatDate(user.createdAt),
      ]
        .map((value) => `"${String(value).replaceAll('"', '""')}"`)
        .join(","),
    );
    const csv = [
      "Role,Nama,Email,Telepon,Profil,Status,Login Terakhir,Tanggal Daftar",
      ...rows,
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `users-${activeRole.toLowerCase()}-balebelajar.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <DashboardShell title="Users">
      <div className="mb-5 grid gap-4 md:grid-cols-3">
        <MetricCard label="Siswa" tone="green" value={String(counts.STUDENT)} />
        <MetricCard label="Guru" tone="yellow" value={String(counts.TEACHER)} />
        <MetricCard label="Orangtua" tone="navy" value={String(counts.PARENT)} />
      </div>

      <section className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase text-[#0E3A5F]">
              Data akun dari backend
            </p>
            <h2 className="font-heading text-2xl font-black">Akun pengguna</h2>
            <p className="mt-1 text-sm font-bold text-slate-500">
              Akun siswa yang daftar dari aplikasi akan muncul di tab Siswa, meskipun belum masuk sekolah atau kelas.
            </p>
          </div>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-[8px] border-2 border-slate-200 bg-white px-4 py-3 font-heading font-black text-[#0E3A5F] disabled:opacity-50"
            disabled={users.length === 0}
            onClick={exportUsers}
            type="button"
          >
            <Download size={18} />
            Unduh CSV
          </button>
        </div>

        <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex rounded-[8px] bg-slate-100 p-1">
            {tabs.map((tab) => (
              <button
                className={[
                  "rounded-[8px] px-4 py-2 font-heading font-black transition",
                  activeRole === tab.role
                    ? "bg-white text-[#0E3A5F] shadow-sm"
                    : "text-slate-500",
                ].join(" ")}
                key={tab.role}
                onClick={() => selectRole(tab.role)}
                type="button"
              >
                {tab.label}
              </button>
            ))}
          </div>

          <label className="flex min-w-0 flex-1 items-center gap-3 rounded-[8px] border-2 border-slate-200 px-4 py-3 lg:max-w-lg">
            <Search className="text-slate-400" size={20} />
            <input
              className="w-full bg-transparent font-bold outline-none"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari nama, email, telepon, kode peserta"
              value={search}
            />
          </label>
        </div>

        <div className="hide-scrollbar mt-5 overflow-x-auto">
          {loading ? (
            <div className="grid place-items-center py-10">
              <Loader2 className="animate-spin text-slate-400" size={28} />
            </div>
          ) : users.length === 0 ? (
            <EmptyState role={activeRole} />
          ) : (
            <table className="w-full min-w-[940px] border-separate border-spacing-y-2">
              <thead>
                <tr className="text-left text-xs font-black uppercase text-slate-400">
                  <th className="px-4 py-2">Nama</th>
                  <th className="px-4 py-2">Kontak</th>
                  <th className="px-4 py-2">Profil</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Login terakhir</th>
                  <th className="px-4 py-2">Daftar</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <motion.tr
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#f8fafc]"
                    initial={{ opacity: 0, y: 8 }}
                    key={user.id}
                    transition={{ delay: index * 0.03 }}
                  >
                    <td className="rounded-l-[8px] px-4 py-4">
                      <p className="font-heading font-black text-[#0E3A5F]">
                        {displayName(user)}
                      </p>
                      <p className="text-xs font-bold text-slate-400">{roleLabel(user.role)}</p>
                    </td>
                    <td className="px-4 py-4 font-bold text-slate-600">
                      <p>{user.email ?? "-"}</p>
                      <p className="text-xs text-slate-400">{user.phone ?? "-"}</p>
                    </td>
                    <td className="px-4 py-4 font-bold text-slate-600">{profileLabel(user)}</td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-[#dcfce7] px-3 py-1 text-xs font-black text-[#166534]">
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-bold text-slate-600">
                      {user.lastLoginAt ? formatDate(user.lastLoginAt) : "Belum pernah"}
                    </td>
                    <td className="rounded-r-[8px] px-4 py-4 font-bold text-slate-600">
                      {formatDate(user.createdAt)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </DashboardShell>
  );
}

function EmptyState({ role }: { role: AdminUserRole }) {
  const text =
    role === "PARENT"
      ? "Role orangtua belum aktif di backend. Setelah role ini ditambahkan, datanya akan muncul di sini."
      : `Belum ada akun ${roleLabel(role).toLowerCase()} yang cocok.`;
  return (
    <div className="grid place-items-center py-12 text-center">
      <UserRoundCheck className="text-slate-300" size={38} />
      <p className="mt-3 max-w-md font-bold text-slate-500">{text}</p>
    </div>
  );
}

function displayName(user: AdminUser) {
  return user.studentProfile?.fullName || user.name;
}

function profileLabel(user: AdminUser) {
  if (user.role === "STUDENT") {
    const school = user.studentProfile?.school?.name ?? "Mandiri";
    const classroom = user.studentProfile?.classrooms?.[0]?.classroom.name;
    const grade = user.studentProfile?.gradeLevel
      ? `Kelas ${user.studentProfile.gradeLevel}`
      : "Kelas belum diisi";
    return [school, classroom ?? grade].join(" - ");
  }
  if (user.role === "TEACHER") {
    return [
      user.teacherProfile?.school?.name ?? "Sekolah belum diisi",
      user.teacherProfile?.subjectSpecialization ?? "Mapel belum diisi",
    ].join(" - ");
  }
  return "Profil orangtua belum aktif";
}

function roleLabel(role: AdminUserRole) {
  if (role === "STUDENT") return "Siswa";
  if (role === "TEACHER") return "Guru";
  return "Orangtua";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
