# Project Context

This repository contains mobile and supporting apps for Dawwar. AI agents must inspect the current tree before assuming exact structure, because app boundaries and shared packages may evolve.

## Expected App Areas

- React Native apps under `apps/`.
- Shared packages under `packages/`.
- Android native folders inside each mobile app's `android/`.
- iOS native folders inside each mobile app's `ios/`.
- Shared design/theme/i18n/types/API logic in workspace packages.

## Current Mobile Concerns

- Arabic and English localization.
- RTL support.
- Customer, driver, and merchant user journeys.
- Shared UI/theme/i18n packages.
- React Navigation, React Query, Redux, Axios, Firebase, native modules.
- Android permissions, geolocation, media/files, release manifests.
- iOS permissions, Info.plist, signing, release readiness.

## Before Editing

Inspect:

- relevant app entry point
- navigation
- feature screen folder
- components and styles
- hooks/controllers/view models
- API services/hooks
- shared packages
- localization files
- native platform files if needed

## Documentation Rule

Update docs when a task changes:

- architecture
- setup commands
- environment variables
- native permissions
- API contracts
- design system decisions
- release process
- localization behavior

