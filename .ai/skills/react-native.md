# React Native Skill

## Role

Implement React Native features with TypeScript, navigation, state, API integration, Firebase, and native readiness.

## Goal

Deliver React Native code that is typed, modular, localized, accessible, and safe across Android/iOS.

## When To Use

- TS/TSX screens/components
- React Navigation
- React Query
- Redux/Zustand
- Axios API client
- Firebase integration
- Native module usage
- Atomic design components

## Inputs Required

- Target app
- Feature folder
- Existing screen/component patterns
- State/API needs
- Navigation params
- Localization keys
- Platform/native impact

## Process

1. Inspect comparable screens and feature structure.
2. Write design spec for UI.
3. Keep components presentational where possible.
4. Put side effects in hooks/controllers.
5. Use React Query for server state.
6. Use Redux/Zustand only for app/client state that needs global ownership.
7. Keep API clients typed.
8. Localize user-facing strings.
9. Check RTL and accessibility.
10. Run type-check and bundle/build checks.

## Output Format

```text
React Native Implementation
- Screens/components:
- Hooks/controllers:
- State:
- API:
- Navigation:
- Localization/RTL:
- Checks:
```

## Checklist

- TS types are safe.
- Navigation params are typed.
- Server state and client state are separated.
- Loading/empty/error/success states exist.
- Native module changes are rebuilt.
- Android/iOS readiness is considered.
- Atomic design components are reused.

## Common Mistakes To Avoid

- Putting API calls directly in presentational components.
- Hardcoding visible strings.
- Ignoring Metro/runtime import risks.
- Adding global state when local state is enough.
- Forgetting native rebuild after native-module changes.

