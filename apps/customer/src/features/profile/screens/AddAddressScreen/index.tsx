import React from 'react';
import { I18nManager, StyleSheet, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useTranslation } from '@dawwar/i18n';
import { ScrollScreenTemplate, Input, Button, Text, Icon } from '@dawwar/ui';
import { useTheme, radius, shadows, space, typography } from '@dawwar/theme';
import { mapProvider } from '../../../../core/maps/provider';
import { MapPickerModal } from '../../../custom-order/components/MapPickerModal';
import { useController } from './useController';

const LIGHT_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#F2F2F2' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#7A8594' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#FFFFFF' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#D7D7D7' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#8A8F98' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#DDECF6' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#E9E9E9' }] },
];

export function AddAddressScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const ctrl = useController();

  return (
    <>
      <ScrollScreenTemplate
        headerProps={{
          title: ctrl.editId ? t('addresses.update_address') : t('addresses.add'),
          onBackPress: ctrl.handleBack,
        }}
        footer={
          <View style={styles.footer}>
            <Button
              label={ctrl.editId ? t('addresses.update_address') : t('addresses.save_address')}
              onPress={ctrl.handleSave}
              loading={ctrl.isLoading}
              disabled={ctrl.isButtonDisabled}
              fullWidth
              style={styles.saveButton}
            />
          </View>
        }
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <View style={styles.mapArea}>
            <TouchableOpacity
              style={styles.mapPreview}
              onPress={() => ctrl.setShowMap(true)}
              activeOpacity={0.9}
            >
              <MapView
                provider={mapProvider}
                style={StyleSheet.absoluteFill}
                pointerEvents="none"
                mapType="standard"
                customMapStyle={LIGHT_MAP_STYLE}
                region={{
                  latitude: ctrl.lat,
                  longitude: ctrl.lng,
                  latitudeDelta: 0.012,
                  longitudeDelta: 0.012,
                }}
              >
                <Marker coordinate={{ latitude: ctrl.lat, longitude: ctrl.lng }} />
              </MapView>
              <View style={styles.centerPin} pointerEvents="none">
                <Icon name="map-marker" size={44} color={colors.primary} />
              </View>
              <View style={styles.mapFloatingButton}>
                <Icon name="crosshairs-gps" size={22} color={colors.text} />
              </View>
              <View style={styles.mapHintPill}>
                <Text style={styles.mapSubtitle} numberOfLines={1}>
                  {t('addresses.map_instructions')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

        

          {!ctrl.phone ? (
            <Input
              label={t('addresses.phone_label')}
              value={ctrl.phone}
              onChangeText={ctrl.setPhone}
              keyboardType="phone-pad"
            />
          ) : null}
        </View>
      </ScrollScreenTemplate>
      <MapPickerModal
        visible={ctrl.showMap}
        initialLatitude={ctrl.lat}
        initialLongitude={ctrl.lng}
        onConfirm={ctrl.handleMapConfirm}
        onClose={() => ctrl.setShowMap(false)}
      />
    </>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    content: {
      paddingBottom: space.xl,
    },
    mapArea: {
      backgroundColor: colors.surfaceVariant,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    mapPreview: {
      height: 360,
      overflow: 'hidden',
      backgroundColor: '#F2F2F2',
    },
    mapFloatingButton: {
      position: 'absolute',
      top: space.md,
      end: space.md,
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      ...shadows.sm,
    },
    centerPin: {
      position: 'absolute',
      top: '50%',
      start: '50%',
      transform: [{ translateX: -22 }],
      marginTop: -42,
    },
    mapHintPill: {
      position: 'absolute',
      alignSelf: 'center',
      bottom: space.md,
      minHeight: 34,
      borderRadius: radius.full,
      backgroundColor: colors.surface,
      paddingHorizontal: space.base,
      justifyContent: 'center',
      ...shadows.sm,
    },
    formSheet: {
      marginHorizontal: space.base,
      marginTop: -26,
      borderRadius: radius.xl,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.borderLight,
      paddingHorizontal: space.base,
      paddingTop: space.sm,
      paddingBottom: space.base,
      gap: space.md,
      ...shadows.sm,
    },
    sheetHandle: {
      width: 56,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.border,
      alignSelf: 'center',
    },
    sheetTitle: {
      ...typography.body1,
      color: colors.text,
      fontWeight: '900',
      textAlign: 'center',
    },
    locationField: {
      minHeight: 58,
      borderRadius: radius.md,
      backgroundColor: colors.surfaceVariant,
      borderWidth: 1,
      borderColor: colors.borderLight,
      paddingHorizontal: space.base,
      flexDirection: 'row',
      alignItems: 'center',
      gap: space.sm,
    },
    locationFieldText: {
      flex: 1,
      gap: 2,
      alignItems: I18nManager.isRTL ? 'flex-end' : 'flex-start',
    },
    locationFieldLabel: {
      ...typography.caption,
      color: colors.textSecondary,
      textAlign: 'auto',
      writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
    },
    locationFieldValue: {
      ...typography.body2,
      color: colors.text,
      fontWeight: '800',
      textAlign: 'auto',
      writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
    },
    mapSubtitle: {
      ...typography.body2,
      color: colors.textSecondary,
      lineHeight: 20,
      textAlign: 'center',
      writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
    },
    footer: {
      padding: space.base,
      backgroundColor: colors.background,
    },
    saveButton: {
      height: 54,
      borderRadius: radius.lg,
    },
  });
