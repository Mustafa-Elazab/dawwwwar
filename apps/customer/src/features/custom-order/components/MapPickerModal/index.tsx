import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, I18nManager, Modal, TouchableOpacity, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import MapView, { type Region } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@dawwar/theme';
import { Button, Icon, Text } from '@dawwar/ui';
import { useTranslation } from '@dawwar/i18n';
import { mapProvider } from '../../../../core/maps/provider';
import { MODAL_ROUTES } from '../../../../navigation/routes';
import type { RootParamList } from '../../../../navigation/types';
import {
  geocodingApi,
  REVERSE_GEOCODE_MIN_INTERVAL_MS,
} from '../../../location/core/api/geocoding';
import { createStyles } from './styles';
import type { MapPickerModalProps } from './types';

const DEFAULT_LAT = 30.8704;
const DEFAULT_LNG = 31.4741;

type Navigation = StackNavigationProp<RootParamList>;
type ScreenRoute = RouteProp<RootParamList, typeof MODAL_ROUTES.CUSTOM_ORDER_MAP_PICKER>;

const fallbackAddress = (lat: number, lng: number): string =>
  `${Number(lat || 0).toFixed(4)}, ${Number(lng || 0).toFixed(4)} — سنبلاوين`;

export function CustomOrderMapPickerScreen() {
  const { colors } = useTheme();
  const { t, i18n } = useTranslation();
  const navigation = useNavigation<Navigation>();
  const route = useRoute<ScreenRoute>();
  const insets = useSafeAreaInsets();
  const isRTL = i18n.language.startsWith('ar') || I18nManager.isRTL;
  const styles = useMemo(() => createStyles(colors, isRTL), [colors, isRTL]);

  const initialLatitude = route.params?.initialLatitude ?? DEFAULT_LAT;
  const initialLongitude = route.params?.initialLongitude ?? DEFAULT_LNG;

  const [region, setRegion] = useState<Region>({
    latitude: initialLatitude,
    longitude: initialLongitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [address, setAddress] = useState(() => fallbackAddress(initialLatitude, initialLongitude));
  const [isGeocoding, setIsGeocoding] = useState(false);
  const reverseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reverseRequestId = useRef(0);

  const resolveAddress = useCallback(
    async (nextRegion: Region) => {
      const requestId = reverseRequestId.current + 1;
      reverseRequestId.current = requestId;
      setIsGeocoding(true);
      try {
        const resolved = await geocodingApi.reverse(
          nextRegion.latitude,
          nextRegion.longitude,
          i18n.language,
        );
        if (requestId === reverseRequestId.current) {
          setAddress(resolved || fallbackAddress(nextRegion.latitude, nextRegion.longitude));
        }
      } finally {
        if (requestId === reverseRequestId.current) {
          setIsGeocoding(false);
        }
      }
    },
    [i18n.language],
  );

  const scheduleResolveAddress = useCallback(
    (nextRegion: Region) => {
      if (reverseTimeout.current) clearTimeout(reverseTimeout.current);
      reverseTimeout.current = setTimeout(() => {
        void resolveAddress(nextRegion);
      }, REVERSE_GEOCODE_MIN_INTERVAL_MS);
    },
    [resolveAddress],
  );

  useEffect(() => {
    const nextRegion = {
      latitude: initialLatitude,
      longitude: initialLongitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
    setRegion(nextRegion);
    void resolveAddress(nextRegion);
  }, [initialLatitude, initialLongitude, resolveAddress]);

  useEffect(
    () => () => {
      if (reverseTimeout.current) clearTimeout(reverseTimeout.current);
    },
    [],
  );

  const handleRegionChangeComplete = useCallback(
    (nextRegion: Region) => {
      setRegion(nextRegion);
      scheduleResolveAddress(nextRegion);
    },
    [scheduleResolveAddress],
  );

  const handleConfirm = useCallback(() => {
    navigation.navigate(MODAL_ROUTES.CUSTOM_ORDER, {
      pickedShopLocation: {
        latitude: region.latitude,
        longitude: region.longitude,
        address,
      },
    });
  }, [address, navigation, region.latitude, region.longitude]);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={navigation.goBack}
          accessibilityRole="button"
        >
          <Icon name="chevron-left" size={22} color={colors.text} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('addresses.map_title')}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.mapWrap}>
        <MapView
          style={styles.map}
          provider={mapProvider}
          region={region}
          onRegionChangeComplete={handleRegionChangeComplete}
          showsCompass={false}
          showsMyLocationButton={false}
          toolbarEnabled={false}
        />
        <View style={styles.centerPin} pointerEvents="none">
          <Icon name="map-marker" size={44} color={colors.primary} />
        </View>
      </View>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 18) }]}>
        <View style={styles.handle} />
        <Text style={styles.footerTitle}>{t('addresses.location')}</Text>
        <View style={styles.addressRow}>
          <View style={styles.addressTextWrap}>
            {isGeocoding ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Text style={styles.addressText} numberOfLines={2}>
                {address}
              </Text>
            )}
          </View>
          <Icon name="map-marker-radius-outline" size={22} color={colors.textSecondary} />
        </View>
        <Button
          label={t('addresses.confirm_location')}
          onPress={handleConfirm}
          loading={isGeocoding}
          disabled={isGeocoding}
          fullWidth
          style={styles.confirmButton}
        />
      </View>
    </View>
  );
}

