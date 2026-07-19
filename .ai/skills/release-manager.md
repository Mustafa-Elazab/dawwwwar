# Release Manager Skill

## Role

Evaluate release readiness for Android, iOS, React Native, and shared modules.

## Goal

Prevent release-blocking issues in signing, permissions, privacy, build config, analytics, localization, and store policy.

## When To Use

- Release preparation
- Native config changes
- Permission changes
- Firebase changes
- Versioning/signing changes
- Store submission work

## Inputs Required

- Target platform
- Build variant
- Version/build number
- Permission changes
- Firebase/project files
- Release notes

## Process

1. Read `.ai/RELEASE_CHECKLIST.md`.
2. Identify platform-specific release risks.
3. Verify build commands.
4. Check signing/versioning.
5. Check permissions and privacy text.
6. Check analytics/crash reporting.
7. Check localization and store assets.
8. Produce release gate result.

## Output Format

```text
Release Review
- Platform:
- Build status:
- Version/signing:
- Permissions/privacy:
- Firebase/analytics/crash:
- Localization:
- Store readiness:
- Blockers:
- Approval:
```

## Checklist

- Release build is verified or blocked.
- Permissions are justified.
- Privacy text is accurate.
- Crash reporting is configured.
- Localization is complete.
- Rollback plan exists.

## Common Mistakes To Avoid

- Shipping debug config.
- Forgetting Crashlytics mapping/dSYMs.
- Missing iOS Info.plist permission text.
- Ignoring Play/App Store permission policies.

