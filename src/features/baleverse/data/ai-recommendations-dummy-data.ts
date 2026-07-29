import { AiRecommendation } from "../types";

export const aiRecommendationsDummyData: Record<string, AiRecommendation> = {
  normal: {
    recommended_action: "continue_mission",
    reason: "Siswa siap mencoba misi kecil selama 8 menit.",
    confidence: "high",
    target_skill: "Distribusi aljabar dasar",
    difficulty: "ringan",
    suggested_duration_minutes: 8,
    human_help_required: false,
    human_help_type: null,
    shareable_context: [],
    safety_flags: [],
  },
  mentorNeeded: {
    recommended_action: "request_mentor_review",
    reason: "Kesalahan yang sama muncul setelah tiga tingkat petunjuk.",
    confidence: "low",
    target_skill: "Distribusi aljabar dasar",
    difficulty: "ringan",
    suggested_duration_minutes: 5,
    human_help_required: true,
    human_help_type: "mentor",
    shareable_context: ["nama misi", "topik", "jawaban terakhir", "hint yang sudah dipakai", "pola kesalahan"],
    safety_flags: [],
  },
};
