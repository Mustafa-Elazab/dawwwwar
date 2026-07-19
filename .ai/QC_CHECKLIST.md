# QC Checklist

Run this after every implementation task.

## Code Quality

- Code is scoped to the task.
- Existing naming and architecture are followed.
- No large unrelated rewrites.
- No dead code or debug logs unless intentionally temporary.
- Comments explain important logic only.
- Types are safe and specific.

## Architecture Quality

- Business logic is not trapped inside UI components.
- Data flow is clear.
- API mapping and error handling are typed.
- State is predictable.
- Platform-specific logic is isolated.
- No unnecessary dependency was added.

## UI Consistency

- Matches existing app visual language.
- Uses design-system/theme tokens.
- Supports loading, success, empty, error, disabled states.
- Handles long text and small screens.
- Avoids overlapping UI.
- Uses reusable components where practical.

## Localization And RTL

- All user-facing strings are localized or intentionally static.
- Arabic and English copy fit the UI.
- RTL layout is supported.
- Directional icons are mirrored when needed.
- Text alignment uses `auto` or RTL-aware styles.
- Native localization files are updated when relevant.

## Accessibility

- Touch targets are large enough.
- Buttons have clear labels.
- Images/icons have accessible meaning or are decorative.
- Color contrast is acceptable.
- Error messages are visible and understandable.
- Focus and screen-reader order make sense.

## Permissions

- Permission requests happen at the right time.
- Denied permissions have fallback UX.
- Android manifest and iOS Info.plist are updated when needed.
- Background permissions have strong justification.
- Media/file permission behavior matches OS version requirements.

## Error Handling

- Network errors are handled.
- Validation errors are clear.
- Unknown errors do not crash the app.
- Retry paths exist where useful.
- Offline cases are considered.

## Tests And Checks

- Type-check/build/test commands were run where relevant.
- Native resource/manifest checks were run for native changes.
- API changes include contract or mock updates if needed.
- Manual QA steps are documented when automation is not available.

## Build Risks

- Native module changes are identified.
- Gradle/Xcode/project files remain valid.
- Environment variables are documented.
- Release signing/build settings are not accidentally changed.

## Release Risks

- Store permissions and privacy text are valid.
- Analytics/crash logging are safe.
- Feature flags or rollout risks are noted.
- Migration/backward compatibility is considered.

## QC Output Format

```text
QC Review
- Code quality:
- Architecture:
- UI:
- Localization/RTL:
- Accessibility:
- Permissions:
- Error/loading/empty states:
- Tests/checks:
- Build risks:
- Release risks:
- Follow-ups:
```

