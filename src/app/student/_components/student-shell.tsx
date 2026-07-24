"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Compass, Home, MapPinned, Star, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useRequireAuth } from "@/lib/auth";
import { GameProfileSummary } from "@/lib/types";
import { RoleSwitcher } from "@/components/role-switcher";
import { LoadingEvidence } from "./motion-kit";

const navItems = [
  { href: "/student/dashboard", label: "Beranda", icon: Home },
  { href: "/student/dashboard#dunia", label: "Dunia", icon: Compass },
  { href: "/student/dashboard#misi", label: "Misi", icon: Star },
  { href: "/student/growth-map", label: "Rank", icon: MapPinned },
  { href: "/student/profile", label: "Profil", icon: UserRound },
];

export function StudentShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { ready, user } = useRequireAuth(["STUDENT"], "/student/login");
  const [streakCurrent, setStreakCurrent] = useState<number | null>(null);

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

  return (
    <main className="min-h-screen pb-24">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/88 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link className="flex min-w-0 items-center gap-3" href="/student/dashboard">
            <span className="grid size-10 place-items-center rounded-[8px] bg-[#22c55e] text-white shadow-[0_5px_0_#129447]">
              <BookOpen size={22} strokeWidth={3} />
            </span>
            <span className="truncate font-heading text-lg font-black text-[#172033]">
              BaleBelajar
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-2">
            {user ? <RoleSwitcher user={user} /> : null}
            <div className="mission-node-active flex items-center gap-2 rounded-full bg-[#fff7ed] px-3 py-2 text-sm font-black text-[#c2410c]">
              <Star size={17} fill="#f9c74f" />
              {streakCurrent ?? 0} hari
            </div>
          </div>
        </div>
      </header>

      {children}

      <nav className="fixed inset-x-3 bottom-3 z-40 rounded-[8px] border border-slate-200 bg-white/95 p-2 shadow-2xl backdrop-blur md:hidden">
        <div className="grid grid-cols-5 gap-1">
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href === "/student/dashboard" && pathname === "/student/dashboard");
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
