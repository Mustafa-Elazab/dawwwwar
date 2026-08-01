# Farha — Monorepo Build Plan (apps/farha)

> Source of truth for building **Farha** (working title — from "الفرح", how
> weddings are actually referred to in Egyptian Arabic; trivial to rename via
> find/replace on `farha`/`@dawwar/farha` if a different name is chosen) — a
> single-sided wedding & life-event budget/checklist planner, evolving into a
> vendor-subscription directory, built as a **new app inside the existing
> `dawwwwar` monorepo**, reusing the shared packages already built for
> `@dawwar/customer`, `@dawwar/driver`, `@dawwar/merchant` and planned for
> `@dawwar/dorty`.

This plan intentionally sequences the business from easiest to hardest:

1. **Phase 1 — Planner (MVP):** single-sided, no vendors, no accounts needed
   on the vendor side at all. Ships fast, tests demand fast.
2. **Phase 2 — Vendor subscription directory:** vendors pay a flat monthly
   fee to be *listed*. No booking, no matching, no catalog management, no
   chicken-and-egg problem — this is a "yellow pages," not a marketplace.
3. **Phase 3 — Marketplace (future, not committed):** only ever considered
   if Phase 2 produces real, vendor-initiated demand for more (booking,
   messaging, payments). Documented here only as a boundary, not a build
   target.

Do not build Phase 3 speculatively. Do not let Phase 2 grow booking/matching
features "just in case" — that is exactly the complexity this plan is
designed to avoid.

---

## 0. Ground rules

1. Read `AGENTS.md`, `CLAUDE.md`, `.ai/skills/*` and `.ai/QC_CHECKLIST.md` at
   repo root before touching anything. They govern this repo and override
   anything conflicting here.
2. Farha is a new workspace package: `apps/farha`, published internally as
   `@dawwar/farha`. Do not touch `apps/customer`, `apps/driver`,
   `apps/merchant`, `apps/admin`, `apps/dorty` (if present) or `backend`
   except to *read* them for pattern reference — with the one explicit
   exception in §6 (the Phase 2 backend module).
3. Reuse-first policy, identical to the Dorty plan: use `@dawwar/ui`,
   `@dawwar/theme`, `@dawwar/i18n`, `@dawwar/types`, `@dawwar/api-client`,
   `@dawwar/mocks` as-is wherever they already cover a need; extend a shared
   package only for genuinely generic gaps; keep wedding/event-domain logic
   local to `apps/farha`.
4. Milestone discipline: one milestone at a time, state scope and files
   before editing, implement only that milestone, run checks, update status
   docs, stop and wait.
5. Phase 1 must work fully offline. Phase 2's vendor data is the **only**
   part of this app allowed to depend on network/backend availability — the
   budget/checklist/share features must keep working with no connection
   even after Phase 2 ships.
6. No vendor account, login, dashboard, catalog, calendar, or booking flow
   is to be built inside `apps/farha` at any phase in this plan. Vendor
   management lives outside the consumer app entirely (§5).

---

## 1. Shared packages — reuse inventory

Same monorepo, same packages already confirmed for Dorty. Mapping for Farha:

| Package | Reuse for Farha as |
|---|---|
| `@dawwar/ui` | `AppCard`/`ListItem`/`ListRow` for budget rows and vendor cards; `SectionHeader` for category groups; `Tabs`/`SegmentedControl` for switching between events (engagement/wedding/anniversary); `StepIndicator` for the checklist timeline; `FormField`/`AppInput` for budget entry; `BottomSheet` for add/edit item sheets; `SearchBar` + `EmptyState`/`ErrorState` for the vendor directory (Phase 2); `AppScreenTemplate`/`ScrollScreenTemplate`/`ListScreenTemplate` for screen shells. |
| `@dawwar/theme` | All colors/spacing/typography — no parallel theme system. |
| `@dawwar/i18n` | Arabic/English strings, RTL. Farha adds its own translation namespace/keys. |
| `@dawwar/types` | Follow existing conventions; Farha's own domain types (`Event`, `BudgetItem`, `ChecklistItem`, `VendorListing`) live in `apps/farha/src/types` unless a second app would realistically reuse them (unlikely at this stage — keep local). |
| `@dawwar/api-client` | Used only for Phase 2's vendor-directory calls (client factory/hooks pattern) — Phase 1 has no network calls at all. |
| `@dawwar/mocks` | Test fixtures for budget/checklist logic and, later, vendor directory responses. |

