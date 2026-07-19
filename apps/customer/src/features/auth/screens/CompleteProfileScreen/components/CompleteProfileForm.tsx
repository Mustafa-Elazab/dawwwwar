import React from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import { Button, Text } from '@dawwar/ui';
import type { AppColors } from '@dawwar/theme';
import type { createStyles } from '../styles';
import { ProfileAvatarPicker } from './ProfileAvatarPicker';
import { ProfileFieldRow } from './ProfileFieldRow';

interface CompleteProfileLabels {
  title: string;
  emailPlaceholder: string;
  namePlaceholder: string;
  birthdayPlaceholder: string;
  genderPlaceholder: string;
  locationPlaceholder: string;
  locationLoading: string;
  continue: string;
  skip: string;
  changePhoto: string;
  datePickerTitle: string;
  cancel: string;
  ok: string;
}

interface CompleteProfileValues {
  avatarUri?: string;
  email: string;
  name: string;
  birthDate: string;
  gender: string;
  location: string;
}

interface CompleteProfileHandlers {
  handlePickAvatar: () => void;
  handleEmailChange: (text: string) => void;
  handleNameChange: (text: string) => void;
  handleBirthDatePress: () => void;
  handleDatePickerCancel: () => void;
  handleDatePickerConfirm: () => void;
  handleDaySelect: (value: number) => void;
  handleMonthSelect: (value: number) => void;
  handleYearSelect: (value: number) => void;
  handleGenderPress: () => void;
  handleLocationPress: () => void;
}

interface DatePickerState {
  visible: boolean;
  day: number;
  month: number;
  year: number;
  days: number[];
  months: number[];
  years: number[];
}

interface CompleteProfileFormProps {
  labels: CompleteProfileLabels;
  values: CompleteProfileValues;
  errors: { name?: string };
  isRTL: boolean;
  colors: AppColors;
  styles: ReturnType<typeof createStyles>;
  handlers: CompleteProfileHandlers;
  isLoading: boolean;
  datePicker: DatePickerState;
}

interface CompleteProfileFooterProps {
  labels: Pick<CompleteProfileLabels, 'continue' | 'skip'>;
  isLoading: boolean;
  isContinueDisabled: boolean;
  styles: ReturnType<typeof createStyles>;
  onContinue: () => void;
  onSkip: () => void;
}

export function CompleteProfileForm({
  labels,
  values,
  errors,
  colors,
  styles,
  handlers,
  isLoading,
  isRTL,
  datePicker,
}: CompleteProfileFormProps) {
  return (
    <View style={styles.form}>
      <ProfileAvatarPicker
        avatarUri={values.avatarUri}
        isLoading={isLoading}
        colors={colors}
        styles={styles}
        onPress={handlers.handlePickAvatar}
      />

      <ProfileFieldRow
        value={values.email}
        placeholder={labels.emailPlaceholder}
        isRTL={isRTL}
        keyboardType="email-address"
        colors={colors}
        styles={styles}
        onChangeText={handlers.handleEmailChange}
      />

      <ProfileFieldRow
        value={values.name}
        placeholder={labels.namePlaceholder}
        isRTL={isRTL}
        error={errors.name}
        colors={colors}
        styles={styles}
        onChangeText={handlers.handleNameChange}
      />

      <ProfileFieldRow
        value={values.birthDate}
        placeholder={labels.birthdayPlaceholder}
        isRTL={isRTL}
        rightIcon="calendar-blank-outline"
        colors={colors}
        styles={styles}
        onPress={handlers.handleBirthDatePress}
      />

      <ProfileFieldRow
        value={values.gender}
        placeholder={labels.genderPlaceholder}
        isRTL={isRTL}
        rightIcon="chevron-down"
        colors={colors}
        styles={styles}
        onPress={handlers.handleGenderPress}
      />

      <ProfileFieldRow
        value={values.location}
        placeholder={labels.locationPlaceholder}
        isRTL={isRTL}
        rightIcon="map-marker-circle"
        colors={colors}
        styles={styles}
        onPress={handlers.handleLocationPress}
      />

      <DatePickerModal
        labels={labels}
        datePicker={datePicker}
        colors={colors}
        styles={styles}
        onDaySelect={handlers.handleDaySelect}
        onMonthSelect={handlers.handleMonthSelect}
        onYearSelect={handlers.handleYearSelect}
        onCancel={handlers.handleDatePickerCancel}
        onConfirm={handlers.handleDatePickerConfirm}
      />
    </View>
  );
}

