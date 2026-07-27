export type CareerPathId =
  | "DETECTIVE"
  | "ANIMAL_DOCTOR"
  | "KOREAN_AMBASSADOR"
  | "PROGRAMMER"
  | "DOCTOR"
  | "ARCHITECT"
  | "ENTREPRENEUR"
  | "CONTENT_CREATOR"
  | "TEACHER";

export type CareerPathConfig = {
  id: CareerPathId;
  title: string;
  academyName: string;
  tagline: string;
  status: "ACTIVE" | "COMING_SOON";
  gradient: string;
  shadowColor: string;
  accentBg: string;
  accentText: string;
};

export const careerPaths: CareerPathConfig[] = [
  {
    id: "DETECTIVE",
    title: "Detektif Muda",
    academyName: "Akademi BaleDetective",
    tagline: "Amati petunjuk, uji bukti, dan pecahkan misteri langkah demi langkah.",
    status: "ACTIVE",
    gradient: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
    shadowColor: "#0b1120",
    accentBg: "bg-[#fef9c3]",
    accentText: "text-[#854d0e]",
  },
  {
    id: "ANIMAL_DOCTOR",
    title: "Dokter Hewan Muda",
    academyName: "Akademi BaleVet",
    tagline: "Belajar merawat hewan sambil memahami sains, empati, dan data kesehatan.",
    status: "COMING_SOON",
    gradient: "linear-gradient(135deg, #059669 0%, #065f46 100%)",
    shadowColor: "#064e3b",
    accentBg: "bg-[#d1fae5]",
    accentText: "text-[#065f46]",
  },
  {
    id: "KOREAN_AMBASSADOR",
    title: "Duta Bahasa Korea",
    academyName: "Akademi BaleLanguage",
    tagline: "Bangun kemampuan bahasa, budaya, komunikasi, dan percaya diri.",
    status: "COMING_SOON",
    gradient: "linear-gradient(135deg, #db2777 0%, #9d174d 100%)",
    shadowColor: "#831843",
    accentBg: "bg-[#fce7f3]",
    accentText: "text-[#9d174d]",
  },
  {
    id: "PROGRAMMER",
    title: "Programmer Muda",
    academyName: "Akademi BaleCode",
    tagline: "Mulai dari logika, pola, problem solving, sampai proyek aplikasi kecil.",
    status: "COMING_SOON",
    gradient: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
    shadowColor: "#1e3a8a",
    accentBg: "bg-[#dbeafe]",
    accentText: "text-[#1d4ed8]",
  },
  {
    id: "DOCTOR",
    title: "Dokter Muda",
    academyName: "Akademi BaleMed",
    tagline: "Kenali tubuh manusia, kebiasaan sehat, dan cara berpikir berbasis bukti.",
    status: "COMING_SOON",
    gradient: "linear-gradient(135deg, #0891b2 0%, #155e75 100%)",
    shadowColor: "#164e63",
    accentBg: "bg-[#cffafe]",
    accentText: "text-[#0e7490]",
  },
  {
    id: "ARCHITECT",
    title: "Arsitek Muda",
    academyName: "Akademi BaleBuild",
    tagline: "Latih imajinasi ruang, matematika visual, desain, dan presentasi ide.",
    status: "COMING_SOON",
    gradient: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)",
    shadowColor: "#4c1d95",
    accentBg: "bg-[#ede9fe]",
    accentText: "text-[#6d28d9]",
  },
  {
    id: "ENTREPRENEUR",
    title: "Pengusaha Muda",
    academyName: "Akademi BaleBiz",
    tagline: "Belajar membaca masalah, membuat solusi, menghitung biaya, dan menjual ide.",
    status: "COMING_SOON",
    gradient: "linear-gradient(135deg, #ea580c 0%, #9a3412 100%)",
    shadowColor: "#7c2d12",
    accentBg: "bg-[#ffedd5]",
    accentText: "text-[#c2410c]",
  },
  {
    id: "CONTENT_CREATOR",
    title: "Kreator Konten Muda",
    academyName: "Akademi BaleCreator",
    tagline: "Bangun ide, naskah, visual, storytelling, dan etika digital.",
    status: "COMING_SOON",
    gradient: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
    shadowColor: "#7f1d1d",
    accentBg: "bg-[#fee2e2]",
    accentText: "text-[#b91c1c]",
  },
  {
    id: "TEACHER",
    title: "Guru Muda",
    academyName: "Akademi BaleTeach",
    tagline: "Latih cara menjelaskan, membuat contoh, membantu teman, dan memimpin belajar.",
    status: "COMING_SOON",
    gradient: "linear-gradient(135deg, #16a34a 0%, #166534 100%)",
    shadowColor: "#14532d",
    accentBg: "bg-[#dcfce7]",
    accentText: "text-[#166534]",
  },
];

export function getCareerPathConfig(id?: string | null): CareerPathConfig | null {
  return careerPaths.find((path) => path.id === id) ?? null;
}
