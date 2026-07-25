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
    title: "Materi 1: Observasi Bukti",
    story: "Sebelum memecahkan kasus, calon detektif harus belajar membaca petunjuk tanpa buru-buru menebak.",
    concept: "Detektif bekerja dari bukti. Langkah pertama adalah membedakan fakta, asumsi, dan detail pengalih. Setelah paham materi, baru masuk latihan kasus.",
    rewardXp: 35,
    rewardPower: 18,
    activities: [
      {
        id: "d1",
        prompt: "Dalam kasus detektif, mana yang termasuk fakta paling kuat?",
        options: [
          { id: "a", label: "Aku merasa pelakunya orang itu", feedback: "Ini asumsi karena belum ada bukti pendukung.", correct: false },
          { id: "b", label: "Kamera mencatat pintu terbuka pukul 07.10", feedback: "Benar. Ini fakta karena spesifik dan punya sumber bukti.", correct: true },
          { id: "c", label: "Ruangan itu terlihat mencurigakan", feedback: "Ini kesan, belum cukup jadi fakta.", correct: false },
        ],
      },
    ],
  },
};
