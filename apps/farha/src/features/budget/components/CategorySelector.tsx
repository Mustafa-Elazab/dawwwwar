import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { useTheme } from '@dawwar/theme';
import { AppPressable, AppText } from '@dawwar/ui';

import type { FarhaPhase1BudgetCategory } from '../../../core/planner/domain/phase1Types';
import { getCategoryName } from '../utils/categoryLabels';
import { createPhase1ScreenStyles } from '../../planner/utils/styles';

interface CategorySelectorProps {
  categories: FarhaPhase1BudgetCategory[];
  selectedCategoryId: string;
  onChange: (categoryId: string) => void;
  allowNone?: boolean;
}

export function CategorySelector({
  categories,
  selectedCategoryId,
  onChange,
  allowNone,
}: CategorySelectorProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createPhase1ScreenStyles(colors), [colors]);

  return (
    <View style={styles.stack}>
      <AppText variant="label" align="auto">{t('farha.phase1.labels.linkedCategory')}</AppText>
      <View style={styles.wrapRow}>
        {allowNone ? (
          <ChoiceChip
            label={t('farha.phase1.labels.none')}
            selected={!selectedCategoryId}
            onPress={() => onChange('')}
          />
        ) : null}
        {categories.map((category) => (
          <ChoiceChip
            key={category.id}
            label={getCategoryName(t, category)}
            selected={category.id === selectedCategoryId}
            onPress={() => onChange(category.id)}
            selectedColor={colors.primaryLight}
          />
        ))}
      </View>
    </View>
  );
}

interface ChoiceChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  selectedColor?: string;
}

function ChoiceChip({ label, selected, onPress, selectedColor }: ChoiceChipProps) {
  const { colors } = useTheme();

  return (
    <AppPressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={[
        {
          minHeight: 42,
          borderRadius: 999,
          borderWidth: 1,
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderColor: selected ? colors.primary : colors.border,
          backgroundColor: selected ? selectedColor ?? colors.primaryLight : colors.surface,
          justifyContent: 'center',
        },
      ]}
      onPress={onPress}
    >
      <AppText
        variant="caption"
        align="center"
        color={selected ? colors.primaryDark : colors.text}
        numberOfLines={2}
      >
        {label}
      </AppText>
    </AppPressable>
  );
}
