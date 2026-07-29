import { BaleUser } from "../types";

export const baleUserDummyData: BaleUser = {
  id: "student-nara",
  name: "Nara",
  rank: "Penjelajah",
  rankTier: "III",
  level: 12,
  xp: { numeria: 4500, kodex: 1880, detectivia: 2600 },
  mastery: { numeria: 62, kodex: 41, detectivia: 58 },
  dayaBale: 320,
  nyalaBelajar: {
    targetPerWeek: 3,
    completedThisWeek: 2,
    protectedDays: 1,
  },
};
