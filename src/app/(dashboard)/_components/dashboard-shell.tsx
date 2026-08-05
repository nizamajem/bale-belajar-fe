"use client";

import Link from "next/link";
import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Bell,
  ChevronDown,
  History,
  LayoutDashboard,
  Loader2,
  LogOut,
  School,
  Settings,
  SplitSquareVertical,
  UsersRound,
} from "lucide-react";
import { logout, useRequireAuth } from "@/lib/auth";

const adminNav = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/schools", label: "Sekolah", icon: School },
  { href: "/admin/history", label: "History", icon: History },
  { href: "/admin/curriculum", label: "Kurikulum", icon: SplitSquareVertical },
  { href: "/admin/settings", label: "Pengaturan", icon: Settings },
];

const userNav = [
  { href: "/admin/users?role=STUDENT", label: "Siswa" },
  { href: "/admin/users?role=TEACHER", label: "Guru" },
  { href: "/admin/users?role=PARENT", label: "Orangtua" },
];

const curriculumNav = [
  { href: "/admin/curriculum?view=list", label: "List Kurikulum" },
  { href: "/admin/curriculum?view=questions", label: "List Pertanyaan" },
  { href: "/admin/curriculum?view=import", label: "Import Template" },
];

export function DashboardShell({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [usersOpen, setUsersOpen] = React.useState(pathname === "/admin/users");
  const [curriculumOpen, setCurriculumOpen] = React.useState(pathname === "/admin/curriculum");
  const [currentHref, setCurrentHref] = React.useState(pathname);
  const { user, ready } = useRequireAuth(["SUPER_ADMIN", "ADMIN"], "/login");

  React.useEffect(() => {
    setCurrentHref(`${window.location.pathname}${window.location.search}`);
  }, [pathname]);

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
          <Link className="mb-8 flex items-center gap-3" href={adminNav[0].href}>
            <span className="grid size-11 place-items-center rounded-[8px] bg-[#F4B400] text-[#0E3A5F] shadow-[0_6px_0_#C28F00]">
              <School size={24} strokeWidth={3} />
            </span>
            <div>
              <p className="font-heading text-lg font-black">BaleBelajar</p>
              <p className="text-xs font-bold uppercase text-slate-400">
                Admin Console
              </p>
            </div>
          </Link>

          <nav className="space-y-2">
            {adminNav.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;

              if (item.href === "/admin/curriculum") {
                return (
                  <CurriculumNavGroup
                    active={pathname === "/admin/curriculum"}
                    currentHref={currentHref}
                    key={item.href}
                    open={curriculumOpen}
                    onSelect={setCurrentHref}
                    onToggle={() => setCurriculumOpen((value) => !value)}
                  />
                );
              }

              return (
                <div key={item.href}>
                  <Link
                    className={[
                      "flex items-center gap-3 rounded-[8px] px-4 py-3 font-heading font-black transition",
                      active
                        ? "bg-[#FFF3E0] text-[#0E3A5F]"
                        : "text-slate-600 hover:bg-slate-50",
                    ].join(" ")}
                    href={item.href}
                  >
                    <Icon size={20} />
                    {item.label}
                  </Link>
                  {item.href === "/admin/schools" ? (
                    <UsersNavGroup
                      active={pathname === "/admin/users"}
                      currentHref={currentHref}
                      onSelect={setCurrentHref}
                      onToggle={() => setUsersOpen((value) => !value)}
                      open={usersOpen}
                    />
                  ) : null}
                </div>
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
              <div className="grid size-10 place-items-center rounded-full bg-[#0E3A5F] font-heading font-black text-white">
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
          style={{ gridTemplateColumns: `repeat(${adminNav.length + userNav.length + curriculumNav.length + 1}, minmax(82px, 1fr))` }}
        >
          {adminNav.map((item) => {
            if (item.href === "/admin/curriculum") return null;
            const active = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                className={[
                  "flex min-h-16 flex-col items-center justify-center gap-1 rounded-[8px] px-2 py-2 text-center text-[11px] font-black",
                  active ? "bg-[#FFF3E0] text-[#0E3A5F]" : "text-slate-500",
                ].join(" ")}
                href={item.href}
                key={item.href}
              >
                <Icon size={20} />
                <span className="leading-tight">{item.label}</span>
              </Link>
            );
          })}
          {userNav.map((item) => (
            <Link
              className={[
                "flex min-h-16 flex-col items-center justify-center gap-1 rounded-[8px] px-2 py-2 text-center text-[11px] font-black",
                pathname === "/admin/users" ? "bg-[#FFF3E0] text-[#0E3A5F]" : "text-slate-500",
              ].join(" ")}
              href={item.href}
              key={item.href}
            >
              <UsersRound size={20} />
              <span className="leading-tight">{item.label}</span>
            </Link>
          ))}
          {curriculumNav.map((item) => (
            <Link
              className={[
                "flex min-h-16 flex-col items-center justify-center gap-1 rounded-[8px] px-2 py-2 text-center text-[11px] font-black",
                pathname === "/admin/curriculum" ? "bg-[#FFF3E0] text-[#0E3A5F]" : "text-slate-500",
              ].join(" ")}
              href={item.href}
              key={item.href}
            >
              <SplitSquareVertical size={20} />
              <span className="leading-tight">{item.label}</span>
            </Link>
          ))}
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

function CurriculumNavGroup({
  active,
  currentHref,
  onSelect,
  onToggle,
  open,
}: {
  active: boolean;
  currentHref: string;
  onSelect: (href: string) => void;
  onToggle: () => void;
  open: boolean;
}) {
  return (
    <div className="mt-2">
      <button
        className={[
          "flex w-full items-center gap-3 rounded-[8px] px-4 py-3 text-left font-heading font-black transition",
          active
            ? "bg-[#FFF3E0] text-[#0E3A5F]"
            : "text-slate-600 hover:bg-slate-50",
        ].join(" ")}
        onClick={onToggle}
        type="button"
      >
        <SplitSquareVertical size={20} />
        <span className="flex-1">Kurikulum</span>
        <ChevronDown className={open ? "rotate-180 transition" : "transition"} size={17} />
      </button>
      {open ? (
        <SubNav
          currentHref={currentHref}
          items={curriculumNav}
          onSelect={onSelect}
        />
      ) : null}
    </div>
  );
}

function UsersNavGroup({
  active,
  currentHref,
  onSelect,
  onToggle,
  open,
}: {
  active: boolean;
  currentHref: string;
  onSelect: (href: string) => void;
  onToggle: () => void;
  open: boolean;
}) {
  return (
    <div className="mt-2">
      <button
        className={[
          "flex w-full items-center gap-3 rounded-[8px] px-4 py-3 text-left font-heading font-black transition",
          active
            ? "bg-[#FFF3E0] text-[#0E3A5F]"
            : "text-slate-600 hover:bg-slate-50",
        ].join(" ")}
        onClick={onToggle}
        type="button"
      >
        <UsersRound size={20} />
        <span className="flex-1">Users</span>
        <ChevronDown className={open ? "rotate-180 transition" : "transition"} size={17} />
      </button>
      {open ? (
        <SubNav
          currentHref={currentHref}
          items={userNav}
          onSelect={onSelect}
        />
      ) : null}
    </div>
  );
}

function SubNav({
  currentHref,
  items,
  onSelect,
}: {
  currentHref: string;
  items: { href: string; label: string }[];
  onSelect: (href: string) => void;
}) {
  return (
    <div className="mt-1 space-y-1 pl-9">
      {items.map((item) => {
        const active = currentHref === item.href;
        return (
          <Link
            className={[
              "block rounded-[8px] px-4 py-2 text-sm font-heading font-black transition",
              active
                ? "bg-[#FFF3E0] text-[#0E3A5F]"
                : "text-slate-500 hover:bg-slate-50 hover:text-[#0E3A5F]",
            ].join(" ")}
            href={item.href}
            key={item.href}
            onClick={() => onSelect(item.href)}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}

export function MetricCard({
  label,
  tone = "yellow",
  value,
}: {
  label: string;
  tone?: "yellow" | "green" | "red" | "navy";
  value: string;
}) {
  const tones = {
    yellow: "bg-[#FFF3E0] text-[#B45309]",
    green: "bg-[#f0fdf4] text-[#16a34a]",
    red: "bg-[#fff1f2] text-[#e11d48]",
    navy: "bg-[#eef2f7] text-[#0E3A5F]",
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
