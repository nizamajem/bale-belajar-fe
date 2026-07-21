# BaleBelajar Product API Contract

Dokumen ini mencatat kontrak data yang dibutuhkan frontend agar flow produk sesuai prinsip asesmen diagnostik BaleBelajar. Endpoint yang sudah ada tetap dipakai; bagian di bawah adalah kebutuhan tambahan untuk backend/scoring berikutnya.

## Prinsip

- Jangan menampilkan label yang menghakimi siswa.
- Hasil harus menghasilkan tindakan belajar.
- Guru tetap menjadi pengambil keputusan.
- Jika bukti belum cukup, sistem tidak memaksakan klasifikasi.
- Rekomendasi harus disimpan sebagai snapshot agar hasil lama tidak berubah ketika aturan scoring diperbarui.

## Student Result Contract

Endpoint saat ini:

`GET /student/attempts/:attemptId/result`

Field tambahan yang dibutuhkan:

```ts
type StudentResultV2 = {
  id: string;
  scoringVersion: "v1.0";
  totalScore: number;
  correctAnswers: number;
  wrongAnswers: number;
  unanswered: number;
  attemptValidity: {
    status: "VALID" | "NEEDS_VERIFICATION" | "UNSTABLE_DATA";
    reasons: string[];
    studentMessage: string;
    teacherMessage: string;
  };
  competencyResults: {
    id: string;
    competencyId: string;
    score: number;
    rawScore: number;
    weightedScore: number;
    masteryStatus:
      | "MASTERED"
      | "DEVELOPING"
      | "NEEDS_PRACTICE"
      | "INSUFFICIENT_EVIDENCE";
    confidence: "HIGH" | "MEDIUM" | "LOW";
    evidence: {
      answeredItems: number;
      requiredItems: number;
      unansweredItems: number;
      difficultyCoverage: ("EASY" | "MEDIUM" | "HARD")[];
    };
    prerequisiteGap?: {
      competencyId: string;
      competencyName: string;
      reason: string;
    };
    misconceptions: {
      code: string;
      label: string;
      evidenceCount: number;
      confidence: "HIGH" | "MEDIUM" | "LOW";
    }[];
    competency: {
      id: string;
      code: string;
      name: string;
    };
  }[];
  recommendations: {
    id: string;
    competencyId: string;
    priority: number;
    audience: "STUDENT" | "TEACHER" | "PARENT";
    reason: string;
    learningObjective: string;
    learningActivity: string;
    estimatedDurationMinutes: number;
    frequency: string;
    successIndicator: string;
    reassessmentPlan: string;
    snapshotData: Record<string, unknown>;
  }[];
};
```

## Teacher Dashboard Contract

Endpoint tambahan yang dibutuhkan:

`GET /assessments/:id/teacher-summary`

```ts
type TeacherAssessmentSummary = {
  assessmentId: string;
  completionRate: number;
  averageScore: number;
  totalAssigned: number;
  completed: number;
  notStarted: number;
  inProgress: number;
  topCompetencyGaps: {
    competencyId: string;
    competencyName: string;
    affectedStudents: number;
    averageScore: number;
    confidence: "HIGH" | "MEDIUM" | "LOW";
  }[];
  prerequisiteGaps: {
    prerequisiteCompetencyId: string;
    prerequisiteName: string;
    affectedStudents: number;
  }[];
  commonMisconceptions: {
    code: string;
    label: string;
    affectedStudents: number;
  }[];
  actionRecommendations: {
    priority: number;
    title: string;
    reason: string;
    suggestedActivity: string;
    estimatedDurationMinutes: number;
  }[];
  lowConfidenceResults: {
    studentId: string;
    studentName: string;
    reason: string;
  }[];
};
```

## Parent Report Contract

Endpoint tambahan yang dibutuhkan:

`GET /student/attempts/:attemptId/parent-report`

```ts
type ParentReport = {
  studentName: string;
  mainProgress: string;
  supportPriority: string;
  simpleSuggestion: string;
  suggestedSchedule: string;
  parentAction: string;
  reportUrl?: string;
  shareText: string;
};
```

## Feedback Contract

Endpoint tambahan yang dibutuhkan:

`POST /feedback`

```ts
type FeedbackPayload = {
  role: "STUDENT" | "TEACHER" | "PARENT";
  entityType: "ATTEMPT_RESULT" | "TEACHER_DASHBOARD" | "PARENT_REPORT";
  entityId: string;
  usefulnessScore?: 1 | 2 | 3 | 4 | 5;
  clarityScore?: 1 | 2 | 3 | 4 | 5;
  actionabilityScore?: 1 | 2 | 3 | 4 | 5;
  comment?: string;
};
```

## MVP Acceptance Impact

Frontend dianggap siap pilot penuh setelah backend menyediakan:

- `INSUFFICIENT_EVIDENCE`.
- `confidence` per kompetensi.
- `attemptValidity`.
- `prerequisiteGap`.
- `misconceptions`.
- rekomendasi snapshot untuk siswa, guru, dan orang tua.
- teacher summary berbasis hasil agregat.
- feedback collection.
