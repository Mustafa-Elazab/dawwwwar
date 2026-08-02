import React, { useMemo, useState } from 'react';
import {
  I18nManager,
  Modal,
  Pressable,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
  View,
} from 'react-native';
import { i18n, useTranslation } from '@dawwar/i18n';
import { useTheme } from '@dawwar/theme';
import { AppIcon, AppPressable, AppText } from '@dawwar/ui';
import type { AppColors } from '@dawwar/theme';
import { radius, spacing } from '@dawwar/theme';

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
  const [visible, setVisible] = useState(false);
  const [viewDate, setViewDate] = useState(() => parseIsoDate(value) ?? todayUtc());

  const selectedDate = parseIsoDate(value);
  const locale = i18n.language === 'ar' ? 'ar-EG' : 'en-US';
  const monthTitle = formatMonthTitle(viewDate, locale);
  const weekdays = useMemo(() => getWeekdays(locale), [locale]);
  const days = useMemo(() => getCalendarDays(viewDate), [viewDate]);

  const open = () => {
    setViewDate(selectedDate ?? todayUtc());
    setVisible(true);
  };

  const selectDate = (date: Date) => {
    onChange(toIsoDate(date));
    setVisible(false);
  };

  const clear = () => {
    onChange('');
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
        style={[
          styles.field,
          error ? { borderColor: colors.error } : null,
        ]}
        onPress={open}
      >
        <AppText
          variant="body1"
          color={value ? colors.text : colors.placeholder}
          align="auto"
          numberOfLines={1}
          style={styles.fieldText}
        >
          {value || placeholder || t('farha.phase1.labels.datePlaceholder')}
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

            <View style={styles.monthRow}>
              <AppPressable
                accessibilityRole="button"
                accessibilityLabel={t('farha.phase1.calendar.previousMonth')}
                style={styles.iconButton}
                onPress={() => setViewDate(addMonths(viewDate, -1))}
              >
                <AppIcon
                  name={I18nManager.isRTL ? 'chevron-right' : 'chevron-left'}
                  size={24}
                  color={colors.text}
                />
              </AppPressable>
              <AppText variant="label" align="center" style={styles.monthTitle}>
                {monthTitle}
              </AppText>
              <AppPressable
                accessibilityRole="button"
                accessibilityLabel={t('farha.phase1.calendar.nextMonth')}
                style={styles.iconButton}
                onPress={() => setViewDate(addMonths(viewDate, 1))}
              >
                <AppIcon
                  name={I18nManager.isRTL ? 'chevron-left' : 'chevron-right'}
                  size={24}
                  color={colors.text}
                />
              </AppPressable>
            </View>

            <View style={styles.weekdayRow}>
              {weekdays.map((weekday) => (
                <AppText key={weekday} variant="caption" color={colors.textSecondary} align="center" style={styles.weekday}>
                  {weekday}
                </AppText>
              ))}
            </View>

            <View style={styles.dayGrid}>
              {days.map((date, index) => {
                const key = date ? toIsoDate(date) : `empty-${index}`;
                const selected = !!date && !!selectedDate && toIsoDate(date) === toIsoDate(selectedDate);
                const today = !!date && toIsoDate(date) === toIsoDate(todayUtc());

                return (
                  <Pressable
                    key={key}
                    accessibilityRole={date ? 'button' : undefined}
                    accessibilityState={selected ? { selected: true } : undefined}
                    disabled={!date}
                    style={[
                      styles.dayButton,
                      today ? styles.todayButton : null,
                      selected ? { backgroundColor: colors.primary, borderColor: colors.primary } : null,
                    ]}
                    onPress={() => date && selectDate(date)}
                  >
                    {date ? (
                      <AppText
                        variant="label"
                        align="center"
                        color={selected ? colors.primaryText : colors.text}
                      >
                        {String(date.getUTCDate())}
                      </AppText>
                    ) : null}
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.actions}>
              {allowClear ? (
                <AppPressable accessibilityRole="button" style={styles.actionButton} onPress={clear}>
                  <AppText variant="label" color={colors.error} align="center">
                    {t('farha.phase1.calendar.clear')}
                  </AppText>
                </AppPressable>
              ) : null}
              <AppPressable accessibilityRole="button" style={styles.actionButton} onPress={() => setVisible(false)}>
                <AppText variant="label" color={colors.primary} align="center">
                  {t('farha.phase1.confirm.cancel')}
                </AppText>
              </AppPressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const todayUtc = () => {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
};

const parseIsoDate = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return undefined;
  }

  return date;
};

const toIsoDate = (date: Date) => date.toISOString().slice(0, 10);

const addMonths = (date: Date, months: number) =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, 1));

const getCalendarDays = (viewDate: Date) => {
  const year = viewDate.getUTCFullYear();
  const month = viewDate.getUTCMonth();
  const firstDay = new Date(Date.UTC(year, month, 1));
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const leadingDays = firstDay.getUTCDay();
  const days: Array<Date | undefined> = [];

  for (let index = 0; index < leadingDays; index += 1) {
    days.push(undefined);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    days.push(new Date(Date.UTC(year, month, day)));
  }

  while (days.length % 7 !== 0) {
    days.push(undefined);
  }

  return days;
};

const getWeekdays = (locale: string) => {
  const sunday = new Date(Date.UTC(2026, 7, 2));
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(sunday);
    date.setUTCDate(sunday.getUTCDate() + index);
    return new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(date);
  });
};

const formatMonthTitle = (date: Date, locale: string) =>
  new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(date);

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      gap: spacing[2],
    },
    field: {
      minHeight: 52,
      borderWidth: 1.5,
      borderColor: colors.border,
      borderRadius: radius.md,
      backgroundColor: colors.surface,
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
    monthRow: {
      flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing[3],
    },
    monthTitle: {
      flex: 1,
    },
    weekdayRow: {
      flexDirection: 'row',
      gap: spacing[1],
    },
    weekday: {
      flex: 1,
    },
    dayGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing[1],
    },
    dayButton: {
      width: '13.4%',
      minHeight: 42,
      borderRadius: radius.full,
      borderWidth: 1,
      borderColor: 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
    },
    todayButton: {
      borderColor: colors.primary,
      backgroundColor: colors.primaryLight,
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
