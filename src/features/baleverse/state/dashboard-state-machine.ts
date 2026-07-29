import { BaleWorldKey, MissionStep } from "../types";

export type DashboardState = {
  step: MissionStep;
  selectedWorld: BaleWorldKey;
  attempts: number;
};

export type DashboardEvent =
  | { type: "LOGIN" }
  | { type: "SELECT_WORLD"; world: BaleWorldKey }
  | { type: "START_MISSION" }
  | { type: "ANSWER_CORRECT" }
  | { type: "ANSWER_WRONG" }
  | { type: "OPEN_CONSENT" }
  | { type: "SUBMIT_HANDOFF" };

export const initialDashboardState: DashboardState = {
  step: "login",
  selectedWorld: "numeria",
  attempts: 0,
};

export function transitionDashboard(state: DashboardState, event: DashboardEvent): DashboardState {
  if (event.type === "LOGIN") return { ...state, step: "dashboard" };
  if (event.type === "SELECT_WORLD") return { ...state, selectedWorld: event.world };
  if (event.type === "START_MISSION") return { ...state, step: "missionIntro", attempts: 0 };
  if (event.type === "ANSWER_CORRECT") return { ...state, step: "reward" };
  if (event.type === "OPEN_CONSENT") return { ...state, step: "consent" };
  if (event.type === "SUBMIT_HANDOFF") return { ...state, step: "waitingMentor" };

  const attempts = state.attempts + 1;
  if (attempts === 1) return { ...state, attempts, step: "hintOne" };
  if (attempts === 2) return { ...state, attempts, step: "hintTwo" };
  return { ...state, attempts, step: "humanHelp" };
}
