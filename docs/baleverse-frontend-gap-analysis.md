# BaleVerse Frontend Gap Analysis

Audit singkat `BALE_BELAJAR_FE`:

- Stack: Next.js App Router, React 19, TypeScript strict, Tailwind CSS v4, Framer Motion, lucide-react.
- Route siswa sudah ada: login, dashboard, world, mission runner, result, growth map, history, school, profile.
- Komponen siswa existing: `StudentShell`, `ProgressBar`, `MasteryBadge`, `WorldCard`, `XpBar`, `motion-kit`.
- Data existing masih banyak bergantung API backend. Untuk fase BaleVerse, vertical slice baru memakai dummy data typed dan mock service delay 500-900 ms.

Gap utama terhadap brief:

- Dashboard existing belum memakai struktur BaleVerse penuh: dunia Numeria/KodeX/Detectivia, BaleHero state, XP dan mastery terpisah per dunia, quick actions, power loadout, Lingkar Belajar.
- Mission runner existing masih banyak soal per halaman; brief meminta satu soal per layar untuk alur misi.
- Tanya Bale belum memiliki mode hint bertahap, confidence state, dan batas "belum cukup yakin".
- Human Help Card, consent data sharing, mentor handoff, dan mentor queue belum menjadi flow frontend.
- Loading/error/empty/offline state perlu dibuat konsisten untuk BaleVerse.

File yang dibuat untuk vertical slice:

- `src/app/student/baleverse/page.tsx`
- `src/features/baleverse/types.ts`
- `src/features/baleverse/design-tokens.ts`
- `src/features/baleverse/data/*`
- `src/features/baleverse/services/mock-baleverse-service.ts`
- `src/features/baleverse/state/dashboard-state-machine.ts`
- `src/features/baleverse/state/ai-human-handoff-state-machine.ts`
- `src/features/baleverse/components/dashboard/baleverse-dashboard.tsx`
- `src/features/baleverse/components/dashboard/bale-hero.tsx`
- `src/features/baleverse/components/dashboard/world-selector.tsx`
- `src/features/baleverse/components/mission/mission-shell.tsx`
- `src/features/baleverse/components/ai/tanya-bale-panel.tsx`
- `src/features/baleverse/components/ai/human-help-recommendation-card.tsx`
- `src/features/baleverse/components/learning-circle/mentor-card.tsx`
