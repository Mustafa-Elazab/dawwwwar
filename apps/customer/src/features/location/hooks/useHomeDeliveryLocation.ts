import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { useTranslation } from '@dawwar/i18n';
import { useAddresses } from '@dawwar/api-client';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { selectUser } from '../../../store/slices/auth.slice';
import {
  fetchReverseGeocode,
  selectLocation,
  setLocation,
  setLoading,
  setSelectedAddressId,
} from '../../../store/slices/location.slice';
import type { Address } from '@dawwar/types';

const CAIRO_FALLBACK = { lat: 30.0444, lng: 31.2357 };

/**
 * Home-only delivery location: backend addresses, GPS fallback, permission prompt (Android),
 * reverse geocode via Redux thunk. Does not request permission from other screens.
 */
export function useHomeDeliveryLocation() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const { latitude, longitude, currentAddress, selectedAddressId, isLoading } =
    useAppSelector(selectLocation);

  const { data: addressesRes, isFetching: addressesFetching } = useAddresses(user?.id);
  const addresses = addressesRes?.data ?? [];

  const [gpsPermissionDenied, setGpsPermissionDenied] = useState(false);
  const [androidFineGranted, setAndroidFineGranted] = useState<boolean | null>(
    Platform.OS !== 'android' ? true : null,
  );

  const gpsBootstrapAttempted = useRef(false);
  const androidPermissionRequested = useRef(false);

  useEffect(() => {
    gpsBootstrapAttempted.current = false;
  }, [user?.id]);

  /** Request location permission once when Home loads (Android explicit dialog). */
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    if (androidPermissionRequested.current) return;
    androidPermissionRequested.current = true;

    let cancelled = false;
    void (async () => {
      try {
        const already = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (cancelled) return;
        if (already) {
          setAndroidFineGranted(true);
          return;
        }
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (cancelled) return;
        const granted = result === PermissionsAndroid.RESULTS.GRANTED;
        setAndroidFineGranted(granted);
        if (!granted) setGpsPermissionDenied(true);
      } catch {
        if (!cancelled) {
          setAndroidFineGranted(false);
          setGpsPermissionDenied(true);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const applyAddress = useCallback(
    (a: Address) => {
      dispatch(
        setLocation({
          lat: Number(a.latitude) || CAIRO_FALLBACK.lat,
          lng: Number(a.longitude) || CAIRO_FALLBACK.lng,
          address: a.address,
        }),
      );
      dispatch(setSelectedAddressId(a.id));
    },
    [dispatch],
  );

  /** Sync saved selection / default address from backend when logged in. */
  useEffect(() => {
    if (!user?.id) return;
    if (addressesFetching) return;

    if (selectedAddressId) {
      const match = addresses.find((a) => a.id === selectedAddressId);
      if (match) {
        dispatch(
          setLocation({
            lat: Number(match.latitude) || CAIRO_FALLBACK.lat,
            lng: Number(match.longitude) || CAIRO_FALLBACK.lng,
            address: match.address,
          }),
        );
        return;
      }
      dispatch(setSelectedAddressId(null));
    }

    const hasCoords = latitude != null && longitude != null;
    if (addresses.length === 0 || hasCoords) return;

    const preferred = addresses.find((a) => a.isDefault) ?? addresses[0];
    if (preferred) applyAddress(preferred);
  }, [
    user?.id,
    addressesFetching,
    addresses,
    selectedAddressId,
    latitude,
    longitude,
    dispatch,
    applyAddress,
  ]);

  const tryBootstrapGps = useCallback(() => {
    if (gpsBootstrapAttempted.current) return;
    if (Platform.OS === 'android' && androidFineGranted === false) return;
    if (Platform.OS === 'android' && androidFineGranted === null) return;

    const hasCoords = latitude != null && longitude != null;
    if (hasCoords) return;

    const list = user?.id ? addresses : [];
    if (user?.id && addressesFetching) return;
    if (user?.id && list.length > 0) return;

    gpsBootstrapAttempted.current = true;

    Geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setGpsPermissionDenied(false);
        void dispatch(fetchReverseGeocode({ lat, lng, locale }));
      },
      (err) => {
        if (err.code === 1) setGpsPermissionDenied(true);
        dispatch(
          setLocation({
            lat: CAIRO_FALLBACK.lat,
            lng: CAIRO_FALLBACK.lng,
            address: null,
          }),
        );
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 120_000 },
    );
  }, [
    user?.id,
    addressesFetching,
    addresses.length,
    latitude,
    longitude,
    androidFineGranted,
    dispatch,
    locale,
  ]);

  useEffect(() => {
    tryBootstrapGps();
  }, [tryBootstrapGps]);

  const merchantLat = latitude ?? CAIRO_FALLBACK.lat;
  const merchantLng = longitude ?? CAIRO_FALLBACK.lng;

  const headerLocationText = useMemo(() => {
    if (isLoading) return t('home.location_loading');
    const line = (currentAddress ?? '').trim();
    if (line) return line;
    if (gpsPermissionDenied) return t('home.locationUnavailable');
    if (latitude != null && longitude != null) return t('home.locationUnavailable');
    return t('home.location');
  }, [currentAddress, gpsPermissionDenied, isLoading, latitude, longitude, t]);

  const selectSavedAddress = useCallback(
    (a: Address) => {
      applyAddress(a);
    },
    [applyAddress],
  );

  const deliverCurrentLocationAsync = useCallback(async (): Promise<void> => {
    if (Platform.OS === 'android' && androidFineGranted === false) {
      setGpsPermissionDenied(true);
      return;
    }

    try {
      const pos = await new Promise<{ coords: { latitude: number; longitude: number } }>(
        (resolve, reject) => {
          Geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 60_000,
          });
        },
      );
      setGpsPermissionDenied(false);
      dispatch(setSelectedAddressId(null));
      await dispatch(
        fetchReverseGeocode({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          locale,
        }),
      ).unwrap();
    } catch {
      setGpsPermissionDenied(true);
      dispatch(setLoading(false));
    }
  }, [androidFineGranted, dispatch, locale]);

  return {
    addresses,
    addressesFetching,
    merchantLat,
    merchantLng,
    headerLocationText,
    isLocationLoading: isLoading,
    gpsPermissionDenied,
    selectSavedAddress,
    deliverCurrentLocationAsync,
    selectedAddressId,
    locale,
  };
}