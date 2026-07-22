export type PilotStatus =
  | "PROSPECT"
  | "CONTACTED"
  | "DEMO"
  | "ACTIVE_PILOT"
  | "EVALUATION"
  | "COMPLETED"
  | "DISCONTINUED";

export type School = {
  id: string;
  name: string;
  npsn?: string;
  slug: string;
  address: string;
  province: string;
  city: string;
  district?: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  pilotStatus: PilotStatus;
  isActive: boolean;
  createdAt: string;
};

export type StudentProfile = {
  id: string;
  schoolId: string;
  participantCode: string;
  studentNumber?: string;
  fullName: string;
  phone?: string;
  gender?: string;
  academicYear: string;
  isActive: boolean;
  school?: { id: string; name: string; slug: string };
  classrooms?: { classroom: { id: string; name: string; gradeLevel: number } }[];
};

export type Classroom = {
  id: string;
  schoolId: string;
  name: string;
  gradeLevel: number;
  academicYear: string;
  isActive: boolean;
  school?: { id: string; name: string; slug: string };
  homeroomTeacher?: { id: string; user: { id: string; name: string; email?: string } };
  _count?: { students: number };
};

export type Subject = {
  id: string;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
};

export type Question = {
  id: string;
  code: string;
  questionText: string;
  gradeLevel: number;
  status: "DRAFT" | "ACTIVE" | "INACTIVE" | "ARCHIVED";
  subjectId: string;
  competencyId: string;
  subject?: { id: string; code: string; name: string };
  competency?: { id: string; code: string; name: string };
};

export type AssessmentStatus = "DRAFT" | "SCHEDULED" | "ACTIVE" | "CLOSED" | "ARCHIVED";

export type Assessment = {
  id: string;
  schoolId?: string;
  subjectId: string;
  title: string;
  slug: string;
  description?: string;
  gradeLevel: number;
  durationMinutes?: number;
  status: AssessmentStatus;
  showResultImmediately: boolean;
  allowRetake: boolean;
  maxAttempts: number;
  school?: { id: string; name: string; slug: string };
  subject?: { id: string; code: string; name: string };
  _count?: { questions: number; classrooms: number; assignments: number };
};

export type SchoolLead = {
  id: string;
  schoolName: string;
  contactName: string;
  position?: string;
  phone: string;
  email?: string;
  studentCount?: number;
  message?: string;
  status: "NEW" | "CONTACTED" | "DEMO_SCHEDULED" | "PILOT" | "REJECTED" | "CONVERTED";
  createdAt: string;
};

export type AssignmentStatus = "ASSIGNED" | "STARTED" | "COMPLETED" | "EXPIRED";

export type StudentAssignment = {
  id: string;
  status: AssignmentStatus;
  assignedAt: string;
  dueAt?: string;
  assessment: {
    id: string;
    title: string;
    description?: string;
    gradeLevel: number;
    durationMinutes?: number;
    startAt?: string;
    endAt?: string;
    status: AssessmentStatus;
    subject: { id: string; code: string; name: string };
    _count: { questions: number };
  };
  attempts?: {
    id: string;
    attemptNumber: number;
    status: "IN_PROGRESS" | "SUBMITTED" | "AUTO_SUBMITTED" | "CANCELLED";
    startedAt: string;
    submittedAt?: string;
  }[];
};

export type MasteryStatus = "MASTERED" | "DEVELOPING" | "NEEDS_PRACTICE";

export type CompetencyResult = {
  id: string;
  competencyId: string;
  score: number | string;
  masteryStatus: MasteryStatus;
  competency: { id: string; code: string; name: string };
};

export type AttemptResult = {
  id: string;
  status: string;
  totalScore: number | string;
  correctAnswers: number;
  wrongAnswers: number;
  unanswered: number;
  submittedAt?: string;
  competencyResults: CompetencyResult[];
  recommendations: CompetencyResult[];
  assignment: {
    assessment: { id: string; title: string; showResultImmediately: boolean; subject: { name: string } };
    student: { id: string; fullName: string; participantCode: string };
  };
};

export function masteryLabel(status: MasteryStatus): "Dikuasai" | "Sedang Berkembang" | "Perlu Latihan" {
  if (status === "MASTERED") return "Dikuasai";
  if (status === "DEVELOPING") return "Sedang Berkembang";
  return "Perlu Latihan";
}

export function pilotStatusProgress(status: PilotStatus): number {
  const map: Record<PilotStatus, number> = {
    PROSPECT: 15,
    CONTACTED: 35,
    DEMO: 55,
    ACTIVE_PILOT: 80,
    EVALUATION: 90,
    COMPLETED: 100,
    DISCONTINUED: 0,
  };
  return map[status];
}