export function MapPickerModal({
  visible,
  initialLatitude = DEFAULT_LAT,
  initialLongitude = DEFAULT_LNG,
  onConfirm,
  onClose,
}: MapPickerModalProps) {
  const { colors } = useTheme();
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const isRTL = i18n.language.startsWith('ar') || I18nManager.isRTL;
  const styles = useMemo(() => createStyles(colors, isRTL), [colors, isRTL]);

  const [region, setRegion] = useState<Region>({
    latitude: initialLatitude,
    longitude: initialLongitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [address, setAddress] = useState(() => fallbackAddress(initialLatitude, initialLongitude));
  const [isGeocoding, setIsGeocoding] = useState(false);
  const reverseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reverseRequestId = useRef(0);

  const resolveAddress = useCallback(
    async (nextRegion: Region) => {
      const requestId = reverseRequestId.current + 1;
      reverseRequestId.current = requestId;
      setIsGeocoding(true);
      try {
        const resolved = await geocodingApi.reverse(
          nextRegion.latitude,
          nextRegion.longitude,
          i18n.language,
        );
        if (requestId === reverseRequestId.current) {
          setAddress(resolved || fallbackAddress(nextRegion.latitude, nextRegion.longitude));
        }
      } finally {
        if (requestId === reverseRequestId.current) {
          setIsGeocoding(false);
        }
      }
    },
    [i18n.language],
  );

  const scheduleResolveAddress = useCallback(
    (nextRegion: Region) => {
      if (reverseTimeout.current) clearTimeout(reverseTimeout.current);
      reverseTimeout.current = setTimeout(() => {
        void resolveAddress(nextRegion);
      }, REVERSE_GEOCODE_MIN_INTERVAL_MS);
    },
    [resolveAddress],
  );

  useEffect(() => {
    if (!visible) return;

    const nextRegion = {
      latitude: initialLatitude,
      longitude: initialLongitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
    setRegion(nextRegion);
    setAddress(fallbackAddress(initialLatitude, initialLongitude));
    void resolveAddress(nextRegion);
  }, [initialLatitude, initialLongitude, resolveAddress, visible]);

  useEffect(
    () => () => {
      if (reverseTimeout.current) clearTimeout(reverseTimeout.current);
    },
    [],
  );

  const handleRegionChangeComplete = useCallback(
    (nextRegion: Region) => {
      setRegion(nextRegion);
      scheduleResolveAddress(nextRegion);
    },
    [scheduleResolveAddress],
  );

  const handleConfirm = useCallback(() => {
    onConfirm(region.latitude, region.longitude, address);
  }, [address, onConfirm, region.latitude, region.longitude]);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity style={styles.backButton} onPress={onClose} accessibilityRole="button">
            <Icon name="chevron-left" size={22} color={colors.text} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('addresses.map_title')}</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.mapWrap}>
          <MapView
            style={styles.map}
            provider={mapProvider}
            region={region}
            onRegionChangeComplete={handleRegionChangeComplete}
            showsCompass={false}
            showsMyLocationButton={false}
            toolbarEnabled={false}
          />
          <View style={styles.centerPin} pointerEvents="none">
            <Icon name="map-marker" size={44} color={colors.primary} />
          </View>
        </View>

        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 18) }]}>
          <View style={styles.handle} />
          <Text style={styles.footerTitle}>{t('addresses.location')}</Text>
          <View style={styles.addressRow}>
            <View style={styles.addressTextWrap}>
              {isGeocoding ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Text style={styles.addressText} numberOfLines={2}>
                  {address}
                </Text>
              )}
            </View>
            <Icon name="map-marker-radius-outline" size={22} color={colors.textSecondary} />
          </View>
          <Button
            label={t('addresses.confirm_location')}
            onPress={handleConfirm}
            loading={isGeocoding}
            disabled={isGeocoding}
            fullWidth
            style={styles.confirmButton}
          />
        </View>
      </View>
    </Modal>
  );
}
