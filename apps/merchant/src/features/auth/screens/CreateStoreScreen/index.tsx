import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import MapView, { Region } from 'react-native-maps';
import { useTheme, space, typography, radius, AppColors } from '@dawwar/theme';
import { ScreenTemplate, Header, Text, Input, Button, Icon } from '@dawwar/ui';
import { useController } from './useController';
import { geocodingApi } from '../../../../core/api/geocoding';
import { CategoryPicker } from '../../components/CategoryPicker';

const CAIRO = { latitude: 30.0444, longitude: 31.2357, latitudeDelta: 0.05, longitudeDelta: 0.05 };

export function CreateStoreScreen() {
  const { colors } = useTheme();
  const ctrl = useController();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  
  const [mapRegion, setRegion] = useState<Region>(CAIRO);
  const [isGeocoding, setIsGeocoding] = useState(false);

  const handleRegionChangeComplete = async (region: Region) => {
    setRegion(region);
    ctrl.setLatitude(region.latitude);
    ctrl.setLongitude(region.longitude);

    setIsGeocoding(true);
    try {
      const { label, city, governorate } = await geocodingApi.reverse(region.latitude, region.longitude, 'ar');
      ctrl.setAddress(label);
      ctrl.setCity(city);
      ctrl.setGovernorate(governorate);
    } catch (err) {
      console.warn('Reverse geocode failed:', err);
    } finally {
      setIsGeocoding(false);
    }
  };

  return (
    <ScreenTemplate edges={['top']} backgroundColor={colors.background}>
      <Header title={ctrl.t('merchant.createStore.title')} />
      
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.form}>
          <Text variant="h3" style={styles.title}>{ctrl.t('merchant.createStore.step1')}</Text>
          
          <Input
            label={ctrl.t('merchant.createStore.businessName')}
            value={ctrl.businessName}
            onChangeText={ctrl.setBusinessName}
            placeholder={ctrl.t('merchant.createStore.businessNamePlaceholder')}
          />

          <CategoryPicker
            selectedParentId={ctrl.parentCategoryId}
            selectedChildIds={ctrl.childCategoryIds}
            onParentSelect={ctrl.handleParentSelect}
            onChildToggle={ctrl.handleChildToggle}
          />

          <Text variant="label" style={styles.pickerLabel}>{ctrl.t('merchant.createStore.location')} *</Text>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={CAIRO}
              onRegionChangeComplete={handleRegionChangeComplete}
              showsUserLocation
            />
            <View style={styles.markerFixed} pointerEvents="none">
              <Icon name="map-marker" size={40} color={colors.primary} />
            </View>
          </View>
          
          <View style={[styles.addressBox, { backgroundColor: colors.surfaceVariant }]}>
            <Icon name="map-marker-outline" size={20} color={colors.textSecondary} />
            <Text style={styles.addressText} numberOfLines={2}>
              {isGeocoding ? ctrl.t('common.loading') : ctrl.address || ctrl.t('merchant.createStore.locationSubtitle')}
            </Text>
          </View>

          <Button
            label={ctrl.t('merchant.createStore.submit')}
            onPress={ctrl.handleCreateStore}
            loading={ctrl.isLoading}
            disabled={ctrl.isButtonDisabled}
            style={styles.submitBtn}
          />
        </View>
      </ScrollView>
    </ScreenTemplate>
  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  scrollContent: { flexGrow: 1 },
  form: { padding: space.xl, gap: space.lg },
  title: { fontWeight: '800' },
  pickerLabel: { ...typography.label, color: colors.textSecondary },
  mapContainer: {
    height: 250,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  map: { ...StyleSheet.absoluteFillObject },
  markerFixed: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -20,
    marginTop: -40,
  },
  addressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: space.md,
    borderRadius: radius.md,
    gap: space.sm,
  },
  addressText: { ...typography.body2, flex: 1 },
  submitBtn: { marginTop: space.lg, height: 56, borderRadius: radius.lg },
});
