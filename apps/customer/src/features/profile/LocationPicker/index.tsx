import React from 'react';
import { Platform, Pressable, TextInput, View } from 'react-native';
import MapView from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@dawwar/theme';
import { AddressInputRow, Button, Icon, MapTemplate, Text } from '@dawwar/ui';
import { mapProvider } from '../../../core/maps/provider';
import { useController } from './useController';
import { createStyles } from './styles';

const LIGHT_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#F2F2F2' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#7A8594' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#FFFFFF' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#D7D7D7' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#8A8F98' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#DDECF6' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#E9E9E9' }] },
];

export function LocationPickerScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(
    () => createStyles(colors, insets.top, insets.bottom),
    [colors, insets.bottom, insets.top],
  );
  const ctrl = useController();

  return (
    <MapTemplate
      style={styles.container}
      keyboardBehavior={Platform.OS === 'ios' ? 'padding' : undefined}
      header={
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={ctrl.handleBack}
            hitSlop={8}
            accessibilityRole="button"
          >
            <Icon
              name="chevron-left"
              size={22}
              color={colors.text}
              style={styles.backIcon}
            />
          </Pressable>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {ctrl.editId ? ctrl.t('addresses.update_address') : ctrl.t('locationPicker.title')}
          </Text>
          <View style={styles.headerSpacer} />
        </View>
      }
      mapContainerStyle={styles.mapContainer}
      map={
        <>
          <MapView
            ref={ctrl.mapRef}
            provider={mapProvider}
            style={styles.map}
            region={ctrl.region}
            onRegionChangeComplete={ctrl.handleRegionChangeComplete}
            customMapStyle={LIGHT_MAP_STYLE}
            showsUserLocation={false}
            showsMyLocationButton={false}
            showsCompass={false}
            toolbarEnabled={false}
          />
          <Pressable
            style={styles.gpsButton}
            onPress={ctrl.handleUseGPS}
            hitSlop={8}
            accessibilityRole="button"
          >
            <Icon name="crosshairs-gps" size={24} color={colors.text} />
          </Pressable>
          <View style={styles.centerPinContainer} pointerEvents="none">
            <View style={styles.avatarPin}>
              <Icon name="account" size={34} color={colors.primaryText} />
            </View>
            <View style={styles.pinTail} />
          </View>
          <View style={styles.mapHint} pointerEvents="none">
            <Text style={styles.mapHintText}>
              {ctrl.t('locationPicker.dragToSelect')}
            </Text>
          </View>
        </>
      }
      contentContainerStyle={styles.content}
      content={
        <>
          <Text style={styles.sectionTitle}>
            {ctrl.t('locationPicker.locationLabel')}
          </Text>
          <AddressInputRow
            address={ctrl.address}
            placeholder={ctrl.t('locationPicker.dragToSelect')}
            loading={ctrl.isGeocoding || ctrl.isFetching}
            onPressLocation={ctrl.handleUseGPS}
          />
          {ctrl.geocodeError ? (
            <Text style={styles.errorText}>{ctrl.geocodeError}</Text>
          ) : null}
          <TextInput
            style={styles.labelInput}
            value={ctrl.labelName}
            onChangeText={ctrl.handleLabelChange}
            placeholder={ctrl.t('locationPicker.labelPlaceholder')}
            placeholderTextColor={colors.placeholder}
            returnKeyType="done"
          />
          <Button
            label={ctrl.t('locationPicker.save')}
            onPress={ctrl.handleSave}
            disabled={!ctrl.isValid || ctrl.isSaving}
            loading={ctrl.isSaving}
            fullWidth
            style={styles.saveButton}
          />
        </>
      }
    />
  );
}
