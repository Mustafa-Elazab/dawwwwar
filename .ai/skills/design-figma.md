# Design / Figma Skill

## Role

Create Figma-ready design specs before coding UI.

## Goal

Define the exact UI hierarchy, states, reusable components, layout behavior, theme usage, and RTL/localization behavior.

## When To Use

- Any new screen
- Any UI redesign
- Any component update
- Any flow that changes user interaction
- Before implementing React Native, Android XML, Compose, SwiftUI, UIKit, or CMP UI

## Inputs Required

- User goal
- Platform
- Existing comparable screens
- Design-system tokens
- Required states
- Arabic/English copy requirements
- Light/dark theme requirements

## Process

1. Inspect existing UI patterns.
2. Define the screen goal and primary action.
3. Write the UI hierarchy from top to bottom.
4. Define components and variants.
5. Define loading, empty, error, success, disabled, permission, and offline states.
6. Define spacing, typography, colors, elevation, and iconography.
7. Define RTL mirroring and Arabic/English text behavior.
8. Define accessibility labels and touch targets.
9. Only then implement UI.

## Output Format

```text
Design Spec
- Screen:
- Goal:
- Primary action:
- Hierarchy:
- Components:
- States:
- Spacing:
- Typography:
- Colors:
- RTL/localization:
- Accessibility:
- Figma notes:
```

## Checklist

- Exact UI hierarchy is written before coding.
- Existing components are reused.
- All states are covered.
- Arabic and English layouts are considered.
- Light and dark themes are considered.
- Accessibility is included.
- No decorative UI overwhelms operational workflows.

## Common Mistakes To Avoid

- Coding UI before defining states.
- Hardcoding text and colors.
- Forgetting RTL directional icons.
- Creating one-off components when reusable components exist.
- Building a marketing-style page for an operational tool.

