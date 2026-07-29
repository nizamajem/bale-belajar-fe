import { BaleMission } from "../types";

export const missionsDummyData: BaleMission[] = [
  {
    id: "numeria-distribusi-01",
    worldKey: "numeria",
    title: "Gerbang Distribusi",
    story: "Jembatan Numeria macet karena angka di dalam kurung belum terbuka dengan benar.",
    goal: "Memahami cara mendistribusikan angka ke dua bagian dalam kurung.",
    estimatedMinutes: 8,
    rewardXp: 90,
    rewardDayaBale: 18,
    prompt: "Bentuk yang setara dengan 3(x + 4) adalah...",
    options: [
      { id: "a", label: "A", text: "3x + 4", correct: false, feedback: "Angka 3 baru dikalikan ke x. Bagian +4 juga perlu mendapat 3." },
      { id: "b", label: "B", text: "3x + 12", correct: true, feedback: "Benar. Kamu sudah mendistribusikan angka 3 ke x dan 4." },
      { id: "c", label: "C", text: "x + 12", correct: false, feedback: "Bagian 4 sudah dikali 3, tetapi x juga perlu dikali 3." },
      { id: "d", label: "D", text: "7x", correct: false, feedback: "Tanda kurung tidak digabung dengan menjumlahkan semua simbol." },
    ],
    hints: [
      "Coba lihat 3(x + 4) sebagai 3 kali semua isi kurung.",
      "Kalikan 3 dengan x, lalu kalikan 3 dengan 4.",
      "Hasilnya punya dua bagian: 3x dan 12.",
    ],
    teachBackPrompt: "Jelaskan dengan bahasamu: kenapa 4 juga harus dikali 3?",
  },
];
