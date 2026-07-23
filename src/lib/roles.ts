import { GraduationCap, Presentation, ShieldCheck, type LucideIcon } from "lucide-react";
import { UserRole } from "./auth";

export type SwitchableRole = "STUDENT" | "TEACHER";

type RoleMeta = {
  label: string;
  icon: LucideIcon;
  color: string;
  shadowColor: string;
  dashboardPath: string;
};

export const ROLE_META: Record<UserRole, RoleMeta> = {
  STUDENT: {
    label: "Siswa",
    icon: GraduationCap,
    color: "#22c55e",
    shadowColor: "#129447",
    dashboardPath: "/student/dashboard",
  },
  TEACHER: {
    label: "Guru",
    icon: Presentation,
    color: "#2563eb",
    shadowColor: "#1d4ed8",
    dashboardPath: "/teacher/dashboard",
  },
  ADMIN: {
    label: "Admin",
    icon: ShieldCheck,
    color: "#172033",
    shadowColor: "#0b0f1a",
    dashboardPath: "/admin/dashboard",
  },
  SUPER_ADMIN: {
    label: "Super Admin",
    icon: ShieldCheck,
    color: "#172033",
    shadowColor: "#0b0f1a",
    dashboardPath: "/admin/dashboard",
  },
};

// Hanya kombinasi Siswa+Guru yang bisa dipindah lewat switcher untuk saat ini.
export const SWITCHABLE_ROLES: SwitchableRole[] = ["STUDENT", "TEACHER"];
