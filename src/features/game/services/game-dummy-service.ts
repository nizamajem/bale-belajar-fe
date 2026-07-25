"use client";

import { getOnboardingState } from "@/features/onboarding/services/onboarding-dummy-service";
import { DummyFirstMission, firstMissions } from "../data/game-dummy-data";

const RESULT_KEY = "bb_first_mission_result";
const delay = (ms = 600) => new Promise((resolve) => window.setTimeout(resolve, ms));

export async function getFirstMission(): Promise<DummyFirstMission> {
  await delay(400);
  const world = getOnboardingState().world ?? "detectivia";
  return firstMissions[world];
}

export async function submitFirstMission(answerId: string): Promise<{
  correct: boolean;
  feedback: string;
  xp: number;
  mastery: number;
}> {
  await delay();
  const mission = await getFirstMission();
  const activity = mission.activities[0];
  const selected = activity.options.find((option) => option.id === answerId);
  const result = {
    correct: Boolean(selected?.correct),
    feedback: selected?.feedback ?? "Jawaban belum dipilih.",
    xp: selected?.correct ? mission.rewardXp : Math.round(mission.rewardXp / 2),
    mastery: selected?.correct ? 12 : 5,
  };
  window.localStorage.setItem(RESULT_KEY, JSON.stringify(result));
  return result;
}
