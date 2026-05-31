# Customer Screen Architecture

Customer app screens must be small entry points that compose reusable templates, a controller hook, and dumb screen-only components.

## Template Rules

All screens in `apps/customer/src/features/**/screens/**` must render through a template exported from `packages/ui/src/templates`.

Use:

- `AppScreenTemplate` for fixed screens with header/footer slots and template-owned loading, error, and empty states.
- `ScrollScreenTemplate` for forms and detail pages that need scrolling or keyboard avoidance.
- `ListScreenTemplate` for FlatList pages, including refresh, pagination, loading, error, and empty states.
- `ModalSheetTemplate` for bottom sheet content such as delivery location selectors.
- `HeaderTemplate` when a screen needs a reusable header block with title, subtitle, actions, back handling, or a search slot.

Templates own layout concerns: safe area, status bar, background, header, footer, loading, error, empty, refresh, and keyboard behavior. Screens should not duplicate those patterns.

## Folder Structure

Every screen folder must use this shape:

```text
apps/customer/src/features/<feature>/screens/<ScreenName>/
  index.tsx
  useController.ts
  styles.ts
  components/
    <ScreenName>Header.tsx
    <ScreenName>Content.tsx
    <SmallReusablePart>.tsx
```

Single-file screens such as `PaymentMethodsScreen.tsx` are not allowed for new work. Convert them to a folder before making feature changes.

## Responsibility Rules

`index.tsx`:

- Imports `useController`.
- Chooses the correct template.
- Passes controller data and handlers to presentational components.
- Does not call APIs, selectors, storage, permissions, or navigation directly.
- Does not contain large JSX trees.

`useController.ts`:

- Calls React Query hooks, Redux selectors, storage helpers, permissions, and navigation actions.
- Derives view models with `useMemo`.
- Exposes handlers with `useCallback`.
- Returns data, UI state, labels, and handlers.

`styles.ts`:

- Exports `StyleSheet.create(...)` only.
- Uses tokens from `@dawwar/theme`.
- Does not hardcode repeated colors or spacing.

`components/*`:

- Presentational only.
- Receives props from the controller or screen entry.
- Does not call APIs, selectors, storage, permissions, or navigation.
- May keep tiny local UI state only when it is purely visual.

## Sample Screen Skeleton

```tsx
// index.tsx
import React from 'react';
import { ScrollScreenTemplate } from '@dawwar/ui';
import { ExampleContent } from './components/ExampleContent';
import { useController } from './useController';

export function ExampleScreen() {
  const controller = useController();

  return (
    <ScrollScreenTemplate
      headerProps={{ title: controller.labels.title, onBackPress: controller.handlers.goBack }}
      isLoading={controller.isLoading}
      isError={controller.isError}
      onRetry={controller.handlers.retry}
      isEmpty={controller.isEmpty}
      emptyState={controller.emptyState}
    >
      <ExampleContent
        items={controller.items}
        labels={controller.labels}
        onItemPress={controller.handlers.openItem}
      />
    </ScrollScreenTemplate>
  );
}
```

```ts
// useController.ts
import { useCallback, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from '@dawwar/i18n';

export function useController() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const items = useMemo(() => [], []);
  const goBack = useCallback(() => navigation.goBack(), [navigation]);

  return {
    items,
    isLoading: false,
    isError: false,
    isEmpty: items.length === 0,
    labels: {
      title: t('example.title'),
    },
    emptyState: {
      icon: 'inbox-outline',
      title: t('example.empty'),
    },
    handlers: {
      goBack,
      retry: () => {},
      openItem: () => {},
    },
  };
}
```

```ts
// styles.ts
import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { spacing } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    row: {
      padding: spacing[4],
      backgroundColor: colors.surface,
    },
  });
```
