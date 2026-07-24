export type WorldId = "numeria" | "kodex" | "detectivia";

export type StageStatus = "completed" | "current" | "locked";
export type PowerStatus = "equipped" | "available" | "locked";

export interface WorldTheme {
  accent: string;
  accentDark: string;
  bg: string;
  surface: string;
  text: string;
}

export interface Mission {
  title: string;
  durationMinutes: number;
  activities: number;
  xpReward: number;
  balePowerReward: number;
  href: string;
}

export interface SkillProgress {
  name: string;
  value: number;
  description: string;
}

export interface Power {
  name: string;
  status: PowerStatus;
  description: string;
}

export interface LearningWorld {
  id: WorldId;
  name: string;
  subject: string;
  simplePurpose: string;
  characterClass: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  mastery: number;
  currentArea: string;
  rank: string;
  theme: WorldTheme;
  mission: Mission;
  skills: SkillProgress[];
  powers: Power[];
}

export interface JourneyStage {
  label: string;
  status: StageStatus;
  progressText: string;
  unlockHint?: string;
}

export interface QuickAction {
  label: string;
  description: string;
}

export interface LearningCircleItem {
  label: string;
  message: string;
}

export const baleverseWorlds: LearningWorld[] = [
  {
    id: "numeria",
    name: "Numeria",
    subject: "Matematika",
    simplePurpose: "Belajar angka lewat jembatan, pola, dan teka-teki logika.",
    characterClass: "Arsitek Logika",
    level: 18,
    xp: 62,
    nextLevelXp: 100,
    mastery: 62,
    currentArea: "Jembatan Persamaan",
    rank: "Penjelajah Fondasi",
    theme: {
      accent: "#f59e0b",
      accentDark: "#4f46e5",
      bg: "linear-gradient(135deg,#4f46e5,#f59e0b)",
      surface: "#fff7ed",
      text: "#312e81",
    },
    mission: {
      title: "Perbaiki Jembatan Persamaan",
      durationMinutes: 12,
      activities: 5,
      xpReward: 30,
      balePowerReward: 15,
      href: "/student/world/numeria",
    },
    skills: [
      { name: "Pola Persamaan", value: 62, description: "Mulai stabil" },
      { name: "Logika Angka", value: 48, description: "Butuh 2 misi lagi" },
      { name: "Strategi Soal", value: 71, description: "Siap pengayaan" },
    ],
    powers: [
      { name: "Focus Lens", status: "equipped", description: "Sorot bagian penting soal." },
      { name: "Hint Builder", status: "available", description: "Buka petunjuk bertahap." },
      { name: "Pattern Scanner", status: "locked", description: "Terbuka di mastery 70%." },
    ],
  },
  {
    id: "kodex",
    name: "KodeX",
    subject: "Informatika",
    simplePurpose: "Belajar cara berpikir komputer lewat kota variabel dan instruksi.",
    characterClass: "Penjelajah Kode",
    level: 11,
    xp: 44,
    nextLevelXp: 100,
    mastery: 44,
    currentArea: "Kota Variabel",
    rank: "Perakit Algoritma",
    theme: {
      accent: "#06b6d4",
      accentDark: "#2563eb",
      bg: "linear-gradient(135deg,#2563eb,#06b6d4)",
      surface: "#ecfeff",
      text: "#155e75",
    },
    mission: {
      title: "Nyalakan Kota Variabel",
      durationMinutes: 10,
      activities: 4,
      xpReward: 25,
      balePowerReward: 12,
      href: "/student/world/kodex",
    },
    skills: [
      { name: "Logika IF", value: 44, description: "Sedang naik" },
      { name: "Urutan Instruksi", value: 57, description: "Cukup kuat" },
      { name: "Debug Ringan", value: 33, description: "Perlu latihan" },
    ],
    powers: [
      { name: "Code Lens", status: "equipped", description: "Pisahkan langkah program." },
      { name: "Debug Pulse", status: "available", description: "Cari bagian yang janggal." },
      { name: "Robot Pair", status: "locked", description: "Terbuka setelah 3 misi." },
    ],
  },
  {
    id: "detectivia",
    name: "Detectivia",
    subject: "Deteksi dan Logika",
    simplePurpose: "Belajar berpikir teliti lewat petunjuk, urutan kejadian, dan bukti.",
    characterClass: "Bale Sleuth",
    level: 7,
    xp: 38,
    nextLevelXp: 100,
    mastery: 38,
    currentArea: "Kota Kronologi",
    rank: "Analis Pemula",
    theme: {
      accent: "#6d28d9",
      accentDark: "#172033",
      bg: "linear-gradient(135deg,#172033,#6d28d9)",
      surface: "#f5f3ff",
      text: "#4c1d95",
    },
    mission: {
      title: "Susun Kronologi Bukti",
      durationMinutes: 15,
      activities: 6,
      xpReward: 35,
      balePowerReward: 18,
      href: "/student/world/detectivia",
    },
    skills: [
      { name: "Observasi", value: 52, description: "Bukti makin rapi" },
      { name: "Kronologi", value: 38, description: "Perlu urutkan lagi" },
      { name: "Verifikasi", value: 46, description: "Mulai teliti" },
    ],
    powers: [
      { name: "Evidence Lens", status: "equipped", description: "Sorot bukti relevan." },
      { name: "Timeline Builder", status: "available", description: "Susun kejadian." },
      { name: "Ethics Shield", status: "locked", description: "Terbuka setelah mastery 60%." },
    ],
  },
];

export const journeyStages: JourneyStage[] = [
  { label: "Orientasi", status: "completed", progressText: "Selesai" },
  { label: "Fondasi", status: "current", progressText: "2/4 misi" },
  {
    label: "Power",
    status: "locked",
    progressText: "Terkunci",
    unlockHint: "Power terbuka setelah menyelesaikan 3 misi Fondasi dan mencapai Mastery 60%.",
  },
  {
    label: "Karya",
    status: "locked",
    progressText: "Terkunci",
    unlockHint: "Karya terbuka setelah kamu memasang minimal 2 power dan menyelesaikan misi proyek.",
  },
];

export const quickActions: QuickAction[] = [
  { label: "Tanya Bale", description: "Kalau bingung, minta petunjuk." },
  { label: "Cek Paham", description: "Tes cepat: sudah paham atau belum." },
  { label: "Pindai Materi", description: "Cari bagian penting dari materi." },
  { label: "Kuis Kilat", description: "Latihan singkat sebelum lanjut." },
];

export const learningCircle: LearningCircleItem[] = [
  { label: "Mentor", message: "Hari ini cukup fokus ke satu misi utama dulu." },
  { label: "Orang Tua", message: "Kirim kabar progres mingguan saat misi selesai." },
  { label: "Bantuan", message: "Minta bantuan jika stuck lebih dari 5 menit." },
];
