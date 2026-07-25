import { redirect } from "next/navigation";

export default function LegacyStudentOnboardingPage() {
  redirect("/onboarding/student/profile");
}
