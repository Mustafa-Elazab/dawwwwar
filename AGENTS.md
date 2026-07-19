# AI Agent Operating Guide

Read this file before any task. It defines how AI coding agents must work in this repository.

## Repo Rules

- Understand the current project structure before editing. Inspect the relevant app, package, native folder, navigation, state, API, and design-system files first.
- Work task by task. Do not rewrite a full app, screen family, navigation tree, state layer, or design system without explicit permission.
- Preserve existing architecture, naming, folder boundaries, and style unless a task explicitly asks to change them.
- Do not add libraries without explaining why, where they are used, and what build risk they introduce.
- Never break Android, iOS, or React Native build readiness. Native changes require native verification.
- Keep Arabic and English localization ready. Every new visible string must be translatable or intentionally static.
- Prefer scalable clean architecture over quick coupling.
- Add comments only when they explain important logic, lifecycle behavior, platform constraints, or non-obvious decisions.
- Every feature must account for loading, success, empty, and error states.
- Update docs after important changes.

## Task Workflow

1. Read this file.
2. Inspect the current project structure and the files most likely affected.
3. Identify the correct skills in `.ai/skills/`.
4. Before implementation, write a short plan.
5. For UI work, write a design spec before coding.
6. Implement the smallest safe change.
7. Run relevant checks.
8. Run the QC checklist in `.ai/QC_CHECKLIST.md`.
9. Update docs when the change affects architecture, setup, API contracts, release behavior, or user-facing workflows.
10. Summarize what changed, checks run, risks, and follow-ups.

## Coding Standards

- TypeScript: prefer explicit public types, safe narrowing, and local helper functions over broad `any`.
- Kotlin: prefer immutable models, sealed UI states, coroutines with structured concurrency, and Flow/StateFlow for observable state.
- Swift: prefer clear MVVM boundaries, typed async flows, and platform-native accessibility/localization.
- Avoid duplicated business rules across UI layers. Move validation and mapping into domain/use-case/helper layers where appropriate.
- Keep side effects out of render functions and pure UI components.
- Use dependency injection for services where the platform stack supports it.
- Keep API clients typed and error-aware.

## Architecture Rules

- Follow Clean Architecture where native apps use it: presentation -> domain -> data.
- React Native features should stay modular: screen, components, hooks/controllers, API/core, types, styles.
- Shared packages should not depend on app-specific code.
- Domain models should be stable and reusable.
- Network DTOs should be mapped before leaking into UI when the API shape is not UI-friendly.
- Navigation decisions should stay in navigation guards/controllers, not deeply nested presentational components.
- Persistent storage keys must be documented and migration-safe.

## UI Rules

- Start UI tasks with UX intent, information hierarchy, and states.
- Define exact UI hierarchy before coding: screen, sections, components, controls, and state surfaces.
- Use reusable components and atomic design where available.
- Match existing customer/driver/merchant visual language unless asked to redesign.
- Support light and dark themes.
- Support Arabic and English layouts, including RTL alignment and mirrored directional icons.
- Use `textAlign: 'auto'` or explicit RTL-aware alignment for localizable text.
- Do not hardcode user-facing strings unless they are brand names or stable technical labels.
- Include loading, empty, error, disabled, and success states.
- Preserve accessibility: labels, roles, touch target size, contrast, focus order, and screen-reader behavior.

## QC Rules

After every task, run a QC review:

- Code quality
- Architecture quality
- UI consistency
- Localization and RTL
- Accessibility
- Permission handling
- Error handling
- Loading, empty, success states
- Edge cases
- Tests needed
- Build risks
- Release risks

Use `.ai/QC_CHECKLIST.md` for the detailed checklist.

## Platform Rules

### Android Native

- Use Kotlin, XML, ViewBinding, DataBinding when useful, Jetpack Compose, MVVM, Clean Architecture, Hilt, Retrofit/OkHttp, Coroutines, Flow/StateFlow, Room/DataStore, and Firebase carefully.
- Keep permissions explicit and degrade gracefully when denied.
- Validate manifest, Gradle, proguard/R8, signing, localization, and release settings for native changes.

### React Native

- Use TypeScript, JSX/TSX, React Navigation, React Query, Redux/Zustand only where useful, Axios, Firebase, and native modules carefully.
- Prefer feature-local components and hooks/controllers.
- Avoid broad package barrel imports if they have caused runtime resolution problems.
- Native module changes require Android/iOS rebuild verification.

### iOS Native

- Use SwiftUI first where appropriate, UIKit when needed, Objective-C only for legacy interop.
- Keep permissions, Info.plist strings, localization, signing, capabilities, and App Store release readiness in scope.

### Kotlin Multiplatform / Compose Multiplatform

- Put shared business rules, models, validation, and networking in shared modules.
- Keep platform-specific APIs behind expect/actual or adapters.
- Avoid forcing UI abstractions across platforms when native UX should differ.

## Commit / Task Completion Checklist

- Plan was stated before implementation.
- Design spec exists for UI tasks.
- Existing architecture was followed.
- New strings are localized or intentionally static.
- Loading, success, empty, and error states are handled.
- Accessibility and RTL were considered.
- Permissions and platform manifests were checked when relevant.
- Tests/build/type-checks were run or clearly documented as not run.
- QC checklist was completed.
- Docs were updated when needed.
- Final response includes changed files, checks, risks, and next steps.

