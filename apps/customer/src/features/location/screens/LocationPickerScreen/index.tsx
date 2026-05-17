import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Keyboard,
  I18nManager,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MapView, { Region } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { useTranslation } from '@dawwar/i18n';
import { Text, Icon, Button, ScreenTemplate } from '@dawwar/ui';
import { useTheme, space, typography, radius, shadows } from '@dawwar/theme';
import { geocodingApi, GeocodingResult } from '../../core/api/geocoding';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { selectLocation, setLocation, setSelectedAddressId } from '../../../../store/slices/location.slice';

const CAIRO = { latitude: 30.0444, longitude: 31.2357, latitudeDelta: 0.05, longitudeDelta: 0.05 };

export function LocationPickerScreen() {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const persisted = useAppSelector(selectLocation);

  const mapRef = useRef<MapView>(null);
  const initialRegion = useMemo<Region>(() => {
    if (persisted.latitude != null && persisted.longitude != null) {
      return {
        latitude: persisted.latitude,
        longitude: persisted.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
    }
    return CAIRO;
  }, [persisted.latitude, persisted.longitude]);

  const [region, setRegion] = useState<Region>(initialRegion);

  const [address, setAddress] = useState<string>('');
  const [isGeocoding, setIsGeocoding] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);

  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleReverseGeocode = useCallback(async (lat: number, lon: number) => {
    setIsGeocoding(true);
    const addr = await geocodingApi.reverse(lat, lon, i18n.language);
    setAddress(addr);
    setIsGeocoding(false);
  }, [i18n.language]);

  const handleRegionChangeComplete = (newRegion: Region) => {
    setRegion(newRegion);
    void handleReverseGeocode(newRegion.latitude, newRegion.longitude);
  };

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      if (searchTimeout.current) clearTimeout(searchTimeout.current);

      if (query.length < 3) {
        setSearchResults([]);
        return;
      }

      searchTimeout.current = setTimeout(async () => {
        const results = await geocodingApi.search(query, i18n.language);
        setSearchResults(results);
      }, 800);
    },
    [i18n.language],
  );

  useEffect(() => {
    void handleReverseGeocode(initialRegion.latitude, initialRegion.longitude);
  }, [handleReverseGeocode, initialRegion.latitude, initialRegion.longitude]);

  const handleSelectSearch = useCallback(
    (item: GeocodingResult) => {
      const lat = parseFloat(item.lat);
      const lon = parseFloat(item.lon);

      Keyboard.dismiss();
      setSearchQuery('');
      setSearchResults([]);

      const newRegion = { latitude: lat, longitude: lon, latitudeDelta: 0.01, longitudeDelta: 0.01 };
      setRegion(newRegion);
      mapRef.current?.animateToRegion(newRegion, 1000);
      void handleReverseGeocode(lat, lon);
    },
    [handleReverseGeocode],
  );

  const handleConfirm = () => {
    dispatch(
      setLocation({
        lat: region.latitude,
        lng: region.longitude,
        address: address.trim() || null,
      }),
    );
    dispatch(setSelectedAddressId(null));
    navigation.goBack();
  };

  const recenterOnGps = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newRegion = { latitude, longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 };
        setRegion(newRegion);
        mapRef.current?.animateToRegion(newRegion, 1000);
        void handleReverseGeocode(latitude, longitude);
      },
      () => undefined,
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60_000 },
    );
  };

  const renderItem = useCallback(
    ({ item }: { item: GeocodingResult }) => (
      <TouchableOpacity
        style={[styles.searchItem, { borderBottomColor: colors.borderLight }]}
        onPress={() => handleSelectSearch(item)}
      >
        <Icon name="map-marker-outline" size={20} color={colors.textSecondary} />
        <Text style={[styles.searchItemText, { color: colors.text }]} numberOfLines={2}>
          {item.display_name}
        </Text>
      </TouchableOpacity>
    ),
    [colors.borderLight, colors.text, colors.textSecondary, handleSelectSearch],
  );

  const backIcon = I18nManager.isRTL ? 'arrow-right' : 'arrow-left';

  return (
    <ScreenTemplate edges={['top']} backgroundColor={colors.background}>
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFillObject}
          initialRegion={initialRegion}
          onRegionChangeComplete={handleRegionChangeComplete}
          showsUserLocation
          showsMyLocationButton={false}
        />

        <View style={styles.centerPinWrapper} pointerEvents="none">
          <Icon name="map-marker" size={48} color={colors.primary} />
        </View>

        <View style={[styles.headerContainer, { backgroundColor: colors.surface }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Icon name={backIcon} size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={[styles.searchInputWrapper, { backgroundColor: colors.surfaceVariant }]}>
            <Icon name="magnify" size={20} color={colors.placeholder} />
            <TextInput
              style={[styles.searchInput, { color: colors.text, textAlign: 'auto' }]}
              placeholder={t('location.search_placeholder', 'Search area or street...')}
              placeholderTextColor={colors.placeholder}
              value={searchQuery}
              onChangeText={handleSearch}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => handleSearch('')}>
                <Icon name="close-circle" size={20} color={colors.placeholder} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {searchResults.length > 0 && (
          <View style={[styles.searchResults, { backgroundColor: colors.surface }]}>
            <FlatList
              data={searchResults}
              keyExtractor={(item, index) =>
                (item as { place_id?: number }).place_id != null
                  ? String((item as { place_id?: number }).place_id)
                  : index.toString()
              }
              renderItem={renderItem}
              keyboardShouldPersistTaps="handled"
            />
          </View>
        )}

        <TouchableOpacity
          style={[styles.gpsBtn, { backgroundColor: colors.surface }]}
          onPress={recenterOnGps}
        >
          <Icon name="crosshairs-gps" size={24} color={colors.primary} />
        </TouchableOpacity>

        <View style={[styles.footer, { backgroundColor: colors.surface }]}>
          <Text style={[styles.footerLabel, { color: colors.textSecondary, textAlign: 'auto' }]}>
            {t('location.deliver_to', 'Deliver to')}
          </Text>
          <Text style={[styles.footerAddress, { color: colors.text, textAlign: 'auto' }]} numberOfLines={2}>
            {isGeocoding ? t('common.loading', 'Loading...') : address || t('location.locating', 'Locating...')}
          </Text>
          <Button
            label={t('location.confirm', 'Confirm Location')}
            onPress={handleConfirm}
            disabled={isGeocoding || !address}
            style={styles.confirmBtn}
          />
        </View>
      </View>
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerPinWrapper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -24,
    marginTop: -48,
    zIndex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space.base,
    paddingVertical: space.sm,
    ...shadows.sm,
    zIndex: 10,
    elevation: 4,
  },
  backBtn: {
    padding: space.xs,
    marginEnd: space.sm,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space.md,
    borderRadius: radius.md,
    height: 44,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: space.sm,
    ...typography.body1,
  },
  searchResults: {
    position: 'absolute',
    top: 70,
    start: space.base,
    end: space.base,
    maxHeight: 300,
    borderRadius: radius.md,
    ...shadows.md,
    zIndex: 9,
    elevation: 3,
  },
  searchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: space.md,
    borderBottomWidth: 1,
  },
  searchItemText: {
    marginStart: space.md,
    ...typography.body2,
    flex: 1,
    textAlign: 'auto',
  },
  gpsBtn: {
    position: 'absolute',
    bottom: 160,
    end: space.base,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
    zIndex: 5,
    elevation: 3,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: space.lg,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    ...shadows.lg,
    zIndex: 5,
    elevation: 10,
  },
  footerLabel: {
    ...typography.label,
    marginBottom: space.xs,
  },
  footerAddress: {
    ...typography.h3,
    marginBottom: space.lg,
  },
  confirmBtn: {
    width: '100%',
  },
});
