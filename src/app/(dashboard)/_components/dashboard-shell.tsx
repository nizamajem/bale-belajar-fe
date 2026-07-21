"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  BarChart3,
  Bell,
  BookOpen,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  Loader2,
  LogOut,
  School,
  Settings,
  UsersRound,
} from "lucide-react";
import { logout, useRequireAuth } from "@/lib/auth";

type Role = "admin" | "teacher";

const nav = {
  admin: [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/schools", label: "Sekolah", icon: School },
    { href: "/admin/students", label: "Siswa", icon: UsersRound },
    { href: "/admin/assessments", label: "Asesmen", icon: ClipboardList },
    { href: "/admin/analytics", label: "Analitik", icon: BarChart3 },
    { href: "/admin/settings", label: "Pengaturan", icon: Settings },
  ],
  teacher: [
    { href: "/teacher/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/teacher/classrooms", label: "Kelas", icon: GraduationCap },
    { href: "/teacher/assessments", label: "Asesmen", icon: ClipboardList },
    { href: "/teacher/reports", label: "Laporan", icon: BarChart3 },
  ],
};

const roleGuard: Record<Role, ("SUPER_ADMIN" | "ADMIN" | "TEACHER")[]> = {
  admin: ["SUPER_ADMIN", "ADMIN"],
  teacher: ["TEACHER"],
};

export function DashboardShell({
  children,
  role,
  title,
}: {
  children: React.ReactNode;
  role: Role;
  title: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, ready } = useRequireAuth(roleGuard[role]);
  const items = nav[role];

  function handleLogout() {
    logout();
    router.push("/login");
  }

  if (!ready || !user) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f8fafc]">
        <Loader2 className="animate-spin text-slate-400" size={32} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] text-[#172033]">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-200 bg-white lg:block">
        <div className="flex h-full flex-col p-5">
          <Link className="mb-8 flex items-center gap-3" href="/">
            <span className="grid size-11 place-items-center rounded-[8px] bg-[#2563eb] text-white shadow-[0_6px_0_#1d4ed8]">
              <BookOpen size={24} strokeWidth={3} />
            </span>
            <div>
              <p className="font-heading text-lg font-black">BaleBelajar</p>
              <p className="text-xs font-bold uppercase text-slate-400">
                {role === "admin" ? "Admin Console" : "Teacher Console"}
              </p>
            </div>
          </Link>

          <nav className="space-y-2">
            {items.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  className={[
                    "flex items-center gap-3 rounded-[8px] px-4 py-3 font-heading font-black transition",
                    active
                      ? "bg-[#eff6ff] text-[#2563eb]"
                      : "text-slate-600 hover:bg-slate-50",
                  ].join(" ")}
                  href={item.href}
                  key={item.href}
                >
                  <Icon size={20} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            className="mt-auto flex items-center gap-3 rounded-[8px] px-4 py-3 text-left font-heading font-black text-slate-500 hover:bg-slate-50"
            onClick={handleLogout}
            type="button"
          >
            <LogOut size={20} />
            Keluar
          </button>
        </div>
      </aside>

      <section className="pb-24 lg:pl-72 lg:pb-0">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div className="min-w-0">
              <p className="truncate text-xs font-black uppercase text-slate-400">
                {user.name}
              </p>
              <h1 className="truncate font-heading text-xl font-black sm:text-2xl">
                {title}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button className="grid size-10 place-items-center rounded-[8px] border border-slate-200 bg-white text-slate-600 shadow-sm">
                <Bell size={19} />
              </button>
              <div className="grid size-10 place-items-center rounded-full bg-[#172033] font-heading font-black text-white">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <div className="px-4 py-5 sm:px-6 lg:px-8">{children}</div>
      </section>

      <nav className="fixed inset-x-3 bottom-3 z-40 rounded-[8px] border border-slate-200 bg-white/95 p-2 shadow-2xl backdrop-blur lg:hidden">
        <div
          className="hide-scrollbar grid auto-cols-[minmax(82px,1fr)] grid-flow-col gap-1 overflow-x-auto"
          style={{ gridTemplateColumns: `repeat(${items.length + 1}, minmax(82px, 1fr))` }}
        >
          {items.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                className={[
                  "flex min-h-16 flex-col items-center justify-center gap-1 rounded-[8px] px-2 py-2 text-center text-[11px] font-black",
                  active ? "bg-[#eff6ff] text-[#2563eb]" : "text-slate-500",
                ].join(" ")}
                href={item.href}
                key={item.href}
              >
                <Icon size={20} />
                <span className="leading-tight">{item.label}</span>
              </Link>
            );
          })}
          <button
            className="flex min-h-16 flex-col items-center justify-center gap-1 rounded-[8px] px-2 py-2 text-center text-[11px] font-black text-slate-500"
            onClick={handleLogout}
            type="button"
          >
            <LogOut size={20} />
            <span className="leading-tight">Keluar</span>
          </button>
        </div>
      </nav>
    </main>
  );
}

export function MetricCard({
  label,
  tone = "blue",
  value,
}: {
  label: string;
  tone?: "blue" | "green" | "yellow" | "red";
  value: string;
}) {
  const tones = {
    blue: "bg-[#eff6ff] text-[#2563eb]",
    green: "bg-[#f0fdf4] text-[#16a34a]",
    red: "bg-[#fff1f2] text-[#e11d48]",
    yellow: "bg-[#fffbeb] text-[#d97706]",
  };

  return (
    <div className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <span className={`rounded-full px-3 py-1 text-xs font-black ${tones[tone]}`}>
        {label}
      </span>
      <p className="font-heading mt-4 text-2xl font-black sm:text-3xl">{value}</p>
    </div>
  );
}
