import React, { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUpdateProfile } from '@dawwar/api-client';
import { useTranslation } from '@dawwar/i18n';
import { useTheme, radius, space } from '@dawwar/theme';
import { Button, Input, ScrollScreenTemplate, Text } from '@dawwar/ui';
import type { User } from '@dawwar/types';
import Toast from 'react-native-toast-message';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { selectUser, updateUser } from '../../../store/slices/auth.slice';

type EditableProfileUser = User & {
  email?: string;
  gender?: string;
  birthDate?: string;
  dateOfBirth?: string;
};

type ProfileUpdatePayload = Partial<User> & {
  email?: string;
  gender?: string;
  birthDate?: string;
  dateOfBirth?: string;
};

function pad2(value: number) {
  return String(value).padStart(2, '0');
}

function formatBirthDate(day: number, month: number, year: number) {
  return `${pad2(day)}/${pad2(month)}/${year}`;
}

function parseBirthDate(value: string) {
  const [day, month, year] = value.split('/').map(Number);
  if (!day || !month || !year) return null;
  return { day, month, year };
}

const unwrap = <T,>(res: T | { data: T } | undefined): T | undefined =>
  res && typeof res === 'object' && 'data' in res ? res.data : (res as T | undefined);

export function EditProfileScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser) as EditableProfileUser | null;
  const updateMutation = useUpdateProfile();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [gender, setGender] = useState(user?.gender ?? '');
  const [birthDate, setBirthDate] = useState(user?.birthDate ?? user?.dateOfBirth ?? '');
  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);

  const defaultBirthYear = new Date().getFullYear() - 18;
  const parsedBirthDate = parseBirthDate(birthDate);
  const [draftDay, setDraftDay] = useState(parsedBirthDate?.day ?? 1);
  const [draftMonth, setDraftMonth] = useState(parsedBirthDate?.month ?? 1);
  const [draftYear, setDraftYear] = useState(parsedBirthDate?.year ?? defaultBirthYear);

  const datePickerOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return {
      days: Array.from({ length: 31 }, (_, index) => index + 1),
      months: Array.from({ length: 12 }, (_, index) => index + 1),
      years: Array.from({ length: 100 }, (_, index) => currentYear - index),
    };
  }, []);

  const payload = useMemo<ProfileUpdatePayload>(() => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    return {
      ...(trimmedName ? { name: trimmedName } : {}),
      ...(trimmedEmail ? { email: trimmedEmail } : {}),
      ...(gender ? { gender } : {}),
      ...(birthDate ? { birthDate, dateOfBirth: birthDate } : {}),
    };
  }, [birthDate, email, gender, name]);

  const hasAnyField = Object.keys(payload).length > 0;

  const handleBirthDatePress = () => {
    const parsed = parseBirthDate(birthDate);
    setDraftDay(parsed?.day ?? 1);
    setDraftMonth(parsed?.month ?? 1);
    setDraftYear(parsed?.year ?? defaultBirthYear);
    setIsDateOpen(true);
  };

  const handleDateConfirm = () => {
    const maxDay = new Date(draftYear, draftMonth, 0).getDate();
    const safeDay = Math.min(draftDay, maxDay);
    setBirthDate(formatBirthDate(safeDay, draftMonth, draftYear));
    setDraftDay(safeDay);
    setIsDateOpen(false);
  };

  const handleSave = () => {
    if (!hasAnyField) return;

    updateMutation.mutate(payload, {
      onSuccess: (response) => {
        const updatedUser = unwrap<User>(response);
        if (payload.name || updatedUser?.name) {
          dispatch(updateUser({ name: updatedUser?.name ?? payload.name }));
        }
        Toast.show({ type: 'success', text1: t('auth.profile_updated') });
        navigation.goBack();
      },
      onError: () => Toast.show({ type: 'error', text1: t('errors.server') }),
    });
  };

  return (
    <ScrollScreenTemplate
      headerProps={{ title: t('profile.edit_profile') }}
      footer={
        <Button
          label={t('common.save')}
          onPress={handleSave}
          loading={updateMutation.isPending}
          disabled={!hasAnyField || updateMutation.isPending}
          size="md"
          style={styles.footerButton}
        />
      }
    >
      <View style={styles.form}>
        <Input
          label={t('auth.name_label')}
          value={name}
          onChangeText={setName}
          placeholder={t('auth.name_placeholder')}
        />
        <Input
          label={t('auth.complete_profile.email_label')}
          value={email}
          onChangeText={setEmail}
          placeholder={t('auth.complete_profile.email_placeholder')}
          keyboardType="email-address"
        />
        <Pressable onPress={() => setIsGenderOpen(true)} accessibilityRole="button">
          <View pointerEvents="none">
            <Input
              label={t('auth.complete_profile.gender')}
              value={gender}
              placeholder={t('auth.complete_profile.gender')}
              editable={false}
            />
          </View>
        </Pressable>
        <Pressable onPress={handleBirthDatePress} accessibilityRole="button">
          <View pointerEvents="none">
            <Input
              label={t('auth.complete_profile.date_of_birth')}
              value={birthDate}
              placeholder={t('auth.complete_profile.birthday_placeholder')}
              editable={false}
            />
          </View>
        </Pressable>
      </View>

      <PickerModal visible={isGenderOpen} onClose={() => setIsGenderOpen(false)}>
        {[
          t('auth.complete_profile.gender_male'),
          t('auth.complete_profile.gender_female'),
        ].map((option) => (
          <Pressable
            key={option}
            style={styles.modalOption}
            onPress={() => {
              setGender(option);
              setIsGenderOpen(false);
            }}
            accessibilityRole="button"
          >
            <Text style={styles.modalOptionText}>{option}</Text>
          </Pressable>
        ))}
      </PickerModal>

      <PickerModal visible={isDateOpen} onClose={() => setIsDateOpen(false)}>
        <Text style={styles.modalTitle}>{t('auth.complete_profile.date_of_birth')}</Text>
        <View style={styles.dateColumns}>
          <DateColumn values={datePickerOptions.days} selected={draftDay} onSelect={setDraftDay} />
          <DateColumn
            values={datePickerOptions.months}
            selected={draftMonth}
            onSelect={setDraftMonth}
          />
          <DateColumn values={datePickerOptions.years} selected={draftYear} onSelect={setDraftYear} />
        </View>
        <View style={styles.modalActions}>
          <Button
            label={t('common.cancel')}
            variant="ghost"
            onPress={() => setIsDateOpen(false)}
            style={styles.modalAction}
          />
          <Button
            label={t('common.ok')}
            onPress={handleDateConfirm}
            style={styles.modalAction}
          />
        </View>
      </PickerModal>
    </ScrollScreenTemplate>
  );
}

