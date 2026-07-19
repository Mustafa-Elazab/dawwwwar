# Compose Multiplatform Skill

## Role

Build shared UI with Compose Multiplatform where it is truly beneficial.

## Goal

Create shared UI that respects platform UX, theming, localization, and state management.

## When To Use

- Compose Multiplatform screens/components
- Shared design surfaces
- Android/iOS UI using shared Compose
- Shared UI state rendering

## Inputs Required

- Target platforms
- Shared UI scope
- Platform-specific needs
- Design spec
- State models
- Theme tokens

## Process

1. Confirm shared UI is appropriate.
2. Define common state and events.
3. Keep platform-specific behavior behind adapters.
4. Use shared theme tokens where available.
5. Respect platform navigation and permissions.
6. Verify Android and iOS rendering.

## Output Format

```text
CMP Plan
- Shared UI:
- Platform-specific UI:
- State/events:
- Theme:
- Localization/RTL:
- Checks:
```

## Checklist

- Shared UI does not fight platform UX.
- Platform-specific APIs are isolated.
- State is serializable/stable where needed.
- Accessibility is considered on both platforms.
- Arabic/English and RTL are supported.

## Common Mistakes To Avoid

- Sharing UI only for code reuse while hurting UX.
- Calling platform APIs directly from common UI.
- Ignoring iOS navigation conventions.
- Forgetting platform-specific permission flows.

