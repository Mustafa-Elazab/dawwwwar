# Farha App Documentation

## Current Milestone

Farha is currently at **M0 — Monorepo integration and discovery**. The app is scaffolded as the workspace package `@dawwar/farha` under `apps/farha` and renders a localized, themed placeholder screen only.

## Scope

- Phase 1 target: offline-first wedding and life-event planner.
- M0 includes package wiring, React Native native shell, shared providers, a placeholder screen, root scripts, and this documentation.
- Budget, checklist, sharing, monetization, and vendor directory work starts in later milestones.

## Folder Structure

```text
apps/farha/
├── android/
├── ios/
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── i18n/
│   │   ├── providers.tsx
│   │   └── storage.ts
│   └── features/
│       └── home/
│           ├── data/
│           └── screens/FarhaHomeScreen/
├── __tests__/
├── app.json
├── index.js
├── package.json
└── tsconfig.json
```

## Shared Packages

- `@dawwar/ui`: placeholder screen uses `AppScreenTemplate`, `AppText`, `AppCard`, `SectionHeader`, and `AppButton`.
- `@dawwar/theme`: `ThemeProvider`, tokens, and `useTheme`.
- `@dawwar/i18n`: initialization and `useTranslation`; Farha registers M0 copy locally so shared i18n files are not changed in this milestone.
- `@dawwar/types`, `@dawwar/api-client`, and `@dawwar/mocks`: workspace dependencies are present for planned milestones, but M0 does not call APIs or use mocks.

## Root Commands

```bash
pnpm farha:start
pnpm farha:android
pnpm farha:ios
pnpm --filter @dawwar/farha type-check
pnpm --filter @dawwar/farha lint
pnpm --filter @dawwar/farha test
```

## M0 Boundaries

- No backend changes.
- No shared-package source changes.
- No budget, checklist, directory, auth, booking, or vendor payment features.
- Android keeps only the `INTERNET` permission for React Native development/runtime needs.

## Entry Criteria For M1

- Keep Phase 1 fully offline.
- Add local event and budget domain types inside `apps/farha`.
- Add local persistence/repository boundaries before UI mutations.
- Continue using local Farha translation resources unless a key becomes genuinely shared across apps.
