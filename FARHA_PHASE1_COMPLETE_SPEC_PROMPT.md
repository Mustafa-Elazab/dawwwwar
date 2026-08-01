# Farha — Phase 1 Complete Spec & Build Prompt

> This document is **self-contained**. It names every screen, states exactly
> what's on it, and spells out the exact logic inside it — nothing here says
> "see the plan file" for product behavior. It only defers to
> `AGENTS.md`/`FARHA_MONOREPO_BUILD_PLAN.md` for repo conventions (folder
> layout, shared-package names) and the non-goal boundaries (no Phase 2/3,
> no other apps, no backend). The paste-ready prompt is §10.

---

## 1. Navigation map (the whole app, at a glance)

```
SplashScreen
  └─(first launch)→ OnboardingWelcomeScreen → EventCreateScreen
  └─(0 events)→ EventCreateScreen
  └─(1 event, free tier)→ EventDashboardScreen
  └─(2+ events, Pro)→ EventListScreen → EventDashboardScreen

Bottom tabs (once inside an event): Home | Budget | Checklist | Settings

EventDashboardScreen ("Home" tab)
  ├─→ BudgetCategoryListScreen ("Budget" tab)
  │     └─→ BudgetItemListScreen
  │           └─→ BudgetItemFormScreen (bottom sheet: add/edit)
  ├─→ ChecklistTimelineScreen ("Checklist" tab)
  │     └─→ ChecklistItemEditScreen (bottom sheet: add/edit)
  ├─→ ShareCardPreviewScreen
  └─→ EventEditScreen (via header menu)

SettingsScreen ("Settings" tab)
  └─→ ProUpgradeScreen
```

---

## 2. Screen catalog — every screen, named, with exact logic

### S1. `SplashScreen`
- **Purpose:** app boot, decide where to route.
- **Logic:** check local storage for `hasOnboarded` flag and query the
  `events` table count. Routing: not onboarded → `OnboardingWelcomeScreen`;
  onboarded + 0 events → `EventCreateScreen`; onboarded + 1 event → that
  event's `EventDashboardScreen`; onboarded + 2+ events → `EventListScreen`.
- **UI elements:** logo only, no interactive elements.
- **Shared components:** none needed beyond theme background.

### S2. `OnboardingWelcomeScreen`
- **Purpose:** first-run explanation (2–3 slides): plan your budget, track
  your checklist, share your results.
- **UI elements:** swipeable slide container, "Skip" text button, "Get
  Started" primary button.
- **Logic:** on "Get Started"/"Skip", set `hasOnboarded = true` in local
  storage, navigate to `EventCreateScreen`.
- **Shared components:** `AppButton`, `AppText`, template shell from
  `ScreenTemplate`.

### S3. `EventCreateScreen`
- **Purpose:** create a new event.
- **Fields:** Event Type — segmented control (`Engagement` / `Wedding` /
  `Anniversary` / `Other`); Event Title — text input (placeholder
  "e.g. My Wedding"); Event Date — date picker (allow past dates, since
  anniversaries reference a date that already happened).
- **Validation:** Title required (non-empty after trim). Date required.
- **Logic on submit:**
  1. Insert row into `events`.
  2. Seed `budget_categories` for this event from the default list (§4) —
     insertable, deletable, and further custom categories addable later.
  3. Seed `checklist_items` for this event from the bundled
     `checklist_templates` matching the chosen event type (§5), computing
     each item's `due_date` as `event_date − offset_days_before_event`
     (skip/clamp items whose computed due date is already in the past
     relative to "now," but still create them marked so they show as
     overdue rather than silently vanishing).
  4. Schedule local notifications for items with a future due date (§8).
  5. Navigate to the new event's `EventDashboardScreen`.
- **Free-tier gate:** if the user already has one event and is not Pro,
  this screen is reached only via `ProUpgradeScreen`'s upsell path, not
  directly — see S13.
- **Shared components:** `SegmentedControl`, `FormField`/`AppInput`,
  date picker (evaluate against existing date-picking patterns in
  `apps/customer` before adding a new library), `AppButton`.

