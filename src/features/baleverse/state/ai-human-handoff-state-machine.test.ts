import { describe, expect, it } from "vitest";
import { transitionHandoff } from "./ai-human-handoff-state-machine";

describe("AI to human handoff state machine", () => {
  it("requires recommendation and consent before waiting mentor", () => {
    const recommended = transitionHandoff("idle", "RECOMMEND");
    const consent = transitionHandoff(recommended, "REVIEW_CONSENT");
    const waiting = transitionHandoff(consent, "APPROVE");

    expect(recommended).toBe("recommended");
    expect(consent).toBe("reviewingConsent");
    expect(waiting).toBe("waitingMentor");
  });

  it("does not skip directly from idle to approval", () => {
    expect(transitionHandoff("idle", "APPROVE")).toBe("idle");
  });

  it("can be cancelled before data is shared", () => {
    expect(transitionHandoff("reviewingConsent", "CANCEL")).toBe("idle");
  });
});