function PickerModal({
  visible,
  children,
  onClose,
}: {
  visible: boolean;
  children: React.ReactNode;
  onClose: () => void;
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        <Pressable style={styles.modalSheet}>{children}</Pressable>
      </Pressable>
    </Modal>
  );
}

function DateColumn({
  values,
  selected,
  onSelect,
}: {
  values: number[];
  selected: number;
  onSelect: (value: number) => void;
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <ScrollView style={styles.dateColumn} showsVerticalScrollIndicator={false}>
      {values.map((value) => (
        <Pressable
          key={value}
          style={[styles.dateOption, value === selected ? styles.dateOptionSelected : null]}
          onPress={() => onSelect(value)}
          accessibilityRole="button"
        >
          <Text
            style={[
              styles.dateOptionText,
              value === selected ? styles.dateOptionTextSelected : null,
            ]}
          >
            {value}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    form: {
      gap: space.md,
      padding: space.base,
    },
    footerButton: {
      marginHorizontal: space.md,
    },
    modalBackdrop: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0,0,0,0.45)',
    },
    modalSheet: {
      gap: space.md,
      padding: space.lg,
      paddingBottom: space.xl,
      borderTopStartRadius: radius.xl,
      borderTopEndRadius: radius.xl,
      backgroundColor: colors.background,
    },
    modalTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: '800',
      textAlign: 'center',
    },
    modalOption: {
      minHeight: 52,
      justifyContent: 'center',
      borderRadius: radius.md,
      backgroundColor: colors.surface,
      paddingHorizontal: space.md,
    },
    modalOptionText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '700',
      textAlign: 'auto',
    },
    dateColumns: {
      flexDirection: 'row',
      gap: space.sm,
      height: 210,
    },
    dateColumn: {
      flex: 1,
    },
    dateOption: {
      minHeight: 44,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radius.md,
    },
    dateOptionSelected: {
      backgroundColor: colors.primary,
    },
    dateOptionText: {
      color: colors.text,
      fontWeight: '700',
    },
    dateOptionTextSelected: {
      color: colors.primaryText,
    },
    modalActions: {
      flexDirection: 'row',
      gap: space.md,
    },
    modalAction: {
      flex: 1,
    },
  });
