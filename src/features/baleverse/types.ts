export type BaleWorldKey = "numeria" | "kodex" | "detectivia";
export type BaleHeroState = "idle" | "greeting" | "thinking" | "confused" | "encouraging" | "happy" | "celebrating" | "askingMentor" | "waiting";
export type AiConfidence = "high" | "medium" | "low";
export type HumanHelpType = "mentor" | "parent" | "support" | "professional";
export type HandoffStatus = "idle" | "recommended" | "reviewingConsent" | "submitted" | "waitingMentor" | "mentorResponded";
export type MissionStep = "login" | "dashboard" | "missionIntro" | "question" | "hintOne" | "hintTwo" | "humanHelp" | "consent" | "waitingMentor" | "reward";

export type BaleUser = {
  id: string;
  name: string;
  rank: string;
  rankTier: "III" | "II" | "I";
  level: number;
  xp: Record<BaleWorldKey, number>;
  mastery: Record<BaleWorldKey, number>;
  dayaBale: number;
  nyalaBelajar: {
    targetPerWeek: number;
    completedThisWeek: number;
    protectedDays: number;
  };
};

export type BaleWorld = {
  key: BaleWorldKey;
  name: string;
  subject: string;
  characterClass: string;
  tone: string;
  color: string;
  accent: string;
  mastery: number;
};

export type BaleMission = {
  id: string;
  worldKey: BaleWorldKey;
  title: string;
  story: string;
  goal: string;
  estimatedMinutes: number;
  rewardXp: number;
  rewardDayaBale: number;
  prompt: string;
  options: { id: string; label: string; text: string; correct: boolean; feedback: string }[];
  hints: string[];
  teachBackPrompt: string;
};

export type AiRecommendation = {
  recommended_action: string;
  reason: string;
  confidence: AiConfidence;
  target_skill: string;
  difficulty: string;
  suggested_duration_minutes: number;
  human_help_required: boolean;
  human_help_type: HumanHelpType | null;
  shareable_context: string[];
  safety_flags: string[];
};

export type HumanHelpRecommendation = {
  problem: string;
  reason: string;
  helpType: HumanHelpType;
  helperName: string;
  shareableContext: string[];
  messageDraft: string;
};

export type MentorQueueItem = {
  id: string;
  student: string;
  topic: string;
  reason: string;
  urgency: "P0" | "P1" | "P2" | "P3" | "P4";
  aiSummary: string;
  studentAttempt: string;
  requestedResponseType: string;
  dueTime: string;
  status: "new" | "waiting" | "responded";
};

export type MentorFeedback = {
  mentorName: string;
  missionTitle: string;
  message: string;
  nextAction: string;
  masteryReview: "pending" | "validated" | "needsMoreEvidence";
};

export type ParentSupportRequest = {
  parentName: string;
  reason: string;
  shareableContext: string[];
  messageDraft: string;
  status: "draft" | "sent" | "received";
};
