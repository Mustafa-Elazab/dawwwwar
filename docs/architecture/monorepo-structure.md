# Monorepo Structure - Dawwar

Dawwar uses a Turborepo-powered monorepo to manage multiple applications and shared packages within a single repository.

## Directory Layout

### /apps
- **customer:** React Native application for customers.
- **driver:** React Native application for drivers.
- **merchant:** React Native application for merchants.
- **admin:** Next.js web application for platform administration.

### /backend
- Centralized NestJS API.
- Shared by all applications.

### /packages
- **ui:** Atomic design-based UI component library (Atoms, Molecules, Organisms, Templates).
- **theme:** Centralized design system (Colors, Spacing, Typography, Radius, Shadows).
- **types:** Shared TypeScript interfaces, enums, and models (Single Source of Truth).
- **api-client:** Shared Axios-based API client and TanStack Query hooks.
- **i18n:** Localization system (ar.json, en.json) with RTL/LTR management.
- **utils:** Common utility functions (distance, formatting, validators).
- **config:** Shared environment and platform configurations.

## Workspace Strategy
- **Shared Code:** Any logic used by more than one app should live in a package.
- **Type Safety:** The `packages/types` package ensures that frontend and backend contracts are always synchronized.
- **UI Consistency:** The `packages/ui` and `packages/theme` ensure a consistent look and feel across all mobile apps.

## Dependency Relationships
- All apps depend on `packages/api-client`, `packages/types`, `packages/i18n`, and `packages/theme`.
- Mobile apps also depend on `packages/ui`.
- The backend depends on `packages/types` and `packages/config`.
