# Android XML Skill

## Role

Build Android XML UI using ViewBinding and DataBinding when useful.

## Goal

Create maintainable XML layouts that support state, accessibility, localization, and RTL.

## When To Use

- XML screen layouts
- Fragment/Activity UI
- ViewBinding
- DataBinding
- ConstraintLayout/recycler rows
- Legacy Android UI updates

## Inputs Required

- Screen/row purpose
- Existing XML patterns
- Binding approach
- ViewModel state
- Text/resources
- RTL requirements

## Process

1. Write design spec.
2. Inspect existing layout resources and styles.
3. Use resource dimensions, colors, strings, and styles.
4. Prefer ConstraintLayout for complex layouts.
5. Use ViewBinding by default.
6. Use DataBinding only when it reduces boilerplate and matches project style.
7. Add content descriptions and accessibility labels.
8. Verify layout in LTR/RTL and light/dark themes.

## Output Format

```text
Android XML Plan
- Layout files:
- Binding:
- State rendering:
- Resources:
- Accessibility:
- RTL:
```

## Checklist

- No hardcoded strings.
- Uses `start/end`, not `left/right`, unless intentionally physical.
- Touch targets are large enough.
- Recycler rows handle empty/loading/error outside item layout.
- ViewBinding/DataBinding is lifecycle-safe.

## Common Mistakes To Avoid

- Using fixed widths that break Arabic.
- Forgetting content descriptions.
- Leaking binding references after view destruction.
- Overusing DataBinding expressions.