Before implementation, re-run this table against the live repo (`packages/ui/src/index.ts` etc.) the same way the Dorty plan's gap analysis works — component names/exports may have moved on.

---

## 2. Product scope

### Phase 1 — Planner (MVP)

**Event types** (this is a life-events app, not wedding-only):
`engagement`, `wedding`, `anniversary` (extensible later — baby shower, etc.).
A user can track more than one event over time; each event has its own
budget + checklist.

**Budget categories** (seeded defaults, user-editable, covering exactly the
vendor categories from Phase 2 plus a few more): hall/venue, hotel
(guests/honeymoon), wedding dress, groom's suit, makeup artist,
barber/grooming, gold/shabka, catering, photography/video, entertainment/DJ,
gifts, other.

Per budget item: planned cost, actual/quoted cost, deposit paid, balance
remaining, due date. Running total with an over/under-budget indicator —
same "financial cycle" pattern already proven conceptually in the Dorty
plan, applied to a wedding instead of a poultry cycle.

**Checklist:** per-category tasks with due dates relative to the event date
(e.g. "book the hall — 6 months before"), seeded from a bundled template per
event type, editable, markable done/skipped.

**Share card:** one tap produces a branded, RTL image summary of the
budget/checklist status, shareable to WhatsApp — same mechanism as Dorty's
M8.4 cycle report card, reused conceptually (not code-shared across apps,
since it's UI composition, not shared logic).

**Monetization (Phase 1):** free tier (unlimited budget/checklist, one
active event) + ads; one-time **Pro** unlock (~50–100 EGP) for: unlimited
events, full checklist template library, ad removal, and the shareable
export. Billed through Google Play Billing — confirmed workable for this
audience because Play purchases in Egypt already support card, <cite index="2-1">Vodafone Cash / Orange Cash linked directly to the Google Play account</cite>,
and <cite index="9-1">direct carrier billing through Etisalat and other
carriers charged straight to mobile balance</cite>, so a lack of a bank card
is not a blocker for this user base.

No accounts, no vendors, no backend required for Phase 1. It can be built
and shipped entirely offline-first.

### Phase 2 — Vendor subscription directory

**Vendor categories:** makeup artist, wedding dress rental, barber/grooming,
suit rental, hotel, hall. (`anniversary` is an **event type**, not a vendor
category — keep that distinction consistent everywhere in the schema/UI.)

**What the consumer app (`apps/farha`) does:** display approved,
currently-paid vendors per category + city, with photos, price range, and a
"Contact on WhatsApp" deep link. Read-only. No vendor login, no vendor UI,
no booking, inside this app.

**What actually runs the subscription business (outside `apps/farha`):**

- A vendor-facing signup surface **outside the consumer app** — a simple web
  form (or a Google Form / WhatsApp intake for the very first version) is
  enough; it does not need to be a polished product on day one.
- Vendor pays the monthly fee via Instapay, Vodafone Cash, or an Egyptian
  gateway (Paymob/Fawry) — **outside Google Play billing entirely.** This is
  the deliberate architecture choice, not a shortcut: Play's payments policy
  requires Play Billing mainly for digital goods/subscriptions bought
  *inside* an Android app; a vendor never pays anything inside `apps/farha`,
  so it never enters that policy surface at all. This is also easier
  operationally, and Google's own 2026 policy direction has been moving
  toward *more* freedom to use external payment methods, not less.
- Pricing tiers:

  | Tier | Price/month | Gets |
  |---|---|---|
  | Basic | 20 EGP | Appears in category/city list |
  | Featured | 60–100 EGP | Top of category, badge, more photos |

- Admin approval + subscription status (`active`/`expired` + expiry date)
  managed through a minimal internal tool — a basic admin table view is
  enough at first; it does not need the polish of `apps/admin`.

**Backend requirement:** vendor listings are shared, global data — they
cannot live in local SQLite the way Phase 1's budget data does. This is the
**one and only** place this plan touches `backend/`, and only with explicit
sign-off before starting (see §6/M5) — same discipline the Dorty plan uses
for its one backend-touching feature.

### Phase 3 — Marketplace (future boundary, not a build target)

Only ever considered if Phase 2 produces vendors proactively asking for
booking/calendar/messaging features, i.e. validated demand rather than a
guess. If that happens, it becomes its own separate planning exercise (new
data models per vendor type, trust/review system, possibly escrow) — it is
explicitly **out of scope** for every milestone in this document.

---

## 3. `apps/farha` project structure

```text
apps/farha/
├── android/ ios/                 # generated by RN CLI, same as other apps
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   └── providers.tsx         # composes shared theme/i18n providers
│   ├── core/
│   │   ├── database/             # SQLite: events, budget items, checklist items (Phase 1, NEW)
│   │   ├── monetization/         # ads + one-time IAP wrapper (Phase 1, NEW)
│   │   ├── sharing/               # report-card capture + native share (Phase 1, NEW)
│   │   ├── notifications/        # checklist due-date reminders (Phase 1, NEW)
│   │   └── directory/            # vendor-directory API client, read-only (Phase 2, NEW)
│   ├── features/
│   │   ├── onboarding/
│   │   ├── events/                # create/switch engagement | wedding | anniversary
│   │   ├── budget/                # categories, items, running total, over/under indicator
│   │   ├── checklist/             # timeline, due dates, done/skip
│   │   ├── directory/             # Phase 2: browse/search/detail, WhatsApp contact button
│   │   └── settings/
│   ├── navigation/
│   ├── store/                     # Redux Toolkit slices + typed hooks
│   ├── hooks/
│   └── types/                     # Event, BudgetItem, ChecklistItem, VendorListing
├── __tests__/
├── package.json                   # name: "@dawwar/farha"
├── tsconfig.json                  # extends ../../tsconfig.base.json, @dawwar/* path maps
├── babel.config.js / metro.config.js / react-native.config.js
```

Dependency rules identical to the Dorty plan: `apps/farha/src` may import
the shared packages plus its own `core`/`features`; no shared package may
import from `apps/farha`; screens are composition-only; no hardcoded
colors/spacing/strings — theme + i18n only.

---

## 4. Data model (Phase 1 + Phase 2)

Local SQLite (Phase 1, on-device, offline):

- `events` — id, type (`engagement`/`wedding`/`anniversary`/…), title, date,
  created_at.
- `budget_categories` — id, event_id, name, is_default.
- `budget_items` — id, category_id, planned_cost, actual_cost,
  deposit_paid, due_date, notes.
- `checklist_items` — id, event_id, category_id (nullable), title, due_date,
  status (`pending`/`done`/`skipped`), source (`template`/`custom`).
- `checklist_templates` — bundled, versioned, seeded per event type (ships
  in the app, no network fetch, same pattern as Dorty's M8.3 breed presets).

Backend-served (Phase 2, shared/global, via the new `backend/` module):

- `vendors` — id, category (`makeup_artist`/`dress_rental`/
  `barber_grooming`/`suit_rental`/`hotel`/`hall`), name, city, phone/WhatsApp,
  price_range, photos, tier (`basic`/`featured`), subscription_status,
  subscription_expiry.
- Vendor payment records are tracked in whatever minimal internal tool
  backs the admin approval flow (§2 Phase 2) — not modeled as an in-app
  purchase, since payment never happens inside `apps/farha`.

---

## 5. Explicit non-goals for `apps/farha` (all phases)

- No vendor login/registration screen inside this app.
- No booking, calendar/availability, or in-app messaging.
- No payment collection from vendors inside this app.
- No commission/escrow logic.
- No requirement on backend/network availability for Phase 1 features, ever
  — Phase 2's directory screen must degrade gracefully (clear empty/offline
  state) without breaking budget/checklist usage.

---

## 6. Repo integration tasks

1. `apps/farha` is covered automatically by `pnpm-workspace.yaml`'s
   `apps/*` glob.
2. `apps/farha/package.json` as `@dawwar/farha`, versions aligned with root
   `pnpm.overrides`, workspace deps on `@dawwar/ui`, `@dawwar/theme`,
   `@dawwar/i18n`, `@dawwar/types`, `@dawwar/api-client`, `@dawwar/mocks` via
   `"workspace:*"`.
3. `apps/farha/tsconfig.json` extending `../../tsconfig.base.json`, same
   `@dawwar/*` + `@/*` path-map pattern as `apps/customer`/`apps/dorty`.
4. Root `package.json` scripts: `"farha:android"`, `"farha:ios"`,
   `"farha:start"`, mirroring the existing per-app script pattern.
5. Turbo tasks (`build`/`lint`/`test`/`type-check`/`clean`) apply
   automatically via the workspace-wide config — no per-app turbo config
   needed unless Farha requires a custom output path.
6. **Backend module (Phase 2 only, requires explicit go-ahead before
   starting, same as Dorty's M8.5 flag):** a new NestJS module in `backend/`
   exposing vendor-directory read endpoints (e.g.
   `GET /api/farha/vendors?category=&city=`) and an admin-only
   create/approve/renew surface. This is the only backend change in this
   entire plan.
7. Update `docs/` per the repo's existing convention (see how
   `docs/apps/customer-app.md`/`docs/apps/merchant-app.md` are structured) —
   create `docs/apps/farha-app.md`, and eventually
   `docs/features/farha-screens.md` following the same screen-inventory
   format used elsewhere in this repo.

---

## 7. Milestones

### M0 — Monorepo integration & discovery
- Inspect the live repo the same way Dorty's M0 does: workspace config,
  `apps/customer` as closest pattern, current `@dawwar/ui`/theme/i18n
  exports.
- Scaffold `apps/farha` as `@dawwar/farha`, wired to shared packages, one
  placeholder screen rendering with theme + i18n.
- **Acceptance:** `pnpm --filter @dawwar/farha type-check|lint|test` clean;
  Android debug build boots to a themed, localized placeholder screen.

### M1 — Events + budget core
- SQLite schema/migrations/repositories for `events`, `budget_categories`,
  `budget_items`.
- Create/switch events (engagement/wedding/anniversary); add/edit budget
  items; running total + over/under indicator.
- **Acceptance:** a user can create a wedding event, add all default budget
  categories, enter planned/actual costs, and see a correct running total,
  fully offline.

### M2 — Checklist & timeline
- `checklist_items` + bundled `checklist_templates` per event type; timeline
  UI (evaluate `StepIndicator` from `@dawwar/ui` first, same rule as Dorty's
  M8.3); mark done/skip; local due-date reminders.
- **Acceptance:** creating an event auto-populates a sensible, editable
  checklist with working reminders, offline.

### M3 — Shareable report card
- Branded, RTL-correct image export of budget/checklist status; native
  share sheet integration.
- **Acceptance:** one tap produces a correct, well-laid-out shareable image
  with real numbers; works offline.

### M4 — Monetization (Phase 1 close-out)
- Ads integration (free tier) + one-time Pro unlock via Google Play
  Billing; multi-event support gated behind Pro.
- **Acceptance:** free tier fully usable with ads; Pro unlock removes ads
  and enables multi-event + full template library; purchase completes using
  at least one non-card Egyptian payment path (carrier billing or a mobile
  wallet) in test purchases.

### M5 — Vendor directory (Phase 2 start — requires explicit go-ahead)
- Confirm authorization to touch `backend/` before starting anything here.
- New NestJS module for vendor read/admin endpoints (§6.6).
- `apps/farha` directory feature: browse by category/city, vendor detail,
  WhatsApp contact button. Read-only, no vendor auth in-app.
- **Acceptance:** directory renders real approved vendors from the backend;
  with zero vendors in a category it shows a clean empty state, not an
  error; Phase 1 features remain fully functional with the network off.

### M6 — Vendor subscription operations
- Minimal admin approval + subscription-status/expiry tooling; pricing
  tiers (basic/featured) reflected in sort order and badge in the directory
  UI; renewal reminder process (can be manual/WhatsApp-based at this stage,
  does not need to be automated).
- **Acceptance:** a vendor whose subscription has expired stops appearing
  in the directory without manual app-side intervention beyond the admin
  toggle.

### M7 — Hardening and store release
- Accessibility/RTL audit, low-end Android profiling, signed AAB, Play
  internal/closed testing, iOS TestFlight lane once signing is configured.

Stop-and-wait rule applies at every milestone boundary, per `AGENTS.md`.

---

## 8. First Codex execution prompt

```text
Read AGENTS.md, CLAUDE.md, .ai/QC_CHECKLIST.md and
FARHA_MONOREPO_BUILD_PLAN.md completely. Treat the plan file as the source
of truth for Farha; treat AGENTS.md as the source of truth for how to work
in this repo. Work only on Milestone M0 — Monorepo integration & discovery.

Before editing:
1. Inspect the repo: pnpm-workspace.yaml, root package.json, turbo.json,
   tsconfig.base.json, and apps/customer (and apps/dorty if it exists) as
   the closest existing app patterns.
2. Re-run the §1 shared-package reuse table against the live repo: confirm
   what @dawwar/ui, @dawwar/theme, @dawwar/i18n, @dawwar/types,
   @dawwar/api-client and @dawwar/mocks currently export, and note any drift
   from this document.
3. Present the exact M0 scope: files to create under apps/farha, root
   package.json script additions, and confirm no shared-package or
   backend/ changes are needed in M0.

Then implement M0 only:
- Scaffold apps/farha as @dawwar/farha, wired into the workspace.
- Add workspace dependencies on the shared packages listed in §1.
- Render one placeholder screen using @dawwar/ui + @dawwar/theme +
  @dawwar/i18n (Arabic/English) to prove integration.
- Create docs/apps/farha-app.md following this repo's existing docs/apps/*
  convention.

Do not implement budget/checklist/directory features yet. Do not modify
apps/customer, apps/driver, apps/merchant, apps/admin, apps/dorty, or
backend/. Do not add or upgrade a shared-package dependency without stating
why. Run type-check, lint and test via the relevant turbo/pnpm filters and
fix in-scope failures. Finish with: files changed, versions confirmed,
commands/tests run and results, any drift found versus this plan's §1, and
the precise entry criteria for M1. Stop and wait.
```

Repeat this exact prompt shape for M1 → M4 (Phase 1), each its own
stop-and-wait unit. Before starting M5, use a separate, explicit
authorization step confirming it's acceptable to modify `backend/` — do not
fold that authorization into a routine "next milestone" instruction.

---

## 9. Definition of done

- Phase 1 (M0–M4) works fully offline, with no vendor/backend dependency of
  any kind — this is the entire business at that stage, and it must stand
  on its own.
- No screen, at any phase, includes vendor login, booking, calendar, or
  payment-collection UI — if any of that appears, it's out of scope per §5
  and should be flagged, not built.
- Every screen uses `@dawwar/ui` templates/atoms/molecules/organisms
  wherever a suitable one exists; no shadow copy of an existing shared
  component lives inside `apps/farha`.
- The Phase 2 backend module is the only change to `backend/` in this whole
  plan, and only happened after explicit authorization, documented as such.
- `apps/customer`, `apps/driver`, `apps/merchant`, `apps/admin` and
  `apps/dorty` are unaffected except where a shared package was
  deliberately and visibly extended.
- Docs (`docs/apps/farha-app.md`, `docs/features/farha-screens.md`) exist
  and match the repo's existing documentation conventions.