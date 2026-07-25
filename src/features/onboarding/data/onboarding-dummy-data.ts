export type GradeChoiceId =
  | "kelas-10"
  | "kelas-11"
  | "kelas-12"
  | "lulus"
  | "level-sendiri";

export type SelfLevelId = "baru" | "dasar" | "menengah" | "lanjut";

export type LearningGoalId =
  | "pelajaran"
  | "ujian"
  | "informatika"
  | "detektif"
  | "kebiasaan"
  | "semuanya";

export type FirstWorldId = "numeria" | "kodex" | "detectivia";

export type AvatarBaseId = "buku" | "kompas" | "detektif" | "robot" | "dokter" | "arsitek";
export type AvatarColorId = "green" | "blue" | "purple" | "amber";
export type AvatarAccessoryId = "none" | "lens" | "cap" | "spark" | "badge" | "backpack";
export type AvatarSkinToneId = "cerah" | "kuning" | "sawo" | "gelap";
export type AvatarHeightId = "pendek" | "normal" | "tinggi";
export type AvatarBodyId = "slim" | "normal" | "strong";

export type StudentOnboardingState = {
  nickname?: string;
  gradeChoice?: GradeChoiceId;
  selfLevel?: SelfLevelId;
  goal?: LearningGoalId;
  world?: FirstWorldId;
  avatar?: {
    base: AvatarBaseId;
    color: AvatarColorId;
    accessory: AvatarAccessoryId;
    skinTone?: AvatarSkinToneId;
    height?: AvatarHeightId;
    body?: AvatarBodyId;
    heroName: string;
  };
  placementAnswers?: Record<string, string>;
  placementCompleted?: boolean;
};

export const gradeChoices: {
  id: GradeChoiceId;
  label: string;
  description: string;
}[] = [
  { id: "kelas-10", label: "Kelas 10", description: "Mulai dari fondasi SMA/SMK." },
  { id: "kelas-11", label: "Kelas 11", description: "Naikkan pemahaman inti." },
  { id: "kelas-12", label: "Kelas 12", description: "Siap ujian dan target akhir." },
  { id: "lulus", label: "Lulus sekolah", description: "Belajar mandiri dari dasar." },
  { id: "level-sendiri", label: "Pilih level sendiri", description: "Kalau kelasmu tidak pas." },
];

export const selfLevels: { id: SelfLevelId; label: string }[] = [
  { id: "baru", label: "Baru mulai" },
  { id: "dasar", label: "Sudah paham dasar" },
  { id: "menengah", label: "Siap menengah" },
  { id: "lanjut", label: "Siap tantangan lanjut" },
];

export const learningGoals: {
  id: LearningGoalId;
  label: string;
  description: string;
}[] = [
  { id: "pelajaran", label: "Lebih paham pelajaran", description: "Biar materi sekolah lebih masuk." },
  { id: "ujian", label: "Persiapan ujian", description: "Latihan terarah dan tidak panik." },
  { id: "informatika", label: "Belajar informatika", description: "Pahami logika komputer dari dasar." },
  { id: "detektif", label: "Melatih logika detektif", description: "Baca petunjuk, urutkan bukti, simpulkan." },
  { id: "kebiasaan", label: "Bangun kebiasaan belajar", description: "Mulai pendek, tapi konsisten." },
  { id: "semuanya", label: "Jelajahi semuanya", description: "Coba beberapa dunia dulu." },
];

export const firstWorlds: {
  id: FirstWorldId;
  name: string;
  subject: string;
  promise: string;
  theme: string;
}[] = [
  {
    id: "numeria",
    name: "Numeria",
    subject: "Matematika",
    promise: "Belajar angka lewat jembatan, pola, dan teka-teki logika.",
    theme: "from-indigo-600 to-amber-500",
  },
  {
    id: "kodex",
    name: "KodeX",
    subject: "Informatika",
    promise: "Belajar cara berpikir komputer lewat kota variabel dan instruksi.",
    theme: "from-blue-600 to-cyan-500",
  },
  {
    id: "detectivia",
    name: "Detectivia",
    subject: "Deteksi dan Logika",
    promise: "Belajar berpikir teliti lewat petunjuk, kronologi, dan bukti.",
    theme: "from-slate-900 to-violet-700",
  },
];

