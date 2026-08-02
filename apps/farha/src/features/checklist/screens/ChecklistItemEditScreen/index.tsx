import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { useTheme } from '@dawwar/theme';
import { AppButton, AppInput } from '@dawwar/ui';

import { CategorySelector } from '../../../budget/components';
import { DateField, MissingEvent, ScreenFrame } from '../../../planner/components';
import { useController } from './controller';
import { createStyles } from './styles';

export function ChecklistItemEditScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const ctrl = useController();

  if (!ctrl.event) return <MissingEvent />;

  return (
    <ScreenFrame
      title={ctrl.editingItem ? t('farha.phase1.checklistForm.editTitle') : t('farha.phase1.checklistForm.addTitle')}
      showBack
    >
      <View style={styles.stack}>
        <AppInput
          label={t('farha.phase1.labels.taskTitle')}
          value={ctrl.form.title}
          onChangeText={(title) => ctrl.setForm((current) => ({ ...current, title }))}
          error={ctrl.submitted && ctrl.validation.errors.title ? t('farha.phase1.validation.required') : undefined}
        />
        <DateField
          label={t('farha.phase1.labels.dueDate')}
          placeholder={t('farha.phase1.labels.datePlaceholder')}
          value={ctrl.form.dueDate}
          onChange={(dueDate) => ctrl.setForm((current) => ({ ...current, dueDate }))}
          error={ctrl.submitted && ctrl.validation.errors.dueDate ? t('farha.phase1.validation.invalidDate') : undefined}
          allowClear
        />
        <CategorySelector
          categories={ctrl.categories}
          selectedCategoryId={ctrl.form.categoryId}
          onChange={(categoryId) => ctrl.setForm((current) => ({ ...current, categoryId }))}
          allowNone
        />
        <AppInput
          label={t('farha.phase1.labels.notes')}
          value={ctrl.form.notes}
          onChangeText={(notes) => ctrl.setForm((current) => ({ ...current, notes }))}
          multiline
          numberOfLines={3}
        />
      </View>
      <AppButton label={t('farha.phase1.actions.save')} onPress={ctrl.save} fullWidth />
      {ctrl.editingItem ? (
        <>
          <View style={styles.wrapRow}>
            <AppButton
              label={t('farha.phase1.checklist.markDone')}
              size="sm"
              onPress={ctrl.markDone}
            />
            <AppButton
              label={t('farha.phase1.checklist.markSkipped')}
              size="sm"
              variant="outline"
              onPress={ctrl.markSkipped}
            />
          </View>
          <AppButton
            label={t('farha.phase1.actions.deleteTask')}
            variant="danger"
            onPress={ctrl.deleteTask}
            fullWidth
          />
        </>
      ) : null}
    </ScreenFrame>
  );
}
