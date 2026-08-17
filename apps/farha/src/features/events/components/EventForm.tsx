import React, { useMemo } from 'react';
import { FlatList, View } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { useTheme } from '@dawwar/theme';
import { AppInput, AppPressable, AppText, SectionHeader } from '@dawwar/ui';

import { DateField } from '../../planner/components/DateField';
import {
  phase1EventTypes,
  phase1TaskCategories,
  parseCurrencyInput,
  validateEventDraft,
} from '../../../core/planner/domain/phase1Logic';
import type {
  FarhaPhase1EventType,
  FarhaPhase1TaskCategoryKey,
} from '../../../core/planner/domain/phase1Types';
import { createPhase1ScreenStyles } from '../../planner/utils/styles';
import type { EventFormState } from '../utils/eventForm';

interface EventFormProps {
  form: EventFormState;
  submitted: boolean;
  onChange: (form: EventFormState) => void;
}

export function EventForm({ form, submitted, onChange }: EventFormProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createPhase1ScreenStyles(colors), [colors]);
  const validation = validateEventDraft({ ...form });
  const parseFormCurrency = (value: string) => {
    const parsed = parseCurrencyInput(value);
    return typeof parsed === 'number' && Number.isFinite(parsed) ? parsed : 0;
  };
  const toggleCategory = (category: FarhaPhase1TaskCategoryKey) => {
    const categoryKeys = form.categoryKeys.includes(category)
      ? form.categoryKeys.filter((key) => key !== category)
      : [...form.categoryKeys, category];
    onChange({ ...form, categoryKeys });
  };

  return (
    <View style={styles.stack}>
      <View style={styles.stack}>
        <SectionHeader title={t('farha.phase1.eventCreate.typeLabel')} />
        <FlatList
          horizontal
          data={phase1EventTypes}
          keyExtractor={(type) => type}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.wrapRow}
          renderItem={({ item }) => (
            <AppPressable
              accessibilityRole="button"
              accessibilityState={{ selected: form.type === item }}
              onPress={() => onChange({ ...form, type: item as FarhaPhase1EventType })}
              style={[
                styles.choiceChip,
                {
                  backgroundColor: form.type === item ? colors.primary : colors.card,
                  borderColor: form.type === item ? colors.primary : colors.border,
                },
              ]}
            >
              <AppText
                variant="label"
                color={form.type === item ? colors.primaryText : colors.text}
                align="center"
                numberOfLines={1}
              >
                {t(`farha.phase1.events.${item}`)}
              </AppText>
            </AppPressable>
          )}
        />
      </View>
      <View style={styles.stack}>
        <SectionHeader title={t('farha.phase1.eventCreate.categoriesLabel')} />
        <View style={styles.wrapRow}>
          {phase1TaskCategories.map((category) => {
            const selected = form.categoryKeys.includes(category);
            return (
              <AppPressable
                key={category}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => toggleCategory(category)}
                style={[
                  styles.choiceChip,
                  {
                    backgroundColor: selected ? colors.primaryLight : colors.card,
                    borderColor: selected ? colors.primary : colors.border,
                  },
                ]}
              >
                <AppText
                  variant="caption"
                  color={selected ? colors.primaryDark : colors.text}
                  align="center"
                  numberOfLines={2}
                >
                  {t(`farha.phase1.categories.${category}`)}
                </AppText>
              </AppPressable>
            );
          })}
        </View>
      </View>
      <View style={styles.formGrid}>
        <AppInput
          containerStyle={styles.gridItem}
          label={t('farha.phase1.labels.budgetSpent')}
          keyboardType="numeric"
          value={form.budgetSpent ? String(form.budgetSpent) : ''}
          onChangeText={(value) => onChange({ ...form, budgetSpent: parseFormCurrency(value) })}
          error={submitted && validation.errors.budgetSpent ? t('farha.phase1.validation.invalidAmount') : undefined}
        />
        <AppInput
          containerStyle={styles.gridItem}
          label={t('farha.phase1.labels.budgetAvailable')}
          keyboardType="numeric"
          value={form.budgetAvailable ? String(form.budgetAvailable) : ''}
          onChangeText={(value) => onChange({ ...form, budgetAvailable: parseFormCurrency(value) })}
          error={submitted && validation.errors.budgetAvailable ? t('farha.phase1.validation.invalidAmount') : undefined}
        />
      </View>
      <AppInput
        label={t('farha.phase1.labels.budgetTarget')}
        keyboardType="numeric"
        value={form.budgetTarget ? String(form.budgetTarget) : ''}
        onChangeText={(value) => onChange({ ...form, budgetTarget: parseFormCurrency(value) })}
        error={submitted && validation.errors.budgetTarget ? t('farha.phase1.validation.invalidAmount') : undefined}
      />
      <AppInput
        label={t('farha.phase1.labels.eventTitle')}
        placeholder={t('farha.phase1.eventCreate.titlePlaceholder')}
        value={form.title}
        onChangeText={(title) => onChange({ ...form, title })}
        error={submitted && validation.errors.title ? t('farha.phase1.validation.required') : undefined}
      />
      <DateField
        label={t('farha.phase1.labels.eventDate')}
        placeholder={t('farha.phase1.labels.datePlaceholder')}
        value={form.date}
        onChange={(date) => onChange({ ...form, date })}
        error={submitted && validation.errors.date ? t('farha.phase1.validation.invalidDate') : undefined}
      />
    </View>
  );
}
