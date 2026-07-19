import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Geolocation from '@react-native-community/geolocation';
import type MapView from 'react-native-maps';
import type { Region } from 'react-native-maps';
import Toast from 'react-native-toast-message';
import { QUERY_KEYS, useApiClient, useSaveAddress } from '@dawwar/api-client';
import { useTranslation } from '@dawwar/i18n';
import type { Address } from '@dawwar/types';
import {
  geocodingApi,
  REVERSE_GEOCODE_MIN_INTERVAL_MS,
} from '../../location/core/api/geocoding';
import { useAppSelector } from '../../../store/hooks';
import { selectUser } from '../../../store/slices/auth.slice';
import { PROFILE_ROUTES } from '../../../navigation/routes';
import type { ProfileStackParamList } from '../../../navigation/types';

const DEFAULT_REGION: Region = {
  latitude: 30.0444,
  longitude: 31.2357,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

const unwrap = <T,>(res: T | { data: T }): T =>
  res && typeof res === 'object' && 'data' in res ? res.data : (res as T);

const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error !== 'object' || error === null || !('response' in error)) {
    return fallback;
  }

  const response = (error as { response?: { data?: { message?: unknown } } }).response;
  return typeof response?.data?.message === 'string'
    ? response.data.message
    : fallback;
};

export function useController() {
  const { t, i18n } = useTranslation();
  const { profile } = useApiClient();
  const navigation = useNavigation<StackNavigationProp<ProfileStackParamList>>();
  const route = useRoute<RouteProp<ProfileStackParamList, typeof PROFILE_ROUTES.ADD_ADDRESS>>();
  const queryClient = useQueryClient();
  const user = useAppSelector(selectUser);
  const mapRef = useRef<MapView | null>(null);
  const geocodeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const editId = route.params?.editId;
  const [region, setRegion] = useState<Region>(DEFAULT_REGION);
  const [address, setAddress] = useState('');
  const [labelName, setLabelName] = useState('');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [isDefault, setIsDefault] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodeError, setGeocodeError] = useState<string | null>(null);

  const { data: addressesRes, isLoading: isFetching } = useQuery({
    queryKey: QUERY_KEYS.profile.addresses(user?.id ?? ''),
    queryFn: () => profile.getAddresses(user?.id ?? ''),
    enabled: !!editId && !!user?.id,
  });

  const existingAddress = useMemo(() => {
    if (!addressesRes || !editId) return undefined;
    return unwrap<Address[]>(addressesRes).find((item) => item.id === editId);
  }, [addressesRes, editId]);

  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    setIsGeocoding(true);
    setGeocodeError(null);

    try {
      const resolvedAddress = await geocodingApi.reverse(lat, lng, i18n.language);

      if (resolvedAddress) {
        setAddress(resolvedAddress);
        return;
      }

      setAddress('');
      setGeocodeError(t('locationPicker.geocodeError'));
    } catch {
      setAddress('');
      setGeocodeError(t('locationPicker.networkError'));
    } finally {
      setIsGeocoding(false);
    }
  }, [i18n.language, t]);

  useEffect(() => {
    if (user?.phone && !phone) {
      setPhone(user.phone);
    }
  }, [phone, user?.phone]);

  useEffect(() => {
    if (!existingAddress) return;

    const nextRegion = {
      latitude: Number(existingAddress.latitude) || DEFAULT_REGION.latitude,
      longitude: Number(existingAddress.longitude) || DEFAULT_REGION.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
    setRegion(nextRegion);
    setAddress(existingAddress.address);
    setLabelName(existingAddress.label);
    setPhone(existingAddress.phone);
    setIsDefault(existingAddress.isDefault);
  }, [existingAddress]);

  useEffect(() => {
    if (editId) return;
    void reverseGeocode(DEFAULT_REGION.latitude, DEFAULT_REGION.longitude);
  }, [editId, reverseGeocode]);

  useEffect(() => () => {
    if (geocodeTimer.current) {
      clearTimeout(geocodeTimer.current);
    }
  }, []);

  const handleRegionChangeComplete = useCallback((newRegion: Region) => {
    setRegion(newRegion);
    if (geocodeTimer.current) {
      clearTimeout(geocodeTimer.current);
    }
    geocodeTimer.current = setTimeout(() => {
      void reverseGeocode(newRegion.latitude, newRegion.longitude);
    }, REVERSE_GEOCODE_MIN_INTERVAL_MS);
  }, [reverseGeocode]);

  const handleUseGPS = useCallback(() => {
    Geolocation.getCurrentPosition(
      (position) => {
        const nextRegion: Region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        };
        setRegion(nextRegion);
        mapRef.current?.animateToRegion(nextRegion, 500);
        if (geocodeTimer.current) {
          clearTimeout(geocodeTimer.current);
        }
        void reverseGeocode(nextRegion.latitude, nextRegion.longitude);
      },
      () => {
        setGeocodeError(t('locationPicker.gpsError'));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 },
    );
  }, [reverseGeocode, t]);

  const saveMutation = useSaveAddress();
  const hasValidPhone = /^01[0125]\d{8}$/.test(phone);

  const isValid = useMemo(
    () => address.trim().length > 0 && hasValidPhone && !isGeocoding && !isFetching,
    [address, hasValidPhone, isFetching, isGeocoding],
  );

  const handleSave = useCallback(() => {
    if (!isValid) {
      if (!hasValidPhone) {
        setGeocodeError(t('addresses.phone_required'));
      }
      return;
    }

    saveMutation.mutate(
      {
        id: editId,
        label: labelName.trim() || t('locationPicker.defaultLabel'),
        latitude: region.latitude,
        longitude: region.longitude,
        address,
        phone,
        isDefault,
      },
      {
        onSuccess: () => {
          void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profile.addresses(user?.id ?? '') });
          Toast.show({
            type: 'success',
            text1: editId ? t('addresses.updated') : t('addresses.saved'),
          });
          navigation.goBack();
        },
        onError: (error) => {
          setGeocodeError(getErrorMessage(error, t('common.error_body')));
        },
      },
    );
  }, [
    address,
    editId,
    hasValidPhone,
    isDefault,
    isValid,
    labelName,
    navigation,
    phone,
    queryClient,
    region.latitude,
    region.longitude,
    saveMutation,
    t,
    user?.id,
  ]);

  return {
    mapRef,
    region,
    address,
    labelName,
    isGeocoding,
    geocodeError,
    isValid,
    isSaving: saveMutation.isPending,
    isFetching,
    editId,
    handleBack: navigation.goBack,
    handleRegionChangeComplete,
    handleUseGPS,
    handleLabelChange: setLabelName,
    handleSave,
    t,
  };
}