export const avatarBases: { id: AvatarBaseId; label: string; vibe: string }[] = [
  { id: "buku", label: "Penjelajah Buku", vibe: "Ramah dan penasaran" },
  { id: "kompas", label: "Navigator Misi", vibe: "Suka menjelajah" },
  { id: "detektif", label: "Detektif Cilik", vibe: "Teliti cari petunjuk" },
  { id: "robot", label: "Robot Kode", vibe: "Logis dan fokus" },
  { id: "dokter", label: "Dokter Muda", vibe: "Peduli dan observan" },
  { id: "arsitek", label: "Arsitek Angka", vibe: "Rapi membangun pola" },
];

export const avatarColors: { id: AvatarColorId; label: string; className: string; hex: string; shadow: string }[] = [
  { id: "green", label: "Hijau Bale", className: "bg-[#22c55e]", hex: "#22c55e", shadow: "#129447" },
  { id: "blue", label: "Biru Kode", className: "bg-[#2563eb]", hex: "#2563eb", shadow: "#1e40af" },
  { id: "purple", label: "Ungu Detektif", className: "bg-[#6d28d9]", hex: "#6d28d9", shadow: "#4c1d95" },
  { id: "amber", label: "Kuning Fokus", className: "bg-[#f59e0b]", hex: "#f59e0b", shadow: "#b45309" },
];

export const avatarAccessories: { id: AvatarAccessoryId; label: string }[] = [
  { id: "none", label: "Polos" },
  { id: "lens", label: "Lensa" },
  { id: "cap", label: "Topi" },
  { id: "spark", label: "Spark" },
  { id: "badge", label: "Badge" },
  { id: "backpack", label: "Tas" },
];

export const avatarSkinTones: { id: AvatarSkinToneId; label: string; hex: string }[] = [
  { id: "cerah", label: "Cerah", hex: "#f6d7b8" },
  { id: "kuning", label: "Kuning langsat", hex: "#eec48e" },
  { id: "sawo", label: "Sawo matang", hex: "#b97a56" },
  { id: "gelap", label: "Gelap hangat", hex: "#7c4a35" },
];

export const avatarHeights: { id: AvatarHeightId; label: string }[] = [
  { id: "pendek", label: "Agak Pendek" },
  { id: "normal", label: "Normal" },
  { id: "tinggi", label: "Tinggi" },
];

export const avatarBodies: { id: AvatarBodyId; label: string }[] = [
  { id: "slim", label: "Ramping" },
  { id: "normal", label: "Normal" },
  { id: "strong", label: "Kuat" },
];

export const placementQuestions = [
  {
    id: "q1",
    prompt: "Kalau misi terasa sulit, apa langkah terbaik?",
    options: [
      { id: "a", label: "Menebak cepat" },
      { id: "b", label: "Cari petunjuk dan coba satu langkah" },
      { id: "c", label: "Langsung menyerah" },
    ],
    correctOptionId: "b",
  },
  {
    id: "q2",
    prompt: "Urutan belajar yang paling aman adalah...",
    options: [
      { id: "a", label: "Cerita, konsep, contoh, latihan" },
      { id: "b", label: "Hadiah dulu, konsep nanti" },
      { id: "c", label: "Jawaban final tanpa alasan" },
    ],
    correctOptionId: "a",
  },
  {
    id: "q3",
    prompt: "Mastery naik karena...",
    options: [
      { id: "a", label: "Sering klik tombol" },
      { id: "b", label: "Paham dan bisa menjelaskan alasan" },
      { id: "c", label: "Punya poin paling banyak" },
    ],
    correctOptionId: "b",
  },
];
