import React, { useMemo, useState } from 'react';
import {
  I18nManager,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import DateTimePicker, {
  DateTimePickerAndroid,
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { i18n, useTranslation } from '@dawwar/i18n';
import { useTheme } from '@dawwar/theme';
import type { AppColors } from '@dawwar/theme';
import { radius, spacing } from '@dawwar/theme';
import { AppIcon, AppPressable, AppText } from '@dawwar/ui';

interface DateFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  allowClear?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  testID?: string;
}

export function DateField({
  label,
  value,
  onChange,
  placeholder,
  error,
  allowClear,
  containerStyle,
  testID,
}: DateFieldProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const selectedDate = parseIsoDate(value);
  const [visible, setVisible] = useState(false);
  const [iosDraftDate, setIosDraftDate] = useState(() => selectedDate ?? today());
  const locale = i18n.language === 'ar' ? 'ar-EG' : 'en-US';
  const displayValue = selectedDate ? formatSelectedDate(selectedDate, locale) : '';

  const open = () => {
    const pickerDate = selectedDate ?? today();
    setIosDraftDate(pickerDate);

    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: pickerDate,
        mode: 'date',
        display: 'default',
        onChange: (_event: DateTimePickerEvent, date?: Date) => {
          if (date) onChange(toIsoDate(date));
        },
      });
      return;
    }

    setVisible(true);
  };

  const clear = () => {
    onChange('');
    setVisible(false);
  };

  const confirmIosDate = () => {
    onChange(toIsoDate(iosDraftDate));
    setVisible(false);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <AppText variant="label" align="auto">
        {label}
      </AppText>
      <AppPressable
        accessibilityRole="button"
        accessibilityLabel={t('farha.phase1.calendar.open')}
        testID={testID}
        style={[styles.field, error ? { borderColor: colors.error } : null]}
        onPress={open}
      >
        <AppText
          variant="body1"
          color={value ? colors.text : colors.placeholder}
          align="auto"
          numberOfLines={1}
          style={styles.fieldText}
        >
          {displayValue || placeholder || t('farha.phase1.labels.datePlaceholder')}
        </AppText>
        <AppIcon name="calendar-month-outline" size={22} color={colors.icon} />
      </AppPressable>
      {!!error && (
        <AppText variant="caption" color={colors.error} align="auto">
          {error}
        </AppText>
      )}

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <Pressable style={styles.backdrop} onPress={() => setVisible(false)}>
          <Pressable style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <AppText variant="h4" align="auto">
                {t('farha.phase1.calendar.title')}
              </AppText>
              <AppPressable
                accessibilityRole="button"
                accessibilityLabel={t('farha.phase1.confirm.cancel')}
                style={styles.iconButton}
                onPress={() => setVisible(false)}
              >
                <AppIcon name="close" size={22} color={colors.text} />
              </AppPressable>
            </View>

            <DateTimePicker
              value={iosDraftDate}
              mode="date"
              display="spinner"
              locale={locale}
              onChange={(_event, date) => {
                if (date) setIosDraftDate(date);
              }}
            />

            <View style={styles.actions}>
              {allowClear ? (
                <AppPressable accessibilityRole="button" style={styles.actionButton} onPress={clear}>
                  <AppText variant="label" color={colors.error} align="center">
                    {t('farha.phase1.calendar.clear')}
                  </AppText>
                </AppPressable>
              ) : null}
              <AppPressable
                accessibilityRole="button"
                style={styles.actionButton}
                onPress={() => setVisible(false)}
              >
                <AppText variant="label" color={colors.primary} align="center">
                  {t('farha.phase1.confirm.cancel')}
                </AppText>
              </AppPressable>
              <AppPressable accessibilityRole="button" style={styles.actionButton} onPress={confirmIosDate}>
                <AppText variant="label" color={colors.primary} align="center">
                  {t('farha.phase1.confirm.ok')}
                </AppText>
              </AppPressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const today = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

const parseIsoDate = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return undefined;
  }

  return date;
};

const toIsoDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatSelectedDate = (date: Date, locale: string) =>
  new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {},
    field: {
      minHeight: 52,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      borderRadius: radius.lg,
      backgroundColor: colors.card,
      paddingHorizontal: spacing[4],
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[3],
    },
    fieldText: {
      flex: 1,
    },
    backdrop: {
      flex: 1,
      backgroundColor: colors.overlay,
      justifyContent: 'flex-end',
    },
    sheet: {
      borderTopLeftRadius: radius.xl,
      borderTopRightRadius: radius.xl,
      backgroundColor: colors.card,
      paddingHorizontal: spacing[4],
      paddingTop: spacing[5],
      paddingBottom: spacing[6],
      gap: spacing[4],
    },
    sheetHeader: {
      flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing[3],
    },
    iconButton: {
      width: 44,
      height: 44,
      borderRadius: radius.full,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surfaceVariant,
    },
    actions: {
      minHeight: 44,
      flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
      justifyContent: 'flex-end',
      gap: spacing[2],
    },
    actionButton: {
      minHeight: 44,
      minWidth: 88,
      borderRadius: radius.full,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing[4],
    },
  });
