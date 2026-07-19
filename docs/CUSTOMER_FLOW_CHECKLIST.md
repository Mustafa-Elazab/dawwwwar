# Customer Flow Checklist

Status legend:

- Pass: verified by type-check and static route/API wiring inspection.
- Pending Runtime: requires emulator/backend session.
- Blocked Figma: requires final Figma PNG for pixel-close rebuild.

## Auth

| Flow | Status | Notes |
| --- | --- | --- |
| Splash -> Login -> OTP -> Home | Pass | Splash, phone, OTP keep existing controllers and navigation. |
| Session restore | Pass | Splash controller keeps token restore flow. |
| Logout | Pending Runtime | Profile logout wiring remains in controller; emulator check needed. |

## Home

| Flow | Status | Notes |
| --- | --- | --- |
| Merchant list loads from backend | Pass | Existing hooks retained. |
| Categories load from backend | Pass | Existing category query retained. |
| Search works | Pending Runtime | Search route/hook retained; needs backend/emulator verification. |
| Default backend location shown | Pending Runtime | Existing delivery location hook retained. |
| Location selector modal works | Pending Runtime | Shared `LocationSelectorSheet` available; screen migration still pending. |
| Cairo vs Mansoura merchant refresh | Pending Runtime | Depends on backend data and emulator location selection. |

## Merchant Details

| Flow | Status | Notes |
| --- | --- | --- |
| Back button | Pass | Existing handler retained. |
| Category tabs clickable | Pass | Existing scroll-to-section logic retained. |
| Add item works | Pending Runtime | Cart handlers retained; emulator check needed. |

## Cart and Checkout

| Flow | Status | Notes |
| --- | --- | --- |
| Global cart access | Pass | Existing navigation/store wiring retained. |
| Cart opens and shows items | Pass | Existing cart selectors retained. |
| Checkout null-safe | Pending Runtime | Type-check passes; runtime order flow still needs emulator check. |
| Place order CASH | Pending Runtime | Existing controller retained. |
| Place order wallet | Pending Runtime | Existing controller retained. |
| Address selection | Pending Runtime | Existing profile/location hooks retained. |

## Orders, Tracking, Chat

| Flow | Status | Notes |
| --- | --- | --- |
| Orders list | Pass | Existing query and detail navigation retained. |
| Order details | Pass | Existing detail query retained and split into view models. |
| Tracking | Pending Runtime | Existing screen/controller retained. |
| Chat | Pending Runtime | `OrderChatScreen` still needs template split and runtime check. |

## UI Quality Gates

| Gate | Status | Notes |
| --- | --- | --- |
| `@dawwar/ui` type-check | Pass | `pnpm --filter @dawwar/ui type-check` passes. |
| `@dawwar/customer` type-check | Pass | Passed before this checklist; rerun required after final screen rebuild. |
| Pixel-close Speedy Chow UI | Blocked Figma | Need final Figma PNGs per screen. |
