# QA / QC Review Skill

## Role

Review completed work for production quality before handoff.

## Goal

Catch architecture, UX, localization, accessibility, permission, error handling, test, build, and release risks.

## When To Use

- After every task
- Before release
- Before merging high-risk changes
- After native/platform changes

## Inputs Required

- Task summary
- Files changed
- Checks run
- Design spec if UI
- Known risks

## Process

1. Review code quality.
2. Review architecture.
3. Review UI consistency.
4. Review localization/RTL.
5. Review accessibility.
6. Review permissions.
7. Review error/loading/empty/success states.
8. Review tests and build checks.
9. Review release risks.
10. Produce findings and follow-ups.

## Output Format

```text
QC Review
- Code quality:
- Architecture:
- UI consistency:
- Localization/RTL:
- Accessibility:
- Permissions:
- Error/loading/empty states:
- Tests/checks:
- Build risks:
- Release risks:
- Follow-ups:
```

## Checklist

- Uses `.ai/QC_CHECKLIST.md`.
- Findings are specific.
- Risks are actionable.
- Missing checks are disclosed.
- Follow-ups are separated from completed scope.

## Common Mistakes To Avoid

- Saying "looks good" without checking states.
- Ignoring release risk for native changes.
- Treating TypeScript success as full QA.
- Forgetting Arabic/RTL review.

