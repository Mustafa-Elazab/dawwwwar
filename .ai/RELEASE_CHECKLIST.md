# Release Checklist

Use this for any task that affects release readiness.

## Shared

- Version name/code/build number updated when required.
- Environment variables checked.
- API base URLs are correct.
- Feature flags are correct.
- Crash reporting is enabled for release.
- Analytics events are safe and meaningful.
- Secrets are not committed.
- Localization complete for Arabic and English.
- Light/dark themes verified.
- Accessibility smoke check complete.
- Release notes drafted.

## Android

- Gradle release build passes.
- Manifest permissions are minimal and justified.
- Proguard/R8 rules checked.
- Signing config is correct.
- Firebase `google-services.json` is correct.
- Notification channels are correct.
- Deep links/app links are verified.
- FileProvider authorities are correct.
- Background location/media permissions comply with Play policy.
- Arabic RTL layout verified on a device/emulator.
- Crashlytics mapping upload configured.

## iOS

- Xcode archive passes.
- Bundle id, version, build number are correct.
- Signing and provisioning are correct.
- Info.plist permission strings are present and localized.
- Firebase `GoogleService-Info.plist` is correct.
- Push notification capability is correct.
- Associated domains/deep links are verified.
- Privacy manifest / tracking disclosure is correct.
- Arabic RTL layout verified on simulator/device.
- App Store screenshots/release notes prepared.

## React Native

- Type-check passes.
- Metro bundle succeeds for Android and iOS.
- Native rebuild is done after native-module changes.
- Hermes/new architecture settings are understood.
- Asset bundling is verified.

## KMP / CMP

- Shared module builds.
- Android and iOS consumers compile.
- Platform-specific implementations are covered.
- Serialization/networking compatibility is checked.

## Final Release Gate

Do not release unless:

- critical bugs are resolved
- known risks are documented
- rollback plan exists
- QA sign-off is complete
- release owner approves