### S4. `EventListScreen`
- **Purpose:** switch between events (Pro feature — multiple events).
- **UI elements:** list of event cards — event type icon, title, date,
  a relative label ("in 42 days" / "18 days ago"), and a small budget
  chip (planned vs. actual). Floating "+ Add Event" button.
- **Logic:** tapping a card → that event's `EventDashboardScreen`. Tapping
  "+ Add Event": if not Pro and this would be a 2nd+ event, route to
  `ProUpgradeScreen` instead of `EventCreateScreen`.
- **States:** empty state should not occur here (this screen is only
  reachable when 2+ events already exist per the Splash routing in S1).
- **Shared components:** `ListItem`/`AppCard`, `EmptyState` (defensive,
  even if not expected to trigger), `ListScreenTemplate`.

### S5. `EventDashboardScreen`
- **Purpose:** the "Home" tab for the active event.
- **UI elements:**
  - Header: event title, date, and a countdown/elapsed label ("42 days to
    go" or "Celebrated 18 days ago" depending on sign).
  - **Budget Summary Card:** total planned, total actual (or planned where
    actual isn't set), total deposits paid, and an over/under-budget badge
    (see formula in §6). Tapping the card navigates to the "Budget" tab.
  - **Checklist Summary Card:** "X of Y tasks done," and the single
    next-upcoming pending task with its due date. Tapping navigates to the
    "Checklist" tab.
  - "Share Results" button → `ShareCardPreviewScreen`.
  - Header overflow menu: "Edit Event" → `EventEditScreen`; "Switch Event"
    → `EventListScreen` (Pro only, hidden otherwise).
  - Ad banner (free tier only — see §7).
- **States:** loading (skeleton on first read), success (populated cards),
  error (retry button) if the local DB read fails.
- **Shared components:** `AppCard`, `MetricCard`-style summary block
  (evaluate existing `@dawwar/ui` components before adding a new one),
  `AppButton`, `LoadingSpinner`/skeleton, `ErrorState`.

### S6. `EventEditScreen`
- **Purpose:** edit an event's title/date/type, or delete it.
- **Fields:** same as `EventCreateScreen` (S3), pre-filled.
- **Logic:** saving updates the `events` row. Changing the date does **not**
  retroactively re-offset already-customized checklist due dates — only
  recomputes for items still marked `source = template` and `status =
  pending`. Deleting the event requires a confirmation dialog and cascades:
  deletes its `budget_categories`, `budget_items`, and `checklist_items`,
  and cancels any scheduled notifications tied to it.
- **Shared components:** same form components as S3, plus a destructive
  `AppButton` variant for delete, and a confirmation `BottomSheet`/dialog.

### S7. `BudgetCategoryListScreen`
- **Purpose:** the "Budget" tab — list of categories for the active event.
- **UI elements:** header repeats the running total (planned / actual /
  deposits paid / balance remaining) with the same over/under badge as S5;
  below it, one row per category — name, item count, category subtotal
  (planned vs. actual). "+ Add Category" opens a small text-entry dialog
  for a custom category name.
- **Logic:** tapping a category → `BudgetItemListScreen` scoped to that
  category. Deleting a category (swipe or long-press action) requires
  confirmation if it has items, and cascades to delete its `budget_items`.
- **States:** empty state on a freshly-created custom category ("No items
  yet — add your first cost").
- **Shared components:** `SectionHeader`, `ListItem`/`ListRow`,
  `EmptyState`, `ListScreenTemplate`.

### S8. `BudgetItemListScreen`
- **Purpose:** items within one category.
- **UI elements:** one row per item — name, planned cost, actual cost,
  a status badge (`Unpaid` if deposit = 0, `Partial` if 0 < deposit <
  balance owed, `Paid` if balance remaining ≤ 0), due date if set. "+ Add
  Item" button.
- **Logic:** tapping a row or "+ Add Item" opens `BudgetItemFormScreen`
  (S9) as a bottom sheet, in edit or create mode respectively.
- **States:** empty state ("No costs added for this category yet").
- **Shared components:** `ListItem`, `AppBadge` for status, `EmptyState`.

### S9. `BudgetItemFormScreen` (bottom sheet)
- **Purpose:** create/edit a single budget line item.
- **Fields:** Item Name (text, required); Planned Cost (numeric, required,
  ≥ 0); Actual/Quoted Cost (numeric, optional, ≥ 0); Deposit Paid (numeric,
  optional, ≥ 0, default 0); Due Date (date, optional); Notes (text,
  optional).
- **Live-computed, read-only field:** **Balance Remaining** =
  `(actual_cost ?? planned_cost) − deposit_paid`, recalculated on every
  keystroke and shown directly in the form, not just after saving.
- **Validation:** Name and Planned Cost required; all monetary fields must
  be ≥ 0; Deposit Paid should not silently exceed
  `actual_cost ?? planned_cost` — show a non-blocking warning ("deposit is
  more than the total") rather than rejecting the input outright (real
  quotes change).
- **Actions:** Save (validates, inserts/updates `budget_items`, closes
  sheet, refreshes S7/S8/S5 totals); Delete (edit mode only, with
  confirmation).
- **Shared components:** `BottomSheet`, `FormField`/`AppInput`,
  `AppButton`.

### S10. `ChecklistTimelineScreen`
- **Purpose:** the "Checklist" tab — all tasks for the active event, in
  due-date order.
- **UI elements:** vertical timeline (evaluate `StepIndicator` from
  `@dawwar/ui` before building a custom one), each row showing task title,
  due date **or** a relative label ("14 days before"), a linked-category
  tag if set, and a checkbox/status control (pending / done / skipped).
  Overdue pending items are visually flagged (e.g. a warning tint). "+ Add
  Task" button for custom tasks.
- **Logic:** tapping the checkbox toggles `pending → done`; a secondary
  action allows `pending → skipped`. Both cancel that item's scheduled
  notification. Tapping the row (not the checkbox) opens
  `ChecklistItemEditScreen` (S11).
- **States:** empty only possible for an `Other` event type with no
  template (§5 covers only the three named types) — show an empty state
  prompting "+ Add Task" in that case.
- **Shared components:** `StepIndicator`, `ListItem`, `EmptyState`.

### S11. `ChecklistItemEditScreen` (bottom sheet)
- **Purpose:** create/edit a single checklist task.
- **Fields:** Title (text, required); Due Date (date, optional); Linked
  Category (optional dropdown of the event's current budget categories);
  Notes (optional).
- **Actions:** Save; Mark Done; Mark Skipped; Delete (allowed regardless
  of whether the task came from a template or was custom-added).
- **Logic:** saving with a changed Due Date re-schedules the local
  notification (cancel old, schedule new) if status is still `pending`.
- **Shared components:** `BottomSheet`, `FormField`/`AppInput`, a simple
  dropdown/select built from existing `@dawwar/ui` primitives.

### S12. `ShareCardPreviewScreen`
- **Purpose:** preview and share the generated report card.
- **Content of the card itself:** event title + date; countdown/elapsed
  label; total planned vs. actual budget with the over/under badge;
  checklist completion ("12 of 18 tasks done"); a small "Made with Farha"
  mark. Rendered RTL-correct for Arabic.
- **UI elements:** live preview of the rendered card; "Share" button
  (native share sheet); optional "Save Image" button.
- **Logic:** render off-screen, capture to an image, then hand to the
  platform share sheet. This screen is available on the **free tier** —
  sharing is the app's organic-growth mechanism and is deliberately not
  gated behind Pro.
- **Shared components:** `AppCard`, `AppText`, theme tokens for the visual
  card itself; native share integration (check for an existing
  screenshot/share dependency already used elsewhere in the repo before
  adding a new one).

### S13. `ProUpgradeScreen`
- **Purpose:** paywall / upsell.
- **Content:** clear list of Pro benefits — unlimited events, full
  checklist template library (a longer, more detailed version of §5's
  lists), no ads. One-time price, "Upgrade" button, "Restore Purchase"
  link.
- **Logic:** "Upgrade" triggers the Play Billing one-time purchase flow;
  on success, set local Pro flag, unlock gated features immediately (no
  restart required), and pop back to whatever screen triggered the
  upsell. "Restore Purchase" re-queries Play Billing for a prior purchase
  and re-applies the Pro flag if found.
- **Shared components:** `AppCard` per benefit row, `AppButton`.

### S14. `SettingsScreen`
- **Purpose:** the "Settings" tab.
- **Rows:** Language (Arabic/English toggle — delegates to
  `@dawwar/i18n`); Notifications (enable/disable checklist reminders
  globally); Pro status display with an "Upgrade" row (→ S13) if not Pro,
  or a "Restore Purchase" row if Pro status needs re-verifying; About/
  version info; "Clear All Data" (destructive, confirmation required —
  since there are no accounts, this is the equivalent of a full reset).
- **Shared components:** `ListItem`/`SectionHeader`, `AppButton`.

---

## 3. Screens explicitly out of scope for Phase 1

Any vendor-facing screen (listing form, vendor login, vendor dashboard) and
any directory/browse screen for the couple to find vendors — that entire
surface belongs to Phase 2 and is not part of this build.

---

## 4. Default budget categories (seeded per new event)

`Hall/Venue`, `Hotel`, `Wedding Dress`, `Groom's Suit`, `Makeup Artist`,
`Barber/Grooming`, `Gold/Shabka`, `Catering`, `Photography/Video`,
`Entertainment/DJ`, `Gifts`, `Other`. Seeded identically for all three event
types at creation time (S3 step 2) — irrelevant ones can simply be deleted
or left empty by the user, and custom categories can always be added.

---

## 5. Bundled checklist templates (seeded per new event, by type)

Each entry is `offset_days_before_event → task title`. Ship these as static,
versioned data inside the app — no network call.

**Wedding**
| Offset (days before) | Task |
|---|---|
| 365 | Set overall budget and estimated guest list |
| 300 | Book the hall/venue |
| 270 | Book a hotel for guests, if needed |
| 240 | Choose and order the wedding dress |
| 240 | Book photographer/videographer |
| 210 | Book the groom's suit |
| 180 | Book the makeup artist |
| 150 | Book entertainment/DJ |
| 120 | Order gold/shabka |
| 90 | Send invitations |
| 60 | Confirm catering menu and headcount |
| 45 | Book a barber/grooming appointment |
| 30 | Final dress fitting |
| 21 | Confirm final guest count with venue/caterer |
| 14 | Pay remaining vendor balances |
| 7 | Reconfirm all vendor arrival times |
| 3 | Pick up dress/suit |
| 1 | Final checklist review |

**Engagement**
| Offset (days before) | Task |
|---|---|
| 90 | Set engagement budget |
| 60 | Book venue/location |
| 45 | Order rings |
| 30 | Arrange gifts/shabka |
| 21 | Send invitations to close family |
| 14 | Confirm catering/refreshments |
| 7 | Confirm outfits |
| 1 | Final review |

**Anniversary**
| Offset (days before) | Task |
|---|---|
| 30 | Decide celebration type and budget |
| 21 | Book venue/restaurant, if needed |
| 14 | Order a gift |
| 7 | Send invitations, if hosting others |
| 1 | Final review |

`Other` event type: no bundled template — the checklist starts empty and
relies entirely on user-added tasks (this is why S10 explicitly has an
empty state for this case).

---

## 6. Business-logic formulas (exact, used across S5/S7/S8/S9/S12)

- `balance_remaining(item) = (item.actual_cost ?? item.planned_cost) − item.deposit_paid`
- `category_total_planned = Σ items.planned_cost`
- `category_total_actual = Σ (items.actual_cost ?? items.planned_cost)`
- `event_total_planned = Σ category_total_planned` (all categories)
- `event_total_actual = Σ category_total_actual`
- **Over/under badge:** `event_total_actual > event_total_planned` →
  "Over Budget" (warning color); else "On Budget" (success color).
- **Item status badge:** `deposit_paid ≤ 0` → `Unpaid`;
  `0 < deposit_paid < balance_owed_base` → `Partial`;
  `balance_remaining(item) ≤ 0` → `Paid`.
- **Checklist completion %** = `done_count / total_count` (excluding
  `skipped` from the denominator, since a skipped task isn't a "pending
  failure," it's a deliberate removal).
- **Countdown/elapsed label** = `event_date − today`; positive → "in N
  days," negative → "N days ago."

---

## 7. Monetization — exact gating rules

**Free tier:** ads shown (banner on `EventDashboardScreen` and
`BudgetCategoryListScreen`; at most one interstitial per session, shown
after a budget item is saved, never more than once every few minutes);
capped at **one active event**; full access to budget, checklist, and
sharing (sharing is intentionally never gated — it's the growth mechanism).
Checklist templates are the standard lists in §5.

**Pro (one-time unlock):** removes all ads; unlocks creating/switching
between multiple events (`EventListScreen`, "+ Add Event" past the first);
unlocks an extended/more detailed checklist template variant (same
structure as §5, more granular tasks — content detail can be finalized
during implementation, but the gating mechanism must be built now).

Purchase flow: Play Billing one-time product → on success, persist a local
`isPro = true` flag (also re-verifiable via "Restore Purchase") → every
gated UI path reads this flag through a single shared helper, not scattered
ad-hoc checks.

---

## 8. Notifications — exact trigger rules

- On creating an event (S3) and on any checklist item create/edit (S11):
  if `status = pending` and `due_date` is in the future, schedule a local
  notification for that `due_date` (a sensible fixed time, e.g. 9:00 AM
  device-local time).
- On marking an item `done` or `skipped`, or deleting it: cancel its
  scheduled notification.
- On editing an item's `due_date` while still `pending`: cancel the old
  notification, schedule a new one for the updated date.
- On deleting an event (S6): cancel every notification tied to its
  checklist items.
- Respect the global Settings toggle (S14) — if notifications are disabled
  there, do not schedule new ones (existing scheduled ones should also be
  cancelled when the toggle is turned off).

---

## 9. Non-negotiable boundaries (same as the master plan)

No vendor screens, no directory, no backend network calls, no marketplace
logic of any kind in this build. No changes to `apps/customer`,
`apps/driver`, `apps/merchant`, `apps/admin`, `apps/dorty`, or `backend/`.
Everything in this document must work fully offline.

---

## 10. The prompt to paste

```text
Read AGENTS.md and .ai/QC_CHECKLIST.md for repo conventions, then read this
entire file (FARHA_PHASE1_COMPLETE_SPEC_PROMPT.md) — it is the complete,
self-contained functional specification for Farha Phase 1. Do not guess at
product behavior; everything needed is written in sections 1 through 9.
Where this file names a shared @dawwar/ui component, confirm it exists with
that capability in the live repo before using it, and if it doesn't, say so
and propose the closest real alternative rather than inventing a local
one-off.

Build every screen listed in section 2, exactly as named (S1 SplashScreen
through S14 SettingsScreen), with the navigation flow in section 1, the
default categories in section 4, the checklist templates in section 5
seeded verbatim, the formulas in section 6 implemented exactly as written,
the monetization gating in section 7, and the notification rules in
section 8.

Work in this order: app scaffold/navigation shell -> SQLite schema and
repositories for events/budget_categories/budget_items/checklist_items ->
S1-S6 (splash, onboarding, event create/list/dashboard/edit) -> S7-S9
(budget category list, item list, item form, with the section 6 formulas
live in the form) -> S10-S11 (checklist timeline and item edit, with
section 8's notification scheduling) -> S12 (share card) -> S13-S14
(Pro upgrade paywall and settings, with section 7's exact gating rules).

After each stage, run type-check, lint, and test, and fix failures before
moving on. Keep a running note of what's built and verified in
docs/apps/farha-app.md.

Section 9's boundaries are absolute: no vendor/directory/marketplace
screens or logic, no backend calls, nothing outside apps/farha touched.
Everything must work with the network off.

If you reach a point where this specification is genuinely ambiguous or a
named shared component doesn't exist as described, stop and ask rather
than filling the gap with an assumption. Otherwise, complete all of
sections 1-8 in this run. Finish with a screen-by-screen confirmation (S1
through S14) that each one exists, is navigable, and matches its logic as
specified, plus the results of your type-check/lint/test runs.
```