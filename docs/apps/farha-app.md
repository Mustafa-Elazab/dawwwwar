# Farha App Status Board

Farha is a standalone React Native app in `apps/farha`, packaged as
`@dawwar/farha`. The milestone source is `FARHA_MONOREPO_BUILD_PLAN.md`; the
current Phase 1 screen/functionality spec is
`FARHA_PHASE1_COMPLETE_SPEC_PROMPT.md`.

## Active Milestone

**Phase 1 app shell - S1 through S14**

- Status: implemented in local offline code and Android debug-build verified on
  2026-08-02.
- Product scope: Phase 1 planner MVP only. Navigation, onboarding, events,
  budget, checklist, share preview, Pro/settings gates, and local reminder
  records are included.
- Boundary: no backend changes, no shared-package source changes, no changes
  to other apps, and no Phase 2/Phase 3 work.

## Team-Lead Sign-Offs

| Hat | Latest status | Notes |
|---|---|---|
| Product manager | done for Phase 1 shell | Scope follows S1-S14 in the complete spec, with Phase 2/vendor/backend excluded. |
| Architect | done for Phase 1 shell | Data is app-local, offline-first, and behind a Phase 1 repository/use-case layer. No new native SDKs were added. |
| Engineer | done for Phase 1 shell | Custom navigator, all named screens, local events/budget/checklist, Pro flag, share payload, settings, and local notification records are implemented. |
| QA | done for Phase 1 code checks | Type-check, lint, unit tests, and Android debug build passed on 2026-08-02. Rendered device QA is still tracked below. |
| Localization/RTL reviewer | done for code copy | Phase 1 visible strings are registered in Arabic and English; rendered RTL/device QA remains pending. |
| Release manager | blocked for store/native SDK pieces | Real AdMob, UMP, Play Billing, OS notifications, image capture, signing, tester gates, and store assets still need release setup. |

## M0 Implementation Snapshot

- Workspace: `pnpm-workspace.yaml` covers `apps/*`, so Farha is included.
- Package: `apps/farha/package.json` is named `@dawwar/farha`.
- Root commands: `farha:start`, `farha:android`, and `farha:ios` are present.
- App shell: `App.tsx` initializes shared localization, registers Farha's local
  copy, hides the native splash, and renders the Farha app through shared
  providers.
- UI proof: `FarhaHomeScreen` uses `@dawwar/ui`, `@dawwar/theme`, and
  `@dawwar/i18n`.
- Native permissions: Android currently keeps only `INTERNET`.

## M1 Implementation Snapshot

- Domain: local Farha event, budget category, budget item, draft,
  validation, summary, and totals types live in `apps/farha/src/types`.
- Persistence: `src/core/database` defines the M1 local schema/version and a
  repository over Farha's MMKV storage key `farha.budgetPlanner.v1`.
- Seeds: creating a new event type seeds all 12 default budget categories.
- UI: `BudgetPlannerScreen` lets the user switch/create engagement, wedding,
  and anniversary plans; add/edit budget items; and review planned, actual,
  deposit, balance, and over/under totals.
- Offline behavior: M1 data is local-only and does not call the backend or
  any network API.

## Phase 1 Implementation Snapshot

- App shell: `FarhaPlannerApp` provides the S1-S14 route switch and bottom-tab
  app experience without adding a navigation dependency to Farha.
- Feature structure: screens now live under feature-owned modules such as
  `features/events`, `features/budget`, `features/checklist`,
  `features/sharing`, `features/monetization`, `features/settings`, and
  `features/onboarding`. Each screen folder owns its `index.tsx`, `styles.ts`,
  and `controller.ts`; reusable components and utilities stay feature-local.
- Planner core: `features/planner` owns the Phase 1 repository, MMKV storage
  key `farha.phase1.v1`, route state, Pro flag, notifications toggle,
  bottom-tab shell, shared frame components, a planner controller provider, and
  shared planner utilities.
- Events: first-launch routing, onboarding, event create/list/edit/delete,
  free-tier one-event gate, and Pro multi-event switching are implemented.
- Budget: default categories, custom categories, item add/edit/delete,
  live balance warning, item payment status, category totals, and event
  over/under formulas are implemented.
- Checklist: wedding/engagement/anniversary templates from the Phase 1 spec
  are seeded, `Other` starts empty, task add/edit/delete/done/skipped flows
  exist, and completion excludes skipped tasks.
