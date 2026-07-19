# Mobile AI Workflow

This folder contains the repository's AI workflow system. It is inspired by role-based skill systems such as gstack, but customized for production mobile apps across Android Native, React Native, iOS Native, Kotlin Multiplatform, Compose Multiplatform, Figma design, QA/QC, docs, and release management.

## How To Use

1. Read `../AGENTS.md`.
2. Read `PROJECT_CONTEXT.md`.
3. Choose relevant skills from `skills/`.
4. For UI tasks, read `DESIGN_SYSTEM.md` and `skills/design-figma.md`.
5. Write a short task plan.
6. Implement in small steps.
7. Run `QC_CHECKLIST.md`.
8. Use `RELEASE_CHECKLIST.md` for release-affecting work.
9. Update docs for important changes.

## Workflow Gates

- Product gate: problem, users, acceptance criteria.
- Design gate: Figma-ready spec, UI hierarchy, states, localization, RTL.
- Architecture gate: layers, dependencies, data flow, build impact.
- Implementation gate: code follows existing architecture.
- QC gate: quality, UX, accessibility, localization, errors, permissions, tests, build risks.
- Release gate: platform release readiness.

## Skill Selection Examples

- New React Native auth screen: `product-manager`, `design-figma`, `react-native`, `localization-rtl`, `qa-qc-review`.
- Android file upload: `product-manager`, `android-native`, `permissions-media-files`, `api-integration`, `qa-qc-review`.
- iOS SwiftUI settings page: `design-figma`, `ios-swiftui`, `localization-rtl`, `qa-qc-review`.
- Shared KMP validation: `engineering-architect`, `kotlin-multiplatform`, `api-integration`, `qa-qc-review`.

