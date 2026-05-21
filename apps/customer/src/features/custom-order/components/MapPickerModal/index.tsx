import React, { useState } from 'react';
import { View, Modal, TouchableOpacity, I18nManager } from 'react-native';
import MapView, { PROVIDER_GOOGLE, type Region } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@dawwar/theme';
import { Text, Button, Icon } from '@dawwar/ui';
import { useTranslation } from '@dawwar/i18n';
import { createStyles } from './styles';
import type { MapPickerModalProps } from './types';

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
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const [region, setRegion] = useState<Region>({
    latitude: initialLatitude,
    longitude: initialLongitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const getAddressFromCoords = (lat: number, lng: number): string =>
    `${Number(lat || 0).toFixed(4)}, ${Number(lng || 0).toFixed(4)} — ${t('custom_order.sinbellawin')}`;

  const handleConfirm = () => {
    const address = getAddressFromCoords(region.latitude, region.longitude);
    onConfirm(region.latitude, region.longitude, address);
  };

  return (
    <Modal visible={visible} animationType="slide" statusBarTranslucent>
      <View style={styles.overlay}>
        {/* Floating Header */}
        <View style={[styles.mapHeader, { top: insets.top }]}>
          <TouchableOpacity onPress={onClose} style={styles.mapBackBtn}>
            <Icon
              name={I18nManager.isRTL ? 'chevron-right' : 'chevron-left'}
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>
          <Text style={styles.mapTitle}>{t('custom_order.map_title')}</Text>
        </View>

        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={region}
          onRegionChangeComplete={setRegion}
        />

        {/* Fixed Center Crosshair */}
        <View style={styles.centerPin} pointerEvents="none">
          <Icon name="map-marker" size={40} color={colors.primary} />
        </View>

        <View style={styles.hint}>
          <Text style={styles.hintText}>{t('addresses.map_instructions')}</Text>
        </View>

        {/* Bottom Panel */}
        <View style={[styles.bottomContainer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <View style={styles.addressPreview}>
            <Text style={styles.addressText}>
              {getAddressFromCoords(region.latitude, region.longitude)}
            </Text>
          </View>

          <Button
            label={t('location.confirm')}
            onPress={handleConfirm}
            fullWidth
            style={styles.confirmBtn}
          />
        </View>
      </View>
    </Modal>
  );
}
