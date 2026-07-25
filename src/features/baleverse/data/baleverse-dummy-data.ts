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

export interface DetectiveCurriculumModule {
  id: string;
  phase: string;
  title: string;
  goal: string;
  materials: string[];
  practice: string[];
  aiUse: string;
  status: StageStatus;
  estimatedDays: number;
}

export const detectiveCurriculum: DetectiveCurriculumModule[] = [
  {
    id: "detective-profile",
    phase: "Profil Detektif",
    title: "Kenali gaya berpikirmu",
    goal: "Siswa tahu kebiasaan belajarnya: cepat menebak, teliti membaca, atau butuh contoh lebih banyak.",
    materials: [
      "Cara membaca instruksi tanpa buru-buru",
      "Bedanya fakta, opini, dan asumsi",
      "Cara mencatat petunjuk kecil yang sering terlewat",
    ],
    practice: [
      "Pilih fakta dari cerita pendek",
      "Tandai kalimat yang masih asumsi",
      "Refleksi: bagian mana yang paling sering bikin salah",
    ],
    aiUse: "AI membaca pola jawaban awal dan memberi rekomendasi jalur: mulai dari observasi, kronologi, atau verifikasi.",
    status: "completed",
    estimatedDays: 1,
  },
  {
    id: "observation",
    phase: "Fondasi 1",
    title: "Observasi bukti",
    goal: "Siswa mampu menemukan informasi penting dari teks, gambar, tabel, atau percakapan.",
    materials: [
      "Apa itu bukti relevan",
      "Cara memilah detail penting dan detail pengalih",
      "Teknik scan: siapa, apa, kapan, di mana, mengapa, bagaimana",
    ],
    practice: [
      "Cari 5 petunjuk dari satu cerita kasus",
      "Pisahkan bukti kuat dan bukti lemah",
      "Susun kartu bukti berdasarkan kategori",
    ],
    aiUse: "AI menandai jenis bukti yang sering terlewat dan menyarankan materi ulang yang paling pendek.",
    status: "current",
    estimatedDays: 3,
  },
  {
    id: "chronology",
    phase: "Fondasi 2",
    title: "Kronologi kejadian",
    goal: "Siswa mampu menyusun urutan kejadian dan melihat bagian yang belum lengkap.",
    materials: [
      "Urutan waktu dan hubungan sebab-akibat",
      "Cara membaca kata penanda waktu",
      "Cara membuat timeline kasus",
    ],
    practice: [
      "Susun 6 kejadian acak menjadi timeline",
      "Cari kejadian yang mustahil terjadi duluan",
      "Lengkapi timeline dengan bukti pendukung",
    ],
    aiUse: "AI mengecek urutan yang dibuat siswa dan menjelaskan titik yang tidak konsisten.",
    status: "locked",
    estimatedDays: 4,
  },
  {
    id: "logic",
    phase: "Fondasi 3",
    title: "Logika kesimpulan",
    goal: "Siswa tidak hanya menjawab, tapi bisa menjelaskan alasan dari bukti menuju kesimpulan.",
    materials: [
      "Premis dan kesimpulan sederhana",
      "Pola jika-maka dalam kasus",
      "Kesalahan umum: lompat kesimpulan",
    ],
    practice: [
      "Pilih kesimpulan yang paling didukung bukti",
      "Tulis alasan dalam 2 kalimat",
      "Bandingkan dua hipotesis",
    ],
    aiUse: "AI memberi feedback apakah alasan siswa sudah berbasis bukti atau masih berupa tebakan.",
    status: "locked",
    estimatedDays: 5,
  },
  {
    id: "interview",
    phase: "Skill Detektif",
    title: "Wawancara dan pertanyaan tajam",
    goal: "Siswa belajar membuat pertanyaan yang menggali informasi, bukan pertanyaan yang mengarahkan jawaban.",
    materials: [
      "Pertanyaan terbuka vs tertutup",
      "Cara mendengar jawaban saksi",
      "Cara mencatat inkonsistensi tanpa menuduh",
    ],
    practice: [
      "Pilih pertanyaan terbaik untuk saksi",
      "Tandai jawaban yang tidak konsisten",
      "Buat 3 pertanyaan lanjutan",
    ],
    aiUse: "AI menyarankan pertanyaan lanjutan berdasarkan informasi yang belum tergali.",
    status: "locked",
    estimatedDays: 4,
  },
  {
    id: "verification",
    phase: "Skill Detektif",
    title: "Verifikasi dan anti-hoaks",
    goal: "Siswa mampu mengecek klaim, sumber, dan bukti sebelum percaya pada satu jawaban.",
    materials: [
      "Cara membedakan klaim dan bukti",
      "Sumber primer dan sumber sekunder",
      "Checklist verifikasi sederhana",
    ],
    practice: [
      "Cek klaim dari potongan berita",
      "Pilih sumber paling dapat dipercaya",
      "Berikan label: valid, meragukan, atau belum cukup bukti",
    ],
    aiUse: "AI memberi daftar bagian yang perlu dicek ulang, bukan langsung memberi jawaban final.",
    status: "locked",
    estimatedDays: 5,
  },
  {
    id: "ethics",
    phase: "Etika",
    title: "Etika seorang detektif",
    goal: "Siswa paham bahwa investigasi harus adil, menghargai privasi, dan tidak asal menuduh.",
    materials: [
      "Praduga tak bersalah",
      "Privasi dan batas bertanya",
      "Cara menyampaikan kesimpulan dengan hati-hati",
    ],
    practice: [
      "Pilih tindakan yang etis dalam skenario kasus",
      "Ubah kalimat tuduhan menjadi kalimat berbasis bukti",
      "Buat laporan singkat yang tidak menyudutkan",
    ],
    aiUse: "AI memeriksa nada laporan agar tidak menuduh tanpa bukti.",
    status: "locked",
    estimatedDays: 2,
  },
  {
    id: "capstone",
    phase: "Kasus Besar",
    title: "Pecahkan kasus lengkap",
    goal: "Siswa menggabungkan observasi, kronologi, logika, wawancara, verifikasi, dan etika dalam satu proyek.",
    materials: [
      "Template papan bukti",
      "Template timeline investigasi",
      "Template laporan final",
    ],
    practice: [
      "Kumpulkan bukti dari beberapa sumber",
      "Bangun timeline dan hipotesis",
      "Tulis laporan final beserta alasan",
    ],
    aiUse: "AI menjadi reviewer: memberi skor kejelasan, bukti yang kurang, dan rekomendasi modul penguatan.",
    status: "locked",
    estimatedDays: 7,
  },
];

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
      href: "/student/missions/first-mission",
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
      href: "/student/missions/first-mission",
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
    simplePurpose: "Jalur belajar untuk calon detektif: pahami materi, bongkar contoh kasus, baru latihan dengan analisis AI.",
    characterClass: "Calon Detektif",
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
      title: "Materi 1: Observasi Bukti",
      durationMinutes: 18,
      activities: 4,
      xpReward: 35,
      balePowerReward: 18,
      href: "/student/missions/first-mission",
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