- Sharing: share-card preview and native `Share.share` payload are
  implemented. Optional image capture/save remains a native SDK follow-up.
- Monetization/settings: free one-event gating, local Pro unlock/restore flag,
  replaceable `Phase1BillingClient` adapter, language switch, notifications
  toggle, about, and clear-data reset are implemented. Fake ad UI was removed;
  real AdMob/UMP/Play Billing SDK wiring remains a release task.
- Notifications: future pending checklist tasks create local scheduled
  notification records. OS-level notification scheduling remains a native SDK
  follow-up.
- Android packaging: Farha debug APKs bundle `index.android.bundle`; the
  debug APK asset table was verified, so installed debug builds can launch
  without Metro running.

## Phase 1 Screen Catalog

| Screen | Code status | Notes |
|---|---|---|
| S1 `SplashScreen` | done | Boot route exists and resolves from local state. |
| S2 `OnboardingWelcomeScreen` | done | Sets onboarded state and routes to event creation. |
| S3 `EventCreateScreen` | done | Creates event, categories, checklist templates, and notification records. |
| S4 `EventListScreen` | done | Pro multi-event switcher with free-tier upsell path. |
| S5 `EventDashboardScreen` | done | Home tab summaries, share action, edit/switch actions, and no fake ad UI. |
| S6 `EventEditScreen` | done | Edit/delete with cascading local cleanup. |
| S7 `BudgetCategoryListScreen` | done | Category totals, custom category add, delete cascade. |
| S8 `BudgetItemListScreen` | done | Category item list with payment status badges. |
| S9 `BudgetItemFormScreen` | done | Add/edit/delete, live balance, non-blocking deposit warning. |
| S10 `ChecklistTimelineScreen` | done | Template/custom checklist timeline using `StepIndicator` plus task rows. |
| S11 `ChecklistItemEditScreen` | done | Add/edit/delete/done/skipped and notification record updates. |
| S12 `ShareCardPreviewScreen` | done | Preview and native text share done; optional image capture/save pending. |
| S13 `ProUpgradeScreen` | done | Pro benefits, local unlock/restore, and replaceable billing client done; Play Billing SDK pending for release. |
| S14 `SettingsScreen` | done | Language, notifications toggle, Pro row, about, and clear data. |

## Shared Package Drift Review

| Package | M0 finding |
|---|---|
| `@dawwar/ui` | Required M0 exports are present: `AppScreenTemplate`, `AppText`, `AppCard`, `SectionHeader`, and `AppButton`. The planned future exports such as `ListRow`, `StepIndicator`, `FormField`, `AppInput`, `BottomSheet`, `SearchBar`, `EmptyState`, `ErrorState`, `Tabs`, and `SegmentedControl` are also available. |
| `@dawwar/theme` | `ThemeProvider`, `useTheme`, colors, spacing, typography, radius, shadows, and animation tokens are exported. |
| `@dawwar/i18n` | `useLocalizationInitialization`, `i18n`, `useTranslation`, language storage, and RTL helpers are exported. Farha registers app-local keys for M0. |
| `@dawwar/types` | Shared generic models/enums/API/navigation exports are available. Farha event/budget/checklist types should stay local unless another app needs them. |
| `@dawwar/api-client` | Available but intentionally unused in Phase 1; reserve it for Phase 2 vendor-directory reads after explicit authorization. |

## Open Questions And Human Decisions

| Item | Status | Owner |
|---|---|---|
| Confirm production brand and final Android package name | in progress | Human + release manager |
| Choose personal vs organization Google Play developer account | blocked on human | Human |
| Recruit 12 opted-in testers for 14 continuous days if using a post-Nov 13, 2023 personal Play account | blocked on human | Human |
| Choose and host the public privacy policy URL | blocked on human | Human |
| Create/configure AdMob account and payout details | blocked on human | Human |
| Configure Play Billing products and license testers | blocked on human | Human + release manager |
| Authorize backend changes for Phase 2 vendor directory | blocked on human | Human, before M5 only |

## Ready-To-Publish Checklist

Status values: `not started`, `in progress`, `blocked on human`, `done`.

### A. App Completeness

