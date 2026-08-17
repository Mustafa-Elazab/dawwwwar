# Farha App Status Board

Farha is a standalone React Native app in `apps/farha`, packaged as
`@dawwar/farha`. Phase 1 is an offline-first planner for occasions such as
weddings, engagements, anniversaries, graduations, and other celebrations.

## Current Scope

- Product scope: Phase 1 planner MVP only.
- Active model: `Occasion` plus unified `Task`.
- Boundary: no backend changes, no changes to customer/driver/merchant/admin,
  no vendor directory work, and no Phase 2/Phase 3 work.
- Native scope: existing Android packaging, splash/icon assets, Firebase,
  AdMob, and Play Billing wiring remain in place.

## Architecture Snapshot

- App shell: `apps/farha/src/app/App.tsx` initializes localization, Firebase,
  ads, boot splash, providers, and `FarhaPlannerApp`.
- Navigation: `apps/farha/src/navigation` owns `NavigationContainer`, the
  native stack, and the bottom tab navigator from
  `@react-navigation/bottom-tabs`.
- Tabs: `Home | Tasks | Share | Settings`.
- Planner core: `apps/farha/src/core/planner` owns the offline repository,
  controller provider, route state, schema migration, formulas, validation,
  and notification records.
- Storage key: `farha.phase1.v2`; loader also reads and migrates
  `farha.phase1.v1`.
- State management: Redux/Redux Toolkit is not used. The planner controller
  owns local offline state; this is still the right scale for Phase 1.

## Unified Model

`Occasion` replaces the old UI/code term “Event”:

- `id`, `type`, `title`, `date`, `categoryKeys`, `budgetSpent`,
  `budgetAvailable`, `budgetTarget`, `createdAt`, `updatedAt`
- Types: `wedding`, `engagement`, `anniversary`, `graduation`, `other`
- Each occasion owns its own selected task categories. Create/edit uses a
  horizontal occasion-type list plus category chips.
- Budget health combines the occasion starting money fields with task deposits
  and planned balances.

`Task` replaces separate budget item and checklist item rows:

- Action fields: `title`, `category`, `dueDate`, `status`, `notes`
- Money fields: `plannedCost`, `actualCost`, `depositPaid`
- Payment plan: `{ monthlyAmount, nextDueDate }`
- Formula: balance remaining is `(actualCost ?? plannedCost) - depositPaid`
- Completion: skipped tasks are excluded from the actionable denominator
- Payment badges: unpaid, partial, paid are computed from task cost/deposit
- Reminder records: pending task due dates and payment-plan next due dates are
  recorded when notifications are enabled

The migration combines legacy `budgetItems` and `checklistItems` into `tasks`.
Matched rows with the same category and title become one task with both action
and money fields.

## Screens And Flows

| Screen | Route | Purpose |
|---|---|---|
| Splash | `SplashScreen` | Boot loading and route resolution. |
| Guided tips | Header help icon | Replaces first-run onboarding with contextual how-to-use tips in an overlay. |
| Occasion create | `OccasionCreateScreen` | Creates an occasion with type, owned categories, spent/available/target money fields, and seeded unpaid task templates. |
| Occasion list | `OccasionListScreen` | Pro multi-occasion switcher and add flow. |
| Home | `OccasionDashboardScreen` | Curved header, countdown, task/money summary, Budget Health, next actions, share entry. |
| Occasion edit | `OccasionEditScreen` | Edit/delete an occasion and refresh template dates. |
| Tasks | `TaskListScreen` | Unified task list grouped by due date or category, status quick actions, payment quick logging. |
| Task form | `TaskFormScreen` | Add/edit title, category, due date, status, notes, optional cost, optional installments. |
| Share | `ShareCardPreviewScreen` | Permanent tab with preview and native text share payload. |
| Pro | `ProUpgradeScreen` | Pro upgrade/restore via the replaceable billing client. |
| Settings | `SettingsScreen` | Language, notifications toggle, Pro state, about, and clear data. |

Legacy budget/checklist/savings screen files are no longer in the live
navigator. They remain compilable during cleanup through compatibility aliases,
but the active user flow is the unified Tasks model.

## Theme And UI

- `@dawwar/theme` now supports generic light/dark color overrides on
  `ThemeProvider`.
- Farha passes a light override based on the brand palette:
  `#7A2039`, `#F7E3E2`, `#FDF6F3`, `#C98995`, `#5C1B2E`, `#B08A90`.
- `CurvedHeader` in `features/planner/components` provides the deep header and
  asymmetric blush content curve.
- A help icon in the header opens a dimmed guided-tip overlay with a white
  speech bubble and pointer, matching the provided reference pattern.
- Cards use cream backgrounds, softer shadows, larger radius, and press
  feedback through shared `AppCard`/`AppPressable`.
- Task rows and dashboard cards use staggered Reanimated `FadeInUp` entrances.
- Marking a task done shows a short check pop on the completed row.
- Bottom tabs use a filled deep-color active icon circle.

## Localization And RTL

- Farha registers Arabic and English strings in
  `apps/farha/src/app/i18n/phase1Resources.ts`.
- New visible copy for Tasks, graduation, payment plans, and task deletion is
  localized. The tips overlay, event category copy, starting budget fields, and
  Budget Health feature are localized in Arabic and English.
- Main shared layout styles use start/end or `textAlign: 'auto'`; rendered RTL
  QA on device is still required before store release.

## Verification Log

| Date | Scope | Result |
|---|---|---|
| 2026-08-02 | Phase 1 S1-S14 implementation | done |
| 2026-08-02 | Android debug bundle and Metro attach fixes | done |
| 2026-08-03 | Navigation moved to `src/navigation`; planner logic moved to `core/planner` | done |
| 2026-08-03 | Publish-readiness cleanup and Farha publish report | done |
| 2026-08-09 | Unified Occasion/Task model migration | done |
| 2026-08-09 | Farha curved theme override and task animations | done |
| 2026-08-09 | `pnpm --filter @dawwar/farha type-check` | done |
| 2026-08-09 | `pnpm --filter @dawwar/farha test -- --runInBand` | done |
| 2026-08-09 | `pnpm --filter @dawwar/farha lint` | done |
| 2026-08-18 | Onboarding replaced with guided tips; occasion categories and Budget Health added | done |

## Ready-To-Publish Checklist

| Checklist item | Status |
|---|---|
| M0 monorepo integration and discovery implemented and accepted | done |
| M1 events/occasions and budget core implemented and accepted | done |
| M2 unified tasks timeline implemented and accepted | done |
| M3 shareable report card implemented and accepted | done |
| M4 monetization implemented and accepted | done |
| M5 vendor directory explicitly authorized, implemented, and accepted | blocked on human |
| M6 vendor subscription operations implemented and accepted | not started |
| Full offline test: airplane mode, kill app mid-entry, reopen with no data loss | not started |
| Arabic/English copy complete across all screens | done |
| RTL verified on real rendered screens | not started |
| Basic accessibility: font scaling, touch targets, contrast | in progress |
| No crashes on a low/mid-end Android profile | not started |

## Release Follow-Ups

- Wire real OS-level local notification scheduling/cancelation behind the
  existing notification records.
- Run rendered Arabic/English RTL QA on emulator/device.
- Run offline kill/reopen data-loss QA on device.
- Verify Android release signing, Play Billing products, AdMob units, UMP
  consent, privacy policy, and Play Console tester gates with human-owned
  accounts.
