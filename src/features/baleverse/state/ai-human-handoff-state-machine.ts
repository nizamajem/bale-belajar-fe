import { HandoffStatus } from "../types";

export type HandoffEvent = "RECOMMEND" | "REVIEW_CONSENT" | "APPROVE" | "MENTOR_REPLY" | "CANCEL";

export function transitionHandoff(status: HandoffStatus, event: HandoffEvent): HandoffStatus {
  if (event === "CANCEL") return "idle";
  if (status === "idle" && event === "RECOMMEND") return "recommended";
  if (status === "recommended" && event === "REVIEW_CONSENT") return "reviewingConsent";
  if (status === "reviewingConsent" && event === "APPROVE") return "waitingMentor";
  if (status === "waitingMentor" && event === "MENTOR_REPLY") return "mentorResponded";
  return status;
}
