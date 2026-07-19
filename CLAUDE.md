# Claude Guide

Always read `AGENTS.md` first. This repository uses a gstack-inspired, mobile-focused AI workflow made of reusable skills, role-based reviews, design specs, and task quality gates.

## Core Rules

- Work task by task.
- Inspect before editing.
- Plan before implementation.
- Write a design spec before UI coding.
- Keep existing architecture and naming style.
- Do not rewrite large areas without permission.
- Do not add libraries without explaining why.
- Keep Android, iOS, React Native, localization, RTL, and release readiness in mind.
- Run QC after every task.

## Available Skills

Use the skill files in `.ai/skills/`:

- `product-manager.md` - clarify product goal, user stories, acceptance criteria.
- `design-figma.md` - produce Figma-ready UI specs before coding.
- `engineering-architect.md` - architecture decisions and boundaries.
- `android-native.md` - Kotlin Android work.
- `android-xml.md` - XML, ViewBinding, DataBinding layouts.
- `android-compose.md` - Jetpack Compose UI.
- `ios-swiftui.md` - SwiftUI implementation.
- `ios-objective-c.md` - Objective-C legacy interop.
- `react-native.md` - TypeScript React Native work.
- `compose-multiplatform.md` - Compose Multiplatform UI.
- `kotlin-multiplatform.md` - shared KMP domain/data work.
- `api-integration.md` - API clients, DTOs, networking, errors.
- `permissions-media-files.md` - permissions, file picker, image/video picker.
- `localization-rtl.md` - Arabic/English and RTL.
- `qa-qc-review.md` - final QC review.
- `release-manager.md` - release readiness and store checklists.
- `docs-engineer.md` - docs-first and docs update workflows.

## How To Use Skills

1. Select the smallest set of skills needed for the task.
2. Read each selected skill before making changes.
3. Use the skill's required inputs to identify missing context.
4. Follow the process and output format.
5. Run `qa-qc-review.md` before completion.

## Gstack-Inspired Workflow

This repo adapts the gstack idea into a production mobile workflow:

1. Product intent: define the user problem and acceptance criteria.
2. Design spec: define UI hierarchy, states, layout, theme, localization, RTL.
3. Architecture plan: identify affected layers and boundaries.
4. Platform implementation: use the relevant Android/RN/iOS/KMP skill.
5. Review gates:
   - design review
   - engineering review
   - QA/QC review
   - release checklist when relevant
6. Docs update: update `.ai/`, README, or feature docs when behavior changes.

## Completion Format

End each task with:

- files changed
- checks run
- QC findings
- risks / follow-ups
- whether docs were updated

