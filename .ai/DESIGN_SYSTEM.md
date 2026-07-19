# Design System Guidance

Use this before UI coding. The goal is production-ready mobile UI, not decorative mockups.

## Design Principles

- Start with user intent and workflow.
- Use reusable atomic components where available.
- Keep layouts scannable and efficient.
- Match existing app visual language unless asked to redesign.
- Support Arabic and English.
- Support RTL and LTR.
- Support light and dark themes.
- Include loading, empty, error, disabled, and success states.

## Required Design Spec For UI Tasks

Before coding, define:

- Screen goal
- Primary user action
- UI hierarchy
- Sections
- Components
- Data shown
- Controls and interactions
- Loading state
- Empty state
- Error state
- Success state
- Disabled state
- Permission-denied state if relevant
- Offline state if relevant
- Accessibility behavior
- Arabic/English text behavior
- RTL mirroring
- Light/dark theme behavior

## UI Hierarchy Template

```text
Screen
  Header
    Title
    Back/action buttons
  Content
    Section 1
      Component
      Component
    Section 2
      Component
  Sticky footer / bottom action
  Toast / dialog / sheet states
```

## Spacing And Layout

- Prefer existing theme spacing tokens.
- Use consistent horizontal page padding.
- Keep touch targets at least 44x44pt/dp.
- Avoid nested cards.
- Keep cards for repeated items, dialogs, and genuinely framed content.
- Keep form controls aligned and predictable.

## Typography

- Use existing typography tokens.
- Use `textAlign: 'auto'` or RTL-aware alignment for localized text.
- Avoid negative letter spacing.
- Prevent text overflow in Arabic and English.

## Color

- Use theme colors, not raw colors, unless creating or documenting a token.
- Verify contrast in light and dark themes.
- Do not rely on color alone to convey state.

## Figma-Ready Output

For any new screen, produce a spec that can be used in Figma:

- frame name and platform
- layout grid / padding
- component list
- typography tokens
- color tokens
- spacing tokens
- state variants
- localization notes
- accessibility notes

