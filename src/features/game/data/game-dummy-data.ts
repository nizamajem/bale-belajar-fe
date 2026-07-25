import { FirstWorldId } from "@/features/onboarding/data/onboarding-dummy-data";

export type DummyMissionActivity = {
  id: string;
  prompt: string;
  options: { id: string; label: string; feedback: string; correct: boolean }[];
};

export type DummyFirstMission = {
  id: string;
  worldId: FirstWorldId;
  title: string;
  story: string;
  concept: string;
  rewardXp: number;
  rewardPower: number;
  activities: DummyMissionActivity[];
};

export const firstMissions: Record<FirstWorldId, DummyFirstMission> = {
  numeria: {
    id: "first-mission",
    worldId: "numeria",
    title: "Perbaiki Jembatan Persamaan",
    story: "Jembatan Numeria patah karena angka kiri dan kanan belum seimbang.",
    concept: "Persamaan itu seperti timbangan. Dua sisi harus tetap seimbang.",
    rewardXp: 30,
    rewardPower: 15,
    activities: [
      {
        id: "n1",
        prompt: "Jika x + 3 = 7, nilai x adalah...",
        options: [
          { id: "a", label: "3", feedback: "Coba kurangi 7 dengan 3.", correct: false },
          { id: "b", label: "4", feedback: "Benar. 4 + 3 = 7.", correct: true },
          { id: "c", label: "10", feedback: "Itu hasil penjumlahan, bukan nilai x.", correct: false },
        ],
      },
    ],
  },
  kodex: {
    id: "first-mission",
    worldId: "kodex",
    title: "Nyalakan Kota Variabel",
    story: "Lampu kota KodeX mati karena variabel belum diberi nilai.",
    concept: "Variabel adalah kotak nama yang menyimpan informasi.",
    rewardXp: 25,
    rewardPower: 12,
    activities: [
      {
        id: "k1",
        prompt: "Kalau nama = 'Bale', variabel yang menyimpan teks adalah...",
        options: [
          { id: "a", label: "nama", feedback: "Benar. nama adalah kotak penyimpan teks.", correct: true },
          { id: "b", label: "Bale", feedback: "Bale adalah isi kotaknya.", correct: false },
          { id: "c", label: "=", feedback: "Tanda ini dipakai untuk mengisi nilai.", correct: false },
        ],
      },
    ],
  },
  detectivia: {
    id: "first-mission",
    worldId: "detectivia",
    title: "Susun Kronologi Bukti",
    story: "Ada tiga petunjuk tercecer. Tugasmu menyusun kejadian paling masuk akal.",
    concept: "Detektif belajar dari bukti, bukan tebakan. Urutan waktu membantu membuat kesimpulan.",
    rewardXp: 35,
    rewardPower: 18,
    activities: [
      {
        id: "d1",
        prompt: "Petunjuk mana yang paling penting untuk menyusun kronologi?",
        options: [
          { id: "a", label: "Warna ruangan", feedback: "Bisa berguna, tapi belum menunjukkan urutan.", correct: false },
          { id: "b", label: "Waktu kejadian", feedback: "Benar. Waktu membantu menyusun urutan.", correct: true },
          { id: "c", label: "Nama kota", feedback: "Ini konteks, bukan urutan kejadian.", correct: false },
        ],
      },
    ],
  },
};
