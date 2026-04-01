import React, { useState } from 'react';
import { View, Modal, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, type Region } from 'react-native-maps';
import { useTheme } from '@dawwar/theme';
import { Text, Button } from '@dawwar/ui';
import { useTranslation } from '@dawwar/i18n';
import { createStyles } from './styles';
import type { MapPickerModalProps } from './types';

// Sinbellawin center
const DEFAULT_LAT = 30.8704;
const DEFAULT_LNG = 31.4741;

export function MapPickerModal({
  visible,
  initialLatitude = DEFAULT_LAT,
  initialLongitude = DEFAULT_LNG,
  onConfirm,
  onClose,
}: MapPickerModalProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();

  const [region, setRegion] = useState<Region>({
    latitude: initialLatitude,
    longitude: initialLongitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  // Phase 1: mock reverse geocode using coordinates
  const getAddressFromCoords = (lat: number, lng: number): string =>
    `${lat.toFixed(4)}, ${lng.toFixed(4)} — سنبلاوين`;

  const handleConfirm = () => {
    const address = getAddressFromCoords(region.latitude, region.longitude);
    onConfirm(region.latitude, region.longitude, address);
  };

  return (
    <Modal visible={visible} animationType="slide" statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <View style={{ width: 24 }} />
          </TouchableOpacity>
          <Text style={styles.title}>{t('addresses.map_title')}</Text>
          <TouchableOpacity onPress={onClose}>
            <View style={{ width: 24 }} />
          </TouchableOpacity>
        </View>

        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={region}
          onRegionChangeComplete={setRegion}
        >
          <Marker
            coordinate={{ latitude: region.latitude, longitude: region.longitude }}
            draggable
            onDragEnd={(e) => {
              const { latitude, longitude } = e.nativeEvent.coordinate;
              setRegion((prev) => ({ ...prev, latitude, longitude }));
            }}
          />
        </MapView>

        <View style={styles.hint}>
          <Text style={styles.hintText}>{t('addresses.map_instructions')}</Text>
        </View>

        <View style={styles.addressPreview}>
          <Text style={styles.addressText}>
            {getAddressFromCoords(region.latitude, region.longitude)}
          </Text>
        </View>

        <Button
          label={t('addresses.confirm_location')}
          onPress={handleConfirm}
          fullWidth
          style={styles.confirmBtn}
        />
      </View>
    </Modal>
  );
}
