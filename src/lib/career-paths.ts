export type CareerPathId = "DETECTIVE" | "ANIMAL_DOCTOR" | "KOREAN_TEACHER";

export type CareerPathConfig = {
  id: CareerPathId;
  title: string;
  tagline: string;
  emoji: string;
  gradient: string;
  shadowColor: string;
  accentBg: string;
  accentText: string;
};

export const careerPaths: CareerPathConfig[] = [
  {
    id: "DETECTIVE",
    title: "Detektif Angka",
    tagline: "Pecahkan misteri lewat pola dan logika matematika.",
    emoji: "🕵️",
    gradient: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
    shadowColor: "#0b1120",
    accentBg: "bg-[#fef9c3]",
    accentText: "text-[#854d0e]",
  },
  {
    id: "ANIMAL_DOCTOR",
    title: "Dokter Hewan Muda",
    tagline: "Rawat sahabat berbulu sambil mengasah kemampuan berhitung.",
    emoji: "🐾",
    gradient: "linear-gradient(135deg, #059669 0%, #065f46 100%)",
    shadowColor: "#064e3b",
    accentBg: "bg-[#d1fae5]",
    accentText: "text-[#065f46]",
  },
  {
    id: "KOREAN_TEACHER",
    title: "Duta Bahasa Korea",
    tagline: "Asah logika sambil bersiap jadi jembatan dua budaya.",
    emoji: "🌸",
    gradient: "linear-gradient(135deg, #db2777 0%, #9d174d 100%)",
    shadowColor: "#831843",
    accentBg: "bg-[#fce7f3]",
    accentText: "text-[#9d174d]",
  },
];

export function getCareerPathConfig(id?: string | null): CareerPathConfig | null {
  return careerPaths.find((path) => path.id === id) ?? null;
}