interface DatePickerModalProps {
  labels: Pick<CompleteProfileLabels, 'datePickerTitle' | 'cancel' | 'ok'>;
  datePicker: DatePickerState;
  colors: AppColors;
  styles: ReturnType<typeof createStyles>;
  onDaySelect: (value: number) => void;
  onMonthSelect: (value: number) => void;
  onYearSelect: (value: number) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

function DatePickerModal({
  labels,
  datePicker,
  colors,
  styles,
  onDaySelect,
  onMonthSelect,
  onYearSelect,
  onCancel,
  onConfirm,
}: DatePickerModalProps) {
  return (
    <Modal visible={datePicker.visible} transparent animationType="fade">
      <Pressable style={styles.datePickerBackdrop} onPress={onCancel}>
        <Pressable style={styles.datePickerSheet}>
          <Text style={styles.datePickerTitle}>{labels.datePickerTitle}</Text>
          <View style={styles.datePickerColumns}>
            <DatePickerColumn
              values={datePicker.days}
              selectedValue={datePicker.day}
              colors={colors}
              styles={styles}
              onSelect={onDaySelect}
            />
            <DatePickerColumn
              values={datePicker.months}
              selectedValue={datePicker.month}
              colors={colors}
              styles={styles}
              onSelect={onMonthSelect}
            />
            <DatePickerColumn
              values={datePicker.years}
              selectedValue={datePicker.year}
              colors={colors}
              styles={styles}
              onSelect={onYearSelect}
            />
          </View>
          <View style={styles.datePickerActions}>
            <Pressable
              style={styles.datePickerAction}
              onPress={onCancel}
              accessibilityRole="button"
            >
              <Text style={styles.datePickerCancelText}>{labels.cancel}</Text>
            </Pressable>
            <Pressable
              style={[styles.datePickerAction, styles.datePickerConfirmAction]}
              onPress={onConfirm}
              accessibilityRole="button"
            >
              <Text style={styles.datePickerConfirmText}>{labels.ok}</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

interface DatePickerColumnProps {
  values: number[];
  selectedValue: number;
  colors: AppColors;
  styles: ReturnType<typeof createStyles>;
  onSelect: (value: number) => void;
}

function DatePickerColumn({
  values,
  selectedValue,
  colors,
  styles,
  onSelect,
}: DatePickerColumnProps) {
  return (
    <ScrollView style={styles.datePickerColumn} showsVerticalScrollIndicator={false}>
      {values.map((value) => {
        const selected = value === selectedValue;
        return (
          <Pressable
            key={value}
            style={[
              styles.datePickerOption,
              selected ? { backgroundColor: colors.primary } : null,
            ]}
            onPress={() => onSelect(value)}
            accessibilityRole="button"
          >
            <Text
              style={[
                styles.datePickerOptionText,
                selected ? { color: colors.primaryText } : null,
              ]}
            >
              {value}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

export function CompleteProfileFooter({
  labels,
  isLoading,
  isContinueDisabled,
  styles,
  onContinue,
  onSkip,
}: CompleteProfileFooterProps) {
  return (
    <View style={styles.footer}>
      <Button
        label={labels.continue}
        onPress={onContinue}
        loading={isLoading}
        disabled={isContinueDisabled}
        fullWidth
      />
      <Pressable onPress={onSkip} accessibilityRole="button">
        <Text style={styles.skipText}>{labels.skip}</Text>
      </Pressable>
    </View>
  );
}
