"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  BriefcaseBusiness,
  History,
  Home,
  LogOut,
  MapPinned,
  School,
  Search,
  Star,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { logout, useRequireAuth } from "@/lib/auth";
import { GameProfileSummary } from "@/lib/types";
import { RoleSwitcher } from "@/components/role-switcher";
import { LoadingEvidence } from "./motion-kit";

const navItems = [
  {
    href: "/student/dashboard",
    label: "Beranda",
    description: "Mulai belajar hari ini",
    icon: Home,
  },
  {
    href: "/student/careers",
    label: "Cita-cita",
    description: "Pilih jalur karier",
    icon: BriefcaseBusiness,
  },
  {
    href: "/student/world/detectivia",
    label: "Detectivia",
    description: "Materi, kasus, dan tes",
    icon: Search,
  },
  {
    href: "/student/growth-map?worldKey=detectivia",
    match: "/student/growth-map",
    label: "Peta Tumbuh",
    description: "Lihat skill kuat dan lemah",
    icon: MapPinned,
  },
  {
    href: "/student/history",
    label: "Riwayat",
    description: "Aktivitas belajar",
    icon: History,
  },
  {
    href: "/student/profile",
    label: "Profil",
    description: "Data akun siswa",
    icon: UserRound,
  },
  {
    href: "/student/school",
    label: "Sekolah",
    description: "Hubungkan akun ke sekolah",
    icon: School,
  },
];

