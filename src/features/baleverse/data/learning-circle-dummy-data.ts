export const learningCircleDummyData = {
  mentor: { name: "Kak Arya", status: "Siap membantu misi matematika sore ini." },
  parent: { name: "Ibu Rina", status: "Mengirim dukungan: belajar 10 menit dulu sudah cukup." },
  parentSupportRequest: {
    parentName: "Ibu Rina",
    reason: "Nara butuh dukungan jadwal ringan setelah menunggu feedback mentor.",
    shareableContext: ["target minggu ini", "nama misi", "durasi belajar yang disarankan"],
    messageDraft: "Aku sedang menunggu feedback mentor. Boleh bantu ingatkan aku belajar 10 menit setelah istirahat?",
    status: "draft",
  },
  mentorFeedback: {
    mentorName: "Kak Arya",
    missionTitle: "Gerbang Distribusi",
    message: "Coba tulis 3(x + 4) sebagai 3 x x ditambah 3 x 4. Kamu tidak perlu menggabungkan x dan angka 4.",
    nextAction: "Kerjakan satu contoh ringan: 2(y + 5).",
    masteryReview: "needsMoreEvidence",
  },
  auditLog: [
    "Nara menyetujui data misi dibagikan ke mentor.",
    "Chat AI lengkap tidak dibagikan.",
    "Nara memilih data dukungan orang tua sebelum pesan dikirim.",
  ],
};
