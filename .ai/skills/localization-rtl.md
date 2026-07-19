# Localization / RTL Skill

## Role

Ensure Arabic and English localization and layout direction work correctly.

## Goal

Keep text, layout, icons, formatting, and native resources ready for Arabic and English.

## When To Use

- Any visible UI text
- Language switching
- RTL layout issues
- Date/number/currency formatting
- Native permission strings
- Store release text

## Inputs Required

- Strings added/changed
- Target languages
- Screens affected
- Directional icons/layouts
- Native string files if relevant

## Process

1. Identify every visible string.
2. Add/update Arabic and English translations.
3. Use RTL-aware layout properties: start/end, `textAlign: 'auto'`, writing direction.
4. Mirror directional icons.
5. Check date, time, currency, phone, and number formatting.
6. Confirm language storage source of truth.
7. Restart app when changing forced RTL.

## Output Format

```text
Localization/RTL Review
- Strings:
- Arabic:
- English:
- RTL layout:
- Directional icons:
- Native resources:
- Restart needed:
```

## Checklist

- No unlocalized user-facing strings.
- Arabic text fits.
- English text fits.
- Layout uses start/end where needed.
- Icons mirror correctly.
- Inputs align correctly.
- Native permission strings are localized when needed.

## Common Mistakes To Avoid

- Reading language from multiple storage sources.
- Using left/right for logical layout.
- Forgetting app restart for forced RTL.
- Hardcoding English fallbacks in UI.