export function StudentShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { ready, user } = useRequireAuth(["STUDENT"], "/student/login");
  const [streakCurrent, setStreakCurrent] = useState<number | null>(null);
  const currentPage = navItems.find((item) => isActive(pathname, item)) ?? navItems[0];

  useEffect(() => {
    if (!ready) return;
    apiFetch<GameProfileSummary>("/student/game-profile")
      .then(({ data }) => setStreakCurrent(data.streakCurrent))
      .catch(() => setStreakCurrent(null));
  }, [ready]);

  if (!ready) {
    return (
      <main className="grid min-h-screen place-items-center px-4">
        <LoadingEvidence label="Mentor menyiapkan ruang belajarmu..." />
      </main>
    );
  }

  function handleLogout() {
    logout();
    router.push("/student/login");
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] pb-24 lg:pb-0">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-80 border-r border-slate-200 bg-white lg:block">
        <div className="flex h-full flex-col p-5">
          <Link className="mb-6 flex min-w-0 items-center gap-3" href="/student/dashboard">
            <span className="grid size-10 place-items-center rounded-[8px] bg-[#22c55e] text-white shadow-[0_5px_0_#129447]">
              <BookOpen size={22} strokeWidth={3} />
            </span>
            <span>
              <span className="block truncate font-heading text-lg font-black text-[#172033]">
                BaleBelajar
              </span>
              <span className="block text-xs font-black uppercase text-slate-400">
                Ruang Siswa
              </span>
            </span>
          </Link>

          <div className="mb-5 rounded-[8px] bg-[#172033] p-4 text-white">
            <p className="text-xs font-black uppercase text-white/55">Sedang aktif</p>
            <p className="font-heading mt-1 text-xl font-black">{user?.name ?? "Siswa"}</p>
            <p className="mt-1 text-sm font-bold text-white/70">
              Belajar bertahap: materi, contoh, tes, lalu rekomendasi.
            </p>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const active = isActive(pathname, item);
              const Icon = item.icon;

              return (
                <Link
                  className={[
                    "flex items-center gap-3 rounded-[8px] px-4 py-3 transition focus:outline-none focus:ring-4 focus:ring-[#bfdbfe]",
                    active ? "bg-[#eff6ff] text-[#2563eb]" : "text-slate-600 hover:bg-slate-50",
                  ].join(" ")}
                  href={item.href}
                  key={item.href}
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-[8px] bg-white/70">
                    <Icon size={20} />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-heading font-black">{item.label}</span>
                    <span className="block truncate text-xs font-bold opacity-70">{item.description}</span>
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto space-y-3">
            <div className="mission-node-active flex items-center gap-2 rounded-[8px] bg-[#fff7ed] px-4 py-3 text-sm font-black text-[#c2410c]">
              <Star size={17} fill="#f9c74f" />
              Rajin {streakCurrent ?? 0} hari
            </div>
            <button
              className="flex w-full items-center gap-3 rounded-[8px] px-4 py-3 text-left font-heading font-black text-slate-500 transition hover:bg-slate-50"
              onClick={handleLogout}
              type="button"
            >
              <LogOut size={20} />
              Keluar
            </button>
          </div>
        </div>
      </aside>

      <section className="lg:pl-80">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/88 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
            <Link className="flex min-w-0 items-center gap-3 lg:hidden" href="/student/dashboard">
              <span className="grid size-10 place-items-center rounded-[8px] bg-[#22c55e] text-white shadow-[0_5px_0_#129447]">
                <BookOpen size={22} strokeWidth={3} />
              </span>
              <span className="truncate font-heading text-lg font-black text-[#172033]">
                BaleBelajar
              </span>
            </Link>

            <div className="hidden min-w-0 lg:block">
              <p className="text-xs font-black uppercase text-slate-400">{currentPage.description}</p>
              <h1 className="truncate font-heading text-xl font-black text-[#172033]">
                {currentPage.label}
              </h1>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {user ? <RoleSwitcher user={user} /> : null}
              <div className="mission-node-active hidden items-center gap-2 rounded-full bg-[#fff7ed] px-3 py-2 text-sm font-black text-[#c2410c] sm:flex">
                <Star size={17} fill="#f9c74f" />
                {streakCurrent ?? 0} hari
              </div>
              <button
                aria-label="Keluar"
                className="grid size-10 place-items-center rounded-[8px] border border-slate-200 bg-white text-slate-600 shadow-sm lg:hidden"
                onClick={handleLogout}
                type="button"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        {children}
      </section>

      <nav className="fixed inset-x-3 bottom-3 z-40 rounded-[8px] border border-slate-200 bg-white/95 p-2 shadow-2xl backdrop-blur lg:hidden">
        <div
          className="hide-scrollbar grid auto-cols-[minmax(74px,1fr)] grid-flow-col gap-1 overflow-x-auto"
          style={{ gridTemplateColumns: `repeat(${navItems.length}, minmax(74px, 1fr))` }}
        >
          {navItems.map((item) => {
            const active = isActive(pathname, item);
            const Icon = item.icon;

            return (
              <Link
                className={[
                  "relative flex min-h-14 flex-col items-center justify-center gap-1 rounded-[8px] px-2 py-2 text-xs font-black transition focus:outline-none focus:ring-4 focus:ring-[#bfdbfe]",
                  active ? "bg-[#eff6ff] text-[#2563eb]" : "text-slate-500",
                ].join(" ")}
                href={item.href}
                key={item.href}
              >
                <Icon size={20} />
                {item.label}
                {active ? <span className="absolute inset-x-5 bottom-1 h-1 rounded-full bg-[#2563eb]" /> : null}
              </Link>
            );
          })}
        </div>
      </nav>
    </main>
  );
}

function isActive(pathname: string, item: { href: string; match?: string }) {
  const target = item.match ?? item.href.split("?")[0].split("#")[0];
  if (target === "/student/dashboard") return pathname === target;
  return pathname === target || pathname.startsWith(`${target}/`);
}

export function StatusPill({
  status,
}: {
  status: "Dikuasai" | "Sedang Berkembang" | "Perlu Latihan";
}) {
  const className =
    status === "Dikuasai"
      ? "bg-[#dcfce7] text-[#166534]"
      : status === "Sedang Berkembang"
        ? "bg-[#fef3c7] text-[#92400e]"
        : "bg-[#ffe4e6] text-[#9f1239]";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-black ${className}`}>
      {status}
    </span>
  );
}

export function ProgressBar({
  color = "bg-[#22c55e]",
  value,
}: {
  color?: string;
  value: number;
}) {
  return (
    <div className="h-4 overflow-hidden rounded-full bg-slate-100">
      <div
        className={`progress-reveal h-full rounded-full ${color}`}
        style={{ "--progress-width": `${value}%` } as React.CSSProperties}
      />
    </div>
  );
}
