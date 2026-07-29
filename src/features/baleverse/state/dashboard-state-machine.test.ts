import { describe, expect, it } from "vitest";
import { initialDashboardState, transitionDashboard } from "./dashboard-state-machine";

describe("dashboard BaleVerse state machine", () => {
  it("moves from login to dashboard and switches world", () => {
    const loggedIn = transitionDashboard(initialDashboardState, { type: "LOGIN" });
    const switched = transitionDashboard(loggedIn, { type: "SELECT_WORLD", world: "kodex" });

    expect(loggedIn.step).toBe("dashboard");
    expect(switched.selectedWorld).toBe("kodex");
  });

  it("escalates wrong answers through hints into human help", () => {
    const started = transitionDashboard(initialDashboardState, { type: "START_MISSION" });
    const firstWrong = transitionDashboard(started, { type: "ANSWER_WRONG" });
    const secondWrong = transitionDashboard(firstWrong, { type: "ANSWER_WRONG" });
    const thirdWrong = transitionDashboard(secondWrong, { type: "ANSWER_WRONG" });

    expect(firstWrong).toMatchObject({ attempts: 1, step: "hintOne" });
    expect(secondWrong).toMatchObject({ attempts: 2, step: "hintTwo" });
    expect(thirdWrong).toMatchObject({ attempts: 3, step: "humanHelp" });
  });

  it("keeps reward separate from human help escalation", () => {
    const started = transitionDashboard(initialDashboardState, { type: "START_MISSION" });
    const reward = transitionDashboard(started, { type: "ANSWER_CORRECT" });

    expect(reward.step).toBe("reward");
    expect(reward.attempts).toBe(0);
  });
});
