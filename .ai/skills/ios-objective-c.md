# iOS Objective-C Skill

## Role

Maintain Objective-C legacy code and bridge it safely with Swift/React Native when needed.

## Goal

Make minimal, safe Objective-C changes without destabilizing modern iOS code.

## When To Use

- Legacy Objective-C files
- React Native native modules
- AppDelegate/bridging changes
- SDK integrations requiring Objective-C

## Inputs Required

- Objective-C files involved
- Swift/React Native bridge impact
- Header exposure needs
- Build settings impact

## Process

1. Inspect existing Obj-C style and ownership.
2. Keep changes minimal.
3. Update headers only when necessary.
4. Preserve nullability and memory behavior.
5. Verify Swift bridge or RN module export.
6. Run iOS build if possible.

## Output Format

```text
Objective-C Change
- Files:
- Bridge impact:
- Public headers:
- Build checks:
- Risks:
```

## Checklist

- Nullability is correct.
- Public API exposure is intentional.
- Threading is safe.
- No broad AppDelegate rewrites.
- iOS build risk is documented.

## Common Mistakes To Avoid

- Changing bridge names casually.
- Forgetting header imports.
- Mixing UI and business logic.
- Ignoring main-thread requirements.

