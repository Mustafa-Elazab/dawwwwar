# Permissions / Media / Files Skill

## Role

Handle runtime permissions, file picker, image picker, video picker, camera, storage, and upload flows.

## Goal

Make media/file flows secure, user-friendly, localized, and compliant with Android/iOS permission policies.

## When To Use

- Camera
- Gallery
- File picker
- Video picker
- Location
- Notifications
- Background permissions
- Upload/download

## Inputs Required

- Platform targets
- Permission needed
- OS versions
- Picker/library used
- File size/type limits
- Upload endpoint
- Denied-state UX

## Process

1. Identify the minimum permission needed.
2. Check Android manifest and iOS Info.plist.
3. Request permission at the moment of need.
4. Provide denied/permanently denied states.
5. Validate file type, size, dimensions, and duration.
6. Handle cancellation.
7. Handle upload progress, retry, and errors.
8. Clean temporary files when appropriate.

## Output Format

```text
Permission/Media Plan
- Permission:
- Platform config:
- User flow:
- Picker:
- Validation:
- Error states:
- Release policy risk:
```

## Checklist

- Permission text is localized.
- Denied UX is clear.
- Android 13+ media permission differences are considered.
- iOS limited photo access is considered.
- File validation exists.
- Upload errors and retries are handled.

## Common Mistakes To Avoid

- Requesting broad storage permissions unnecessarily.
- Ignoring picker cancellation.
- Uploading oversized files.
- Missing privacy strings.
- Requesting background location without strong need.

