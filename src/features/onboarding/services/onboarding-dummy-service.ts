"use client";

import {
  placementQuestions,
  StudentOnboardingState,
} from "../data/onboarding-dummy-data";

const STORAGE_KEY = "bb_student_onboarding";
const delay = (ms = 520) => new Promise((resolve) => window.setTimeout(resolve, ms));

export function getOnboardingState(): StudentOnboardingState {
  if (typeof window === "undefined") return {};
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as StudentOnboardingState;
  } catch {
    return {};
  }
}

export async function saveOnboardingState(
  patch: Partial<StudentOnboardingState>,
): Promise<StudentOnboardingState> {
  await delay();
  const next = { ...getOnboardingState(), ...patch };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export async function completePlacement(
  answers: Record<string, string>,
): Promise<{ score: number; focus: string; missionId: string }> {
  await delay(700);
  const correct = placementQuestions.filter(
    (question) => answers[question.id] === question.correctOptionId,
  ).length;
  await saveOnboardingState({
    placementAnswers: answers,
    placementCompleted: true,
  });
  return {
    score: correct,
    focus:
      correct >= 2
        ? "Kamu siap mulai dari misi fondasi yang ringan."
        : "Kita mulai pelan-pelan dari misi paling dasar.",
    missionId: "first-mission",
  };
}