// ---------------------------------------------------------------------------
// BaleTeman / BaleVerse: dunia, misi harian, XP/game profile, dan mastery
// (Peta Tumbuh). Terpisah dari tipe asesmen formal di atas.
// ---------------------------------------------------------------------------

export type WorldSummary = {
  id: string;
  key: string;
  name: string;
  characterClass: string;
  themeDescription?: string;
  subject: { id: string; code: string; name: string };
  worldLevel: number;
  worldXp: number;
};

export type BaleRank =
  | "TUNAS"
  | "PERINTIS"
  | "PENJELAJAH"
  | "PAKAR"
  | "MAESTRO"
  | "GUARDIAN"
  | "LEGENDA_BALE";

export type GameProfileSummary = {
  accountLevel: number;
  accountXp: number;
  xpIntoCurrentLevel: number;
  xpRequiredForNextLevel: number;
  rank: BaleRank;
  dayaBale: number;
  streakCurrent: number;
  streakLongest: number;
  streakTargetPerWeek: number;
  lastActivityDate?: string | null;
};

export type MissionActivityOption = {
  id: string;
  optionKey: string;
  optionText: string;
  // Hanya terisi setelah attempt disubmit - tidak boleh bocor sebelumnya.
  isCorrect?: boolean;
};

export type MissionActivity = {
  id: string;
  orderNumber: number;
  prompt: string;
  selectedOptionId?: string | null;
  explanation?: string | null;
  options: MissionActivityOption[];
};

export type MissionAttemptStatus =
  | "IN_PROGRESS"
  | "SUBMITTED"
  | "AUTO_SUBMITTED"
  | "CANCELLED";

export type TodayMission = {
  assignmentId: string;
  worldId: string;
  status: AssignmentStatus;
  mission: {
    id: string;
    title: string;
    narrative: string;
    estimatedMinutes: number;
    competency: { id: string; code: string; name: string };
  };
  attempt: { id: string; status: MissionAttemptStatus; startedAt: string } | null;
  activities: MissionActivity[];
};

export type LearningMasteryStatus =
  | "MASTERED"
  | "DEVELOPING"
  | "NEEDS_PRACTICE"
  | "INSUFFICIENT_EVIDENCE";

export type ConfidenceLevel = "HIGH" | "MEDIUM" | "LOW";

export type MissionMasterySnapshot = {
  competencyId: string;
  masteryScore: number;
  status: LearningMasteryStatus;
  confidence: ConfidenceLevel;
  evidenceCount: number;
};

export type MissionSubmitResult = {
  attemptId: string;
  correctCount: number;
  totalActivities: number;
  activities: {
    activityId: string;
    selectedOptionId: string | null;
    isCorrect: boolean;
    explanation: string | null;
  }[];
  xpGained: number;
  gameProfile: {
    accountLevel: number;
    accountXp: number;
    accountLeveledUp: boolean;
    worldXp?: number;
    worldLevel?: number;
    worldLeveledUp?: boolean;
  };
  mastery: MissionMasterySnapshot | null;
};

export type MissionResult = {
  attemptId: string;
  missionTitle: string;
  correctCount: number | null;
  totalActivities: number | null;
  activities: {
    activityId: string;
    prompt: string;
    selectedOptionId: string | null;
    isCorrect: boolean;
    explanation: string | null;
    options: { id: string; optionKey: string; optionText: string; isCorrect: boolean }[];
  }[];
  mastery: MissionMasterySnapshot | null;
};

export type GrowthMapEntry = {
  competencyId: string;
  competencyName: string;
  masteryScore: number;
  status: LearningMasteryStatus;
  confidence: ConfidenceLevel;
  evidenceCount: number;
  lastEvaluatedAt: string | null;
};

export function learningMasteryLabel(status: LearningMasteryStatus): string {
  if (status === "MASTERED") return "Dikuasai";
  if (status === "DEVELOPING") return "Sedang Berkembang";
  if (status === "NEEDS_PRACTICE") return "Perlu Latihan";
  return "Perlu Data Lagi";
}

export function rankLabel(rank: BaleRank): string {
  const map: Record<BaleRank, string> = {
    TUNAS: "Tunas",
    PERINTIS: "Perintis",
    PENJELAJAH: "Penjelajah",
    PAKAR: "Pakar",
    MAESTRO: "Maestro",
    GUARDIAN: "Guardian",
    LEGENDA_BALE: "Legenda Bale",
  };
  return map[rank];
}
