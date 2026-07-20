import {
  BarChart3,
  BookOpen,
  Calculator,
  CircleDot,
  ClipboardCheck,
  LucideIcon,
  Medal,
  Target,
} from "lucide-react";

export type Mission = {
  title: string;
  subtitle: string;
  progress: number;
  icon: LucideIcon;
  tone: "green" | "blue" | "yellow" | "red";
  status: "Selesai" | "Aktif" | "Berikutnya";
};

export type Competency = {
  label: string;
  score: number;
  status: "Dikuasai" | "Sedang Berkembang" | "Perlu Latihan";
};

export const missions: Mission[] = [
  {
    title: "Misi Perbandingan",
    subtitle: "10 soal diagnostik - 12 menit",
    progress: 64,
    icon: Calculator,
    tone: "green",
    status: "Aktif",
  },
  {
    title: "Cek Pecahan",
    subtitle: "Selesai kemarin - skor 84%",
    progress: 100,
    icon: Medal,
    tone: "blue",
    status: "Selesai",
  },
  {
    title: "Bangun Datar",
    subtitle: "Terbuka setelah misi aktif",
    progress: 0,
    icon: CircleDot,
    tone: "yellow",
    status: "Berikutnya",
  },
];

export const competencies: Competency[] = [
  { label: "Operasi pecahan", score: 88, status: "Dikuasai" },
  { label: "Membaca soal cerita", score: 74, status: "Sedang Berkembang" },
  { label: "Perbandingan senilai", score: 58, status: "Perlu Latihan" },
];

export const weeklyPlan = [
  "Ulangi contoh perbandingan 10 menit",
  "Kerjakan 5 latihan soal cerita",
  "Bahas soal yang ditandai dengan guru",
  "Coba mini-kuis perbandingan",
];

export const quickStats = [
  { label: "Misi selesai", value: "2", icon: ClipboardCheck },
  { label: "Kompetensi dikuasai", value: "5", icon: Target },
  { label: "Rata-rata skor", value: "82%", icon: BarChart3 },
  { label: "Materi aktif", value: "Matematika", icon: BookOpen },
];

