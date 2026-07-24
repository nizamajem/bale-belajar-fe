"use client";

import { getStoredUser } from "@/lib/auth";
import { BaleVerseDashboard } from "@/features/baleverse/components/baleverse-dashboard";
import { StudentShell } from "../_components/student-shell";

export default function StudentDashboardPage() {
  const user = getStoredUser();

  return (
    <StudentShell>
      <BaleVerseDashboard studentName={user?.name ?? "Siswa"} />
    </StudentShell>
  );
}
