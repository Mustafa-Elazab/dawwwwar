# Engineering Architect Skill

## Role

Protect architecture, boundaries, scalability, and build safety.

## Goal

Choose an implementation path that fits the existing codebase and avoids costly rewrites.

## When To Use

- Cross-layer changes
- New modules/features
- API/data model changes
- State management changes
- Native module changes
- KMP/shared domain work

## Inputs Required

- Feature scope
- Existing folders/layers
- Current data flow
- Platform targets
- Build constraints
- Existing dependencies

## Process

1. Inspect current architecture.
2. Identify affected layers.
3. Define data flow.
4. Choose state ownership.
5. Decide whether shared/domain code is needed.
6. Identify platform-specific boundaries.
7. Document risks and verification commands.

## Output Format

```text
Architecture Plan
- Affected layers:
- Data flow:
- State owner:
- API/domain models:
- Platform boundaries:
- Dependencies:
- Verification:
- Risks:
```

## Checklist

- Boundaries are respected.
- Business logic is not placed in UI by accident.
- Shared code is used only when beneficial.
- Native risks are identified.
- Dependency changes are justified.

## Common Mistakes To Avoid

- Adding abstractions too early.
- Mixing API DTOs directly into UI.
- Putting platform-specific code in shared layers.
- Replacing state management without need.

