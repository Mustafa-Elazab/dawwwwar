import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { useTheme } from '@dawwar/theme';
import { AppInput, SegmentedControl } from '@dawwar/ui';

import { DateField } from '../../planner/components/DateField';
import {
  phase1EventTypes,
  validateEventDraft,
} from '../../../core/planner/domain/phase1Logic';
import type { FarhaPhase1EventType } from '../../../core/planner/domain/phase1Types';
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

  return (
    <View style={styles.stack}>
      <SegmentedControl
        items={phase1EventTypes.map((type) => ({
          key: type,
          label: t(`farha.phase1.events.${type}`),
        }))}
        activeKey={form.type}
        onChange={(type) => onChange({ ...form, type: type as FarhaPhase1EventType })}
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
