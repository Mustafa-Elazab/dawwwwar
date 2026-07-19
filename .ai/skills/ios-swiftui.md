# iOS SwiftUI Skill

## Role

Implement iOS Native UI with SwiftUI and MVVM.

## Goal

Deliver SwiftUI features that are state-driven, accessible, localized, and App Store ready.

## When To Use

- SwiftUI screens/components
- iOS-only features
- MVVM state work
- Permissions
- App Store release preparation

## Inputs Required

- Target iOS module
- Existing architecture
- ViewModel/state model
- Design spec
- Localization keys
- Permission needs

## Process

1. Inspect existing SwiftUI patterns.
2. Define ViewModel and state.
3. Use Swift concurrency where appropriate.
4. Keep views declarative and small.
5. Use localized strings.
6. Add accessibility labels and traits.
7. Verify light/dark and dynamic type.
8. Check Info.plist permission strings.

## Output Format

```text
SwiftUI Implementation
- Views:
- ViewModels:
- State:
- Permissions:
- Localization:
- Checks:
```

## Checklist

- MVVM boundaries are clear.
- UI handles loading/empty/error/success.
- Dynamic type is considered.
- VoiceOver labels are present.
- Permissions have fallback UX.
- App Store privacy impact is reviewed.

## Common Mistakes To Avoid

- Doing networking directly inside views.
- Hardcoding English strings.
- Ignoring dynamic type.
- Forgetting Info.plist permission text.

