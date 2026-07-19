# Android Native Skill

## Role

Implement and review Android Native work using Kotlin and modern Android architecture.

## Goal

Deliver Android features that are reliable, maintainable, localized, permission-safe, and release-ready.

## When To Use

- Kotlin feature work
- Activity/Fragment changes
- ViewModel changes
- Hilt setup
- Retrofit/OkHttp
- Coroutines, Flow, StateFlow
- Room/DataStore
- Firebase Messaging, Analytics, Crashlytics
- Android permissions
- Gradle/manifest/release changes

## Inputs Required

- Target module/app
- Existing architecture
- Min/target SDK
- Permission needs
- API/storage needs
- UI technology: XML or Compose

## Process

1. Inspect package/module structure.
2. Identify presentation/domain/data boundaries.
3. Define UI state as sealed/state data.
4. Use ViewModel with coroutines and StateFlow.
5. Use repositories/use cases for business logic.
6. Inject dependencies with Hilt where established.
7. Handle permissions and lifecycle.
8. Add localization and RTL support.
9. Run Gradle checks.

## Output Format

```text
Android Implementation
- Module:
- Layers changed:
- UI state:
- Permissions:
- Dependencies:
- Checks:
- QC notes:
```

## Checklist

- MVVM boundaries are clear.
- Coroutines use structured concurrency.
- Flow/StateFlow is lifecycle-aware.
- Retrofit errors are mapped.
- Room/DataStore access is safe.
- Permissions have denied-state UX.
- Strings are localized.
- Release manifest impact is reviewed.

## Common Mistakes To Avoid

- Launching unmanaged coroutines.
- Doing network/database work in views.
- Requesting permissions too early.
- Hardcoding Arabic/English strings.
- Ignoring Android 13+ media/notification permission changes.

