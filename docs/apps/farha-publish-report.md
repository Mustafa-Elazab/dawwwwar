# Farha Publish Readiness Report

This report documents the current Farha app implementation in `apps/farha`,
what has been completed, every active screen, and the main user flows. Farha is
a standalone React Native app packaged as `@dawwar/farha`.

## Current App Shape

- App entry: `src/app/App.tsx`
- Providers: `src/app/providers.tsx`
- Navigation: `src/navigation`
- Core planner state/domain/data: `src/core/planner`
- Feature screens: `src/features`
- Native Android package: `com.dawwar.farha`
- Offline storage key: `farha.phase1.v1`
- Active tabs: Home, Budget, Checklist, Settings
- Main dependency decision: Farha uses React Navigation for stack/tabs and does
  not use Redux/Redux Toolkit yet. The active state is local planner workflow
  state owned by the planner controller and persisted to MMKV.

## What Is Done

- Monorepo integration for `apps/farha`.
- Arabic/English translation registration.
- Branded app icon, native splash assets, and splash animation screen.
- React Navigation native root stack.
- Bottom tabs using `createBottomTabNavigator` from
  `@react-navigation/bottom-tabs`.
- Metro singleton pinning for React Navigation packages in pnpm.
- Offline event, budget, checklist, share, Pro, and settings state.
- Feature-owned screen folders with `index.tsx`, `styles.ts`, and
  `controller.ts` for each screen.
- Shared planner UI helpers: screen chrome, date field, missing-event state,
  money/date helpers, and confirmation helper.
- Debug Android Metro attach mode with debug-only cleartext enabled for local
  Metro.
- Legacy prototype M0/M1 screens, storage, tests, and copy removed so the app
  has one active planner source of truth.

## Active Architecture

The app starts in `App.tsx`, waits for i18n readiness, registers Farha
resources, hides the native boot splash, and renders `FarhaPlannerApp`.

`FarhaPlannerApp` creates the planner controller with `usePhase1Planner`,
provides it through `PlannerControllerProvider`, and renders `FarhaNavigator`.

`FarhaNavigator` owns the `NavigationContainer` and native root stack. It maps
planner routes to root stack screens, and routes tab screens through
`FarhaTabs`.

`FarhaTabs` owns the bottom tab navigator and custom customer-style tab bar.
The tab navigator uses Home, Budget, Checklist, and Settings screens.

`core/planner` owns business rules, route state, persistence, seed data,
validation, checklist summaries, budget totals, share payloads, and local
notification records.

## Active Screens

| Screen | Route | Purpose |
|---|---|---|
| SplashScreen | `SplashScreen` | Animated Farha splash using the branded logo and warm copy while boot routing resolves. |
| OnboardingWelcomeScreen | `OnboardingWelcomeScreen` | First-run explanation of budget, checklist, and share features; marks onboarding complete. |
| EventCreateScreen | `EventCreateScreen` | Creates an engagement, wedding, anniversary, or other event with title/date, then seeds budget categories and checklist templates. |
| EventListScreen | `EventListScreen` | Pro-only event switcher for multiple saved events; free users are gated to Pro. |
| EventDashboardScreen | `EventDashboardScreen` | Home tab with event countdown, budget summary, checklist progress, edit/switch actions, and share entry. |
| EventEditScreen | `EventEditScreen` | Edits event title/type/date and deletes the event with cascading local cleanup. |
| BudgetCategoryListScreen | `BudgetCategoryListScreen` | Budget tab with totals, default/custom categories, add custom category, category delete, and category drill-down. |
| BudgetItemListScreen | `BudgetItemListScreen` | Shows all items inside a category, payment badges, totals, and add/edit item navigation. |
| BudgetItemFormScreen | `BudgetItemFormScreen` | Adds/edits/deletes a budget item with planned cost, actual cost, deposit, due date, notes, and balance warning. |
| ChecklistTimelineScreen | `ChecklistTimelineScreen` | Checklist tab with seeded/custom tasks, progress indicator, done/skipped states, and add/edit task navigation. |
| ChecklistItemEditScreen | `ChecklistItemEditScreen` | Adds/edits/deletes checklist tasks, links optional budget category, sets due date/notes, and updates notification records. |
| ShareCardPreviewScreen | `ShareCardPreviewScreen` | Shows the shareable event summary card and sends a native text share payload. |
| ProUpgradeScreen | `ProUpgradeScreen` | Explains Pro benefits and calls the replaceable local billing adapter for purchase/restore. |
| SettingsScreen | `SettingsScreen` | Settings tab for language switch, notification toggle, Pro entry, version/about, and local data reset. |

