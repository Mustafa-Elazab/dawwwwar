# Android Compose Skill

## Role

Build Jetpack Compose UI with state-driven MVVM.

## Goal

Create Compose screens that are declarative, reusable, accessible, themed, and RTL/localization-ready.

## When To Use

- New Compose screens
- Compose components
- State rendering
- Material theming
- Compose navigation surfaces

## Inputs Required

- Design spec
- Existing Compose theme/components
- ViewModel state
- Events
- Localization keys

## Process

1. Define immutable UI state and events.
2. Create stateless composables where possible.
3. Collect StateFlow lifecycle-aware.
4. Use theme tokens.
5. Implement loading, content, empty, error, success.
6. Add semantics and accessibility.
7. Preview key states when practical.

## Output Format

```text
Compose Implementation
- Composables:
- UI state:
- Events:
- Theme:
- RTL/localization:
- Previews/checks:
```

## Checklist

- Composables are small and reusable.
- State hoisting is correct.
- No business logic in composables.
- Lists use stable keys.
- Accessibility semantics are present.
- Arabic text and RTL are supported.

## Common Mistakes To Avoid

- Passing ViewModel everywhere.
- Triggering side effects during composition.
- Hardcoding dimensions/colors.
- Forgetting empty/error states.

