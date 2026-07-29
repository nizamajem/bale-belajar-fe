import { aiRecommendationsDummyData } from "../data/ai-recommendations-dummy-data";
import { humanHelpDummyData } from "../data/human-help-dummy-data";
import { learningCircleDummyData } from "../data/learning-circle-dummy-data";
import { mentorQueueDummyData } from "../data/mentor-queue-dummy-data";
import { missionsDummyData } from "../data/missions-dummy-data";
import { baleUserDummyData } from "../data/user-dummy-data";
import { worldsDummyData } from "../data/worlds-dummy-data";

function delay() {
  const ms = 500 + Math.floor(Math.random() * 401);
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getBaleverseSnapshot() {
  await delay();
  return {
    user: baleUserDummyData,
    worlds: worldsDummyData,
    activeMission: missionsDummyData[0],
    recommendation: aiRecommendationsDummyData.normal,
    learningCircle: learningCircleDummyData,
  };
}

export async function requestMentorHelp() {
  await delay();
  return {
    recommendation: humanHelpDummyData,
    queueItem: mentorQueueDummyData[0],
  };
}
