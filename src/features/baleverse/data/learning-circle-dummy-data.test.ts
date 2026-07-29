import { describe, expect, it } from "vitest";
import { learningCircleDummyData } from "./learning-circle-dummy-data";

describe("learning circle dummy data", () => {
  it("keeps parent support explicit and limited", () => {
    expect(learningCircleDummyData.parentSupportRequest.shareableContext).toEqual([
      "target minggu ini",
      "nama misi",
      "durasi belajar yang disarankan",
    ]);
    expect(learningCircleDummyData.parentSupportRequest.messageDraft).toContain("Boleh bantu");
  });

  it("marks mentor mastery review as requiring evidence before updating mastery fully", () => {
    expect(learningCircleDummyData.mentorFeedback.masteryReview).toBe("needsMoreEvidence");
  });
});
