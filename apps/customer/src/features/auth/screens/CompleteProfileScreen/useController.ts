import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, I18nManager, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import { useAddresses, useUpdateProfile, useUploadFile } from '@dawwar/api-client';
import { useTranslation } from '@dawwar/i18n';
import { useTheme } from '@dawwar/theme';
import type { Address, ApiResponse, User } from '@dawwar/types';
import { logout, selectUser, updateUser } from '../../../../store/slices/auth.slice';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { geocodingApi } from '../../../location/core/api/geocoding';
import { createStyles } from './styles';

interface ReactNativeFile {
  uri: string;
  name: string;
  type: string;
}

type ProfileUpdatePayload = Partial<User> & {
  email?: string;
  gender?: string;
  birthDate?: string;
  dateOfBirth?: string;
  location?: string;
};

const unwrap = <T,>(res: ApiResponse<T> | T | undefined): T | undefined =>
  res && typeof res === 'object' && 'data' in res ? res.data : (res as T | undefined);

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

async function requestAndroidLocationPermission() {
  if (Platform.OS !== 'android') return true;

  const result = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  return result === PermissionsAndroid.RESULTS.GRANTED;
}

export function useController() {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const isRTL = i18n.language.startsWith('ar') || I18nManager.isRTL;
  const styles = useMemo(() => createStyles(colors, isRTL), [colors, isRTL]);
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const updateMutation = useUpdateProfile();
  const uploadMutation = useUploadFile();
  const addressesQuery = useAddresses(user?.id);
  const addresses = unwrap<Address[]>(addressesQuery.data) ?? [];
  const defaultAddress = addresses.find((address) => address.isDefault) ?? addresses[0];

  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [location, setLocation] = useState(defaultAddress?.address ?? '');
  const [avatarUri, setAvatarUri] = useState(user?.profileImage ?? user?.avatar ?? '');
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

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

  useEffect(() => {
    if (!location && defaultAddress?.address) {
      setLocation(defaultAddress.address);
    }
  }, [defaultAddress?.address, location]);

  const profilePayload = useMemo<ProfileUpdatePayload>(() => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedLocation = location.trim();

    return {
      ...(trimmedName ? { name: trimmedName } : {}),
      ...(trimmedEmail ? { email: trimmedEmail } : {}),
      ...(birthDate ? { birthDate, dateOfBirth: birthDate } : {}),
      ...(gender ? { gender } : {}),
      ...(trimmedLocation ? { location: trimmedLocation } : {}),
      ...(avatarUri ? { profileImage: avatarUri } : {}),
    };
  }, [avatarUri, birthDate, email, gender, location, name]);

  const hasAnyProfileField = useMemo(
    () =>
      Boolean(
        name.trim() ||
          email.trim() ||
          birthDate ||
          gender ||
          location.trim() ||
          avatarUri,
      ),
    [avatarUri, birthDate, email, gender, location, name],
  );

  const saveProfile = useCallback(
    async (allowEmpty = false) => {
      if (!allowEmpty && !hasAnyProfileField) return;
      if (Object.keys(profilePayload).length === 0) return;

      try {
        const response = await updateMutation.mutateAsync(profilePayload);
        const updatedUser = unwrap<User>(response);
        const userPatch: Partial<User> = {};

        if (profilePayload.name || updatedUser?.name) {
          userPatch.name = updatedUser?.name ?? profilePayload.name;
        }
        if (profilePayload.profileImage || updatedUser?.profileImage) {
          userPatch.profileImage = updatedUser?.profileImage ?? profilePayload.profileImage;
          userPatch.avatar = updatedUser?.profileImage ?? profilePayload.profileImage;
        }

        if (Object.keys(userPatch).length > 0) {
          dispatch(updateUser(userPatch));
        }
        Toast.show({ type: 'success', text1: t('auth.profile_updated') });
      } catch {
        Toast.show({ type: 'error', text1: t('errors.server') });
      }
    },
    [dispatch, hasAnyProfileField, profilePayload, t, updateMutation],
  );

  const handlePickAvatar = useCallback(async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.8 });
    const asset = result.assets?.[0];
    if (!asset?.uri) return;

    const file: ReactNativeFile = {
      uri: asset.uri,
      name: asset.fileName ?? 'profile.jpg',
      type: asset.type ?? 'image/jpeg',
    };

    const formData = new FormData();
    formData.append('file', file as unknown as Blob);

    try {
      const uploadResponse = await uploadMutation.mutateAsync(formData);
      const uploaded = unwrap<{ url: string }>(uploadResponse);
      if (uploaded?.url) {
        setAvatarUri(uploaded.url);
      }
    } catch {
      Toast.show({ type: 'error', text1: t('errors.server') });
    }
  }, [t, uploadMutation]);

  const handleGenderPress = useCallback(() => {
    Alert.alert(t('auth.complete_profile.gender'), undefined, [
      { text: t('auth.complete_profile.gender_male'), onPress: () => setGender(t('auth.complete_profile.gender_male')) },
      { text: t('auth.complete_profile.gender_female'), onPress: () => setGender(t('auth.complete_profile.gender_female')) },
      { text: t('common.cancel'), style: 'cancel' },
    ]);
  }, [t]);

  const handleBirthDatePress = useCallback(() => {
    const parsed = parseBirthDate(birthDate);
    setDraftDay(parsed?.day ?? 1);
    setDraftMonth(parsed?.month ?? 1);
    setDraftYear(parsed?.year ?? defaultBirthYear);
    setIsDatePickerVisible(true);
  }, [birthDate, defaultBirthYear]);

  const handleDatePickerCancel = useCallback(() => {
    setIsDatePickerVisible(false);
  }, []);

  const handleDatePickerConfirm = useCallback(() => {
    const maxDay = new Date(draftYear, draftMonth, 0).getDate();
    const safeDay = Math.min(draftDay, maxDay);
    setBirthDate(formatBirthDate(safeDay, draftMonth, draftYear));
    setDraftDay(safeDay);
    setIsDatePickerVisible(false);
  }, [draftDay, draftMonth, draftYear]);

  const handleLocationPress = useCallback(async () => {
    setIsLocating(true);
    try {
      const hasPermission = await requestAndroidLocationPermission();
      if (!hasPermission) {
        Toast.show({ type: 'error', text1: t('errors.location_denied') });
        return;
      }

      const position = await new Promise<{ coords: { latitude: number; longitude: number } }>(
        (resolve, reject) => {
          Geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 60_000,
          });
        },
      );

      const resolvedAddress = await geocodingApi.reverse(
        position.coords.latitude,
        position.coords.longitude,
        i18n.language,
      );

      setLocation(
        resolvedAddress ||
          `${position.coords.latitude.toFixed(5)}, ${position.coords.longitude.toFixed(5)}`,
      );
    } catch {
      Toast.show({ type: 'error', text1: t('locationPicker.gpsError') });
    } finally {
      setIsLocating(false);
    }
  }, [i18n.language, t]);

  const handleSkip = useCallback(() => {
    void saveProfile(true);
  }, [saveProfile]);

  const handleBack = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  const isLoading = updateMutation.isPending || uploadMutation.isPending;

  return {
    colors,
    isRTL,
    styles,
    isLoading,
    isContinueDisabled: !hasAnyProfileField || isLoading,
    labels: {
      title: t('auth.complete_profile.title'),
      emailPlaceholder: t('auth.complete_profile.email_placeholder'),
      namePlaceholder: t('auth.name_placeholder'),
      birthdayPlaceholder: t('auth.complete_profile.birthday_placeholder'),
      genderPlaceholder: t('auth.complete_profile.gender'),
      locationPlaceholder: t('auth.complete_profile.location_placeholder'),
      locationLoading: t('home.location_loading'),
      continue: t('auth.continue'),
      skip: t('auth.complete_profile.skip'),
      changePhoto: t('auth.complete_profile.change_photo'),
      datePickerTitle: t('auth.complete_profile.birthday_placeholder'),
      cancel: t('common.cancel'),
      ok: t('common.ok'),
    },
    values: {
      avatarUri,
      email,
      name,
      birthDate,
      gender,
      location: isLocating ? t('home.location_loading') : location,
    },
    errors: {
      name: undefined,
    },
    handlers: {
      handleBack,
      handlePickAvatar,
      handleSave: () => void saveProfile(),
      handleSkip,
      handleEmailChange: setEmail,
      handleNameChange: (nextName: string) => {
        setName(nextName);
      },
      handleBirthDatePress,
      handleDatePickerCancel,
      handleDatePickerConfirm,
      handleDaySelect: setDraftDay,
      handleMonthSelect: setDraftMonth,
      handleYearSelect: setDraftYear,
      handleGenderPress,
      handleLocationPress,
    },
    datePicker: {
      visible: isDatePickerVisible,
      day: draftDay,
      month: draftMonth,
      year: draftYear,
      ...datePickerOptions,
    },
  };
}
