# Farha Phase 1 App Readiness

## What Was Implemented

- M0-M4 Phase 1 planner remains local/offline first with modular feature folders, native-stack navigation, bottom tabs, Arabic/English copy, RTL-ready layout, splash assets, app icon assets, and Metro/debug bundle readiness.
- Savings Fund addendum is implemented as a local-only feature with contributions, monthly goals, allocation audit rows, due-date-first suggestions, and budget deposit integration.
- Free-tier AdMob integration is added through `react-native-google-mobile-ads` test IDs, UMP consent gating, Dashboard/Budget banners, and capped budget-save interstitials.
- Play Billing is wired through `react-native-iap` and `react-native-nitro-modules`; purchase/restore set the same existing Pro flag.
- Firebase app services are added with fire-and-forget Crashlytics, Analytics, Performance, and Messaging token groundwork.
- Android native config includes AdMob test app metadata and guarded Firebase Gradle plugin application so local builds do not fail before `google-services.json` exists.

## Screens

- `SplashScreen`: branded boot screen using the Farha gradient and logo assets, then hands off after i18n/app services initialize.
- `OnboardingWelcomeScreen`: explains offline budget, checklist, and share-card planning before creating the first event.
- `EventCreateScreen`: creates an event and seeds default budget categories plus checklist templates.
- `EventListScreen`: Pro-only event switcher for multiple local plans.
- `EventDashboardScreen`: home tab with event countdown, budget summary, savings summary, checklist summary, share entry, free-tier banner ad, and event actions.
- `EventEditScreen`: edits event type/title/date and refreshes template due dates.
- `BudgetCategoryListScreen`: budget tab with total card, savings entry, free-tier banner ad, custom category form, and category rows.
- `BudgetItemListScreen`: lists items inside a category with payment badges and add/edit navigation.
- `BudgetItemFormScreen`: creates/edits/deletes budget items, uses the calendar picker, shows balance warnings, and warns if manual deposits are lowered below savings allocations.
- `ChecklistTimelineScreen`: checklist tab with progress, task status actions, and custom task entry.
- `ChecklistItemEditScreen`: creates/edits/deletes custom checklist tasks and updates local reminders.
- `SavingsFundScreen`: shows fund balance, this-month progress, monthly goal input, contribution list, add contribution, and allocation entry.
- `SavingsContributionFormScreen`: adds/edits/deletes local savings contributions with amount/date/note validation.
- `SavingsAllocationScreen`: allocates available fund balance to unpaid budget items, with suggested allocation by nearest due date.
- `ShareCardPreviewScreen`: previews and shares the local report card.
- `ProUpgradeScreen`: starts Play Billing purchase/restore.
- `SettingsScreen`: language, local reminders, Pro status, about, and local data clearing.

## Main Flows

- First launch: Splash -> Onboarding -> Create Event -> Dashboard.
- Budget: Dashboard/Budget tab -> Category -> Add/Edit Item -> optional interstitial for free users.
- Checklist: Checklist tab -> mark done/skipped or edit task -> local notification records update.
- Savings: Dashboard/Budget header -> Savings Fund -> Add Contribution -> Allocate Funds -> budget item deposits update with audit rows.
- Share: Dashboard -> Share Card -> native share sheet -> analytics event.
- Pro: Settings/Pro -> purchase or restore -> `isPro` flag set -> ads stop rendering and multi-event unlock remains available.
- Language: Settings toggles Arabic/English, with RTL-ready screen chrome and text alignment.

## Data And Storage

- Storage key remains `farha.phase1.v1`; the repository normalizer adds missing savings arrays for older local data.
- Savings tables:
  - `savingsContributions`: `id`, `eventId`, `amount`, `date`, `note`, timestamps.
  - `savingsAllocations`: `id`, `eventId`, `budgetItemId`, `amount`, `date`, `createdAt`.
- Balance formula: contributions total minus allocations total.
- Allocation confirmation inserts audit rows and increments the target budget item `depositPaid`.

## SDK Notes

- AdMob uses Google test IDs until production unit IDs are supplied.
- Firebase JS calls are no-op safe, but real Crashlytics/Analytics/Performance/Messaging require Farha’s `android/app/google-services.json`.
- Play Billing uses SKU `farha_pro_lifetime`; this SKU must exist in Google Play Console before store testing.
- All SDK failures are caught and reported to Crashlytics where possible; offline planner save/load flows remain core.

## Verification

- `pnpm --filter @dawwar/farha type-check`
- `pnpm --filter @dawwar/farha lint`
- `pnpm --filter @dawwar/farha test -- --runInBand`
- `cd apps/farha/android && ./gradlew :app:assembleDebug`

## Release Follow-Ups

- Add real Firebase config files and verify Crashlytics/Analytics dashboards.
- Replace AdMob test app/unit IDs with production IDs after AdMob account approval.
- Create and activate the `farha_pro_lifetime` Play Billing product.
- Run an Android release build and real-device smoke test after production SDK config is added.
- Keep the Farha Android Kotlin metadata compatibility flag until the monorepo moves past Kotlin 2.1.x or Google Mobile Ads no longer needs newer Kotlin metadata.
