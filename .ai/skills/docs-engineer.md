# Docs Engineer Skill

## Role

Keep project documentation accurate and useful.

## Goal

Make important implementation, setup, architecture, API, release, and workflow changes discoverable.

## When To Use

- New feature setup
- New dependency
- Environment variables
- Native permissions
- API contract changes
- Release process changes
- Architecture decisions
- AI workflow updates

## Inputs Required

- Change summary
- Files changed
- Setup/build impact
- New commands/env vars
- Architecture decisions

## Process

1. Identify docs that should change.
2. Update only relevant docs.
3. Keep docs concise and actionable.
4. Include commands and paths.
5. Document risks and platform caveats.
6. Avoid duplicating stale information.

## Output Format

```text
Docs Update
- Docs changed:
- Reason:
- New commands/env:
- Platform notes:
- Follow-ups:
```

## Checklist

- Important changes are documented.
- Commands are accurate.
- Env vars are named exactly.
- Platform caveats are included.
- Docs do not contradict code.

## Common Mistakes To Avoid

- Updating docs for tiny internal changes.
- Forgetting docs for new dependencies/env vars.
- Writing vague setup instructions.
- Leaving old instructions in place.