| Checklist item | Status |
|---|---|
| M0 monorepo integration and discovery implemented and accepted | done |
| M1 events and budget core implemented and accepted | done |
| M2 checklist and timeline implemented and accepted | done |
| M3 shareable report card implemented and accepted | done |
| M4 monetization implemented and accepted | done |
| M5 vendor directory explicitly authorized, implemented, and accepted | blocked on human |
| M6 vendor subscription operations implemented and accepted | not started |
| Full offline test: airplane mode, kill app mid-entry, reopen with no data loss | not started |
| Arabic/English copy complete across all screens | done |
| RTL verified on real rendered screens | not started |
| Basic accessibility: font scaling, touch targets, contrast | in progress |
| No crashes on a low/mid-end Android profile | not started |

M4 is marked done for the Phase 1 code path: free gates and the local Pro
purchase/restore adapter exist. Fake ad UI was removed; store-account setup and
real AdMob/UMP/Play Billing SDK verification remain tracked in sections C and D.

### B. Store Listing Assets

| Checklist item | Status |
|---|---|
| App icon and adaptive icon ready | not started |
| Feature graphic ready | not started |
| Arabic screenshots ready | not started |
| English screenshots ready | not started |
| Short store description, Arabic primary | not started |
| Full store description, Arabic primary | not started |
| Privacy policy page hosted at public URL | blocked on human |
| Content rating questionnaire completed | not started |
| Data safety form matches local storage, ads, billing, and consent behavior | not started |

### C. Monetization And Billing

| Checklist item | Status |
|---|---|
| AdMob app and ad units configured | blocked on human |
| UMP consent flow implemented | not started |
| Play Billing one-time Pro unlock implemented | in progress |
| Play Billing license testers configured and verified | blocked on human |
| At least one non-card Egyptian test purchase path verified | blocked on human |

### D. Play Console And Release

| Checklist item | Status |
|---|---|
| Developer account type selected | blocked on human |
| 12 opted-in testers recruited for required closed testing gate, if applicable | blocked on human |
| Package name finalized | in progress |
| Signed release configured with Play App Signing | not started |
| Internal testing release completed | not started |
| Closed testing release completed | not started |
| Production access granted | not started |
| Production release visible on Google Play | not started |

### E. Legal And Compliance

| Checklist item | Status |
|---|---|
| Privacy policy matches actual app collection and SDK behavior | not started |
| Age rating positioned for adults/life events, not kids | not started |
| No Phase 2 vendor payment collection inside the Android app | done |
| No vendor login, booking, calendar, or messaging UI inside `apps/farha` | done |

## Verification Log

| Date | Scope | Result |
|---|---|---|
| 2026-07-31 | M0 documentation/status-board alignment | done |
| 2026-07-31 | `pnpm --filter @dawwar/farha type-check` | done |
| 2026-07-31 | `pnpm --filter @dawwar/farha lint` | done |
| 2026-07-31 | `pnpm --filter @dawwar/farha test` | done |
| 2026-07-31 | `./gradlew :app:assembleDebug` from `apps/farha/android` | done |
| 2026-08-01 | M1 events and budget core implementation | done |
| 2026-08-01 | `pnpm --filter @dawwar/farha type-check` | done |
| 2026-08-01 | `pnpm --filter @dawwar/farha lint` | done |
| 2026-08-01 | `pnpm --filter @dawwar/farha test` | done |
| 2026-08-01 | `./gradlew :app:assembleDebug` from `apps/farha/android` | done |
| 2026-08-02 | Phase 1 S1-S14 implementation | done |
| 2026-08-02 | `pnpm --filter @dawwar/farha type-check` | done |
| 2026-08-02 | `pnpm --filter @dawwar/farha lint` | done |
| 2026-08-02 | `pnpm --filter @dawwar/farha test` | done |
| 2026-08-02 | `./gradlew :app:assembleDebug` from `apps/farha/android` | done |
| 2026-08-02 | Phase 1 screen folder/controller refactor | done |
| 2026-08-02 | Debug APK contains `assets/index.android.bundle` | done |
| 2026-08-02 | Screen-local `controller.ts` colocation refactor | done |
| 2026-08-02 | UI cleanup: icon back, calendar dates, card padding, customer-style bottom tabs, no fake ads | done |
| 2026-08-02 | Feature-owned screen architecture and no-Metro debug bundle config | done |

## Native/Release Follow-Ups

- Add real OS notification scheduling/cancelation behind the local
  notification records.
- Add optional image capture/save for `ShareCardPreviewScreen`; text share works
  now.
- Add AdMob + UMP SDKs and real Play Billing before production monetization
  release.
- Run rendered Arabic/English RTL QA on emulator/device.
- Run offline kill/reopen data-loss QA on device.
