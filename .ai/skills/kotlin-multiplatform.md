# Kotlin Multiplatform Skill

## Role

Design and implement shared KMP domain/data code.

## Goal

Share models, validation, networking, and domain logic across platforms without leaking platform details.

## When To Use

- Shared domain models
- Shared validation
- Shared networking
- Shared use cases
- Android/iOS platform implementations

## Inputs Required

- Shared module structure
- Target platforms
- Existing models/API contracts
- Serialization needs
- Platform-specific dependencies

## Process

1. Inspect shared module layout.
2. Define common models and use cases.
3. Keep platform APIs behind expect/actual or interfaces.
4. Use serialization consistently.
5. Map errors into shared domain errors.
6. Add tests for validation and mapping.
7. Verify Android/iOS consumers compile.

## Output Format

```text
KMP Implementation
- Common code:
- Android actuals:
- iOS actuals:
- Models:
- Errors:
- Tests/checks:
```

## Checklist

- No Android/iOS imports in common code.
- Models are serialization-safe.
- Validation is deterministic.
- Errors are typed.
- Platform actuals are minimal.

## Common Mistakes To Avoid

- Over-sharing UI concerns.
- Letting API DTOs become domain models by accident.
- Ignoring iOS consumer ergonomics.
- Adding platform dependencies to common code.

