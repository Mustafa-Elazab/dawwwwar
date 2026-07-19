# Codex Guide

This file tells Codex how to work safely in this repository. Always read `AGENTS.md` first, then this file, then relevant `.ai/skills/*.md` files.

## Behavior

- Be a careful senior mobile engineer.
- Inspect before editing. Let the existing repo shape teach the solution.
- Keep changes small and task-focused.
- Prefer implementation over vague advice once enough context is known.
- Be explicit about assumptions and risks.
- Do not perform large rewrites without permission.
- Do not add dependencies without a short rationale and build-risk note.
- Protect user work. Never revert unrelated changes.

## How To Inspect Files

- Start with `rg --files`, `rg`, `sed`, and targeted `find`.
- Inspect:
  - app entry points
  - navigation
  - feature screens/components
  - hooks/controllers/view models
  - API clients and models
  - localization files
  - theme/design-system files
  - native Android/iOS files when platform behavior is involved
- For React Native native changes, inspect both JS and native build files.
- For UI tasks, compare similar existing screens before designing.

## Safe Implementation Rules

- Use existing architecture and naming.
- Edit only the files needed for the task.
- For manual edits, use patch-based changes.
- Do not create generic abstractions unless they reduce real duplication or match local patterns.
- Keep platform-specific behavior isolated.
- Ensure state updates are predictable and error-aware.
- Avoid top-level side effects except app bootstrap/configuration.

## UI Task Flow

1. Read `AGENTS.md`.
2. Read `.ai/skills/design-figma.md` and the platform skill.
3. Inspect comparable screens.
4. Write a short design spec:
   - screen goal
   - hierarchy
   - components
   - states
   - spacing/type/color
   - RTL/localization behavior
5. Implement.
6. Verify with type-check/build and QC.

## Avoiding Large Unnecessary Rewrites

- Keep existing navigation and state layers unless the task directly targets them.
- Refactor only the touched path.
- If a better architecture is visible but not required, mention it as a follow-up.
- Do not replace a feature just because another app has a nicer version. Port patterns deliberately.

## QC After Each Task

Run `.ai/QC_CHECKLIST.md` after implementation. At minimum report:

- checks run
- UI consistency
- localization/RTL
- accessibility
- error/loading/empty states
- build risks
- release risks

## Verification Guidance

- React Native TypeScript: run the app package type-check.
- React Native runtime import graph: run a Metro bundle when import or packaging risk exists.
- Android native: run the relevant Gradle compile/manifest/resource task.
- iOS native: run the relevant xcodebuild or explain if unavailable.
- KMP/CMP: run shared module tests/compile tasks.
- If a check cannot run, state why and what manual verification remains.

