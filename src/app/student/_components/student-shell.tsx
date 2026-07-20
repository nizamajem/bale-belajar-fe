"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, ChartNoAxesColumn, Home, Star, UserRound } from "lucide-react";

const navItems = [
  { href: "/student/dashboard", label: "Beranda", icon: Home },
  { href: "/student/attempts/demo", label: "Misi", icon: BookOpen },
  { href: "/student/history", label: "Hasil", icon: ChartNoAxesColumn },
  { href: "/student/profile", label: "Profil", icon: UserRound },
];

export function StudentShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <main className="min-h-screen pb-24">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/88 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link className="flex items-center gap-3" href="/student/dashboard">
            <span className="grid size-10 place-items-center rounded-[8px] bg-[#22c55e] text-white shadow-[0_5px_0_#129447]">
              <BookOpen size={22} strokeWidth={3} />
            </span>
            <span className="font-heading text-lg font-black text-[#172033]">
              BaleBelajar
            </span>
          </Link>

          <div className="flex items-center gap-2 rounded-full bg-[#fff7ed] px-3 py-2 text-sm font-black text-[#c2410c]">
            <Star size={17} fill="#f9c74f" />
            7 hari
          </div>
        </div>
      </header>

      {children}

      <nav className="fixed inset-x-3 bottom-3 z-40 rounded-[8px] border border-slate-200 bg-white/95 p-2 shadow-2xl backdrop-blur md:hidden">
        <div className="grid grid-cols-4 gap-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                className={[
                  "flex flex-col items-center justify-center gap-1 rounded-[8px] px-2 py-2 text-xs font-black",
                  active ? "bg-[#eff6ff] text-[#2563eb]" : "text-slate-500",
                ].join(" ")}
                href={item.href}
                key={item.href}
              >
                <Icon size={20} />
                {item.label}
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
      <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
    </div>
  );
}