## Main Flows

### First Launch

1. `SplashScreen` renders while local state loads.
2. If the user has not onboarded, the app opens `OnboardingWelcomeScreen`.
3. The user taps get started.
4. The app marks onboarding complete and opens `EventCreateScreen`.

### Create Event

1. User chooses event type, title, and date.
2. Controller validates required fields and date format.
3. Core planner creates the event.
4. Budget categories are seeded.
5. Checklist templates are seeded by event type.
6. Future pending checklist tasks create local notification records.
7. App opens the Home tab dashboard.

### Home Dashboard

1. User lands on `EventDashboardScreen`.
2. Dashboard shows countdown, budget totals, checklist progress, and next task.
3. User can jump to Budget, Checklist, Share, Edit Event, or Switch Event.

### Budget Flow

1. Budget tab opens `BudgetCategoryListScreen`.
2. User reviews total planned/actual/deposit/balance.
3. User can add a custom category.
4. User taps a category to open `BudgetItemListScreen`.
5. User taps add/edit to open `BudgetItemFormScreen`.
6. Saving persists locally and recalculates totals.
7. Deleting an item/category cascades through local state where needed.

### Checklist Flow

1. Checklist tab opens `ChecklistTimelineScreen`.
2. User reviews progress and task list.
3. User marks tasks done or opens a task.
4. `ChecklistItemEditScreen` edits title/category/due date/notes/status.
5. Saving updates local checklist and notification records.

### Share Flow

1. User taps share from the dashboard.
2. `ShareCardPreviewScreen` renders event, budget, checklist, and Farha mark.
3. Native `Share.share` sends the text payload.
4. Image capture/save is intentionally tracked as a native follow-up.

### Pro Flow

1. Free users can create one event.
2. When a second event is attempted, the app opens `ProUpgradeScreen`.
3. Purchase/restore uses `Phase1BillingClient`.
4. The current adapter grants local entitlement for Phase 1; Play Billing SDK
   wiring remains a release task.

### Settings Flow

1. Settings tab opens `SettingsScreen`.
2. User can change language between Arabic and English.
3. User can toggle checklist reminder records.
4. User can open Pro restore/upgrade.
5. User can clear all local data, returning to onboarding.

## Publish Blockers Remaining

- Real Play Billing SDK product setup and tester verification.
- Real AdMob and UMP consent implementation if ads remain in scope.
- Real OS notification scheduling behind local notification records.
- Optional image capture/save for the share card.
- Signed release configuration with Play App Signing.
- Play Console account, privacy policy URL, data safety form, content rating,
  store listing text, screenshots, feature graphic, and testing track.
- Rendered Arabic/English RTL QA on device.
- Offline kill/reopen QA on device.
- Low/mid-end Android smoke test.

## Verification Commands

- `pnpm --filter @dawwar/farha type-check`
- `pnpm --filter @dawwar/farha lint`
- `pnpm --filter @dawwar/farha test`
- `./gradlew :app:processDebugMainManifest` from `apps/farha/android`
- `./gradlew :app:assembleDebug` from `apps/farha/android`

## QC Review

- Code quality: active code is feature-owned, typed, and dead prototype modules
  were removed.
- Architecture: navigation is centralized in `src/navigation`; planner business
  logic is centralized in `core/planner`; screens remain presentation +
  controller folders.
- UI: active screens use shared UI/theme components and customer-style bottom
  tabs.
- Localization/RTL: active visible copy is under `farha.phase1`; text alignment
  uses auto/RTL-aware styles where applied.
- Accessibility: tab buttons expose roles, selected state, and labels.
- Permissions: Android currently requests only `INTERNET`.
- Error/loading/empty states: screen chrome exposes load/error retry states;
  empty event/category/task states exist where relevant.
- Build risks: native release signing, billing, ads, notifications, and share
  image capture remain follow-ups.
- Release risks: Play Console, privacy, data safety, content rating, and store
  assets remain human/release-manager tasks.
