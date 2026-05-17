import React, { forwardRef, useCallback, useMemo } from 'react';
import { View, TouchableOpacity, StyleSheet, ActivityIndicator, I18nManager } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from '@dawwar/i18n';
import { Text, Icon, Button } from '@dawwar/ui';
import { useTheme, space, typography, radius } from '@dawwar/theme';
import type { Address } from '@dawwar/types';

export interface LocationBottomSheetProps {
  onClose: () => void;
  onOpenMap: () => void;
  addresses: Address[];
  addressesLoading: boolean;
  selectedAddressId: string | null;
  onSelectAddress: (address: Address) => void;
  onUseCurrentLocation: () => void;
  isGpsLoading: boolean;
}

function labelIcon(label: string): string {
  const l = (label || '').toLowerCase();
  if (l === 'home' || l === 'المنزل' || l.includes('منزل')) return 'home-variant';
  if (l === 'work' || l === 'العمل' || l.includes('عمل')) return 'briefcase-variant';
  return 'map-marker-outline';
}

export const LocationBottomSheet = forwardRef<BottomSheet, LocationBottomSheetProps>(
  (
    {
      onClose,
      onOpenMap,
      addresses,
      addressesLoading,
      selectedAddressId,
      onSelectAddress,
      onUseCurrentLocation,
      isGpsLoading,
    },
    ref,
  ) => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();

    const snapPoints = useMemo(() => ['55%', '85%'], []);

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.45}
        />
      ),
      [],
    );

    const bottomPad = Math.max(insets.bottom, space.md);

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        enablePanDownToClose
        keyboardBehavior="interactive"
        android_keyboardInputMode="adjustResize"
        backgroundStyle={{
          backgroundColor: colors.background,
          borderTopStartRadius: radius.xl,
          borderTopEndRadius: radius.xl,
        }}
        handleIndicatorStyle={{ backgroundColor: colors.border, width: 40 }}
      >
        <BottomSheetScrollView
          contentContainerStyle={[styles.scrollInner, { paddingBottom: bottomPad }]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text, textAlign: 'auto' }]}>
              {t('home.chooseDeliveryLocation')}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} hitSlop={12}>
              <Icon name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.sectionTitle, { color: colors.textSecondary, textAlign: 'auto' }]}>
            {t('home.savedAddresses')}
          </Text>

          {addressesLoading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : addresses.length === 0 ? (
            <Text style={[styles.emptyHint, { color: colors.textSecondary, textAlign: 'auto' }]}>
              {t('addresses.empty')}
            </Text>
          ) : (
            addresses.map((item) => {
              const selected = item.id === selectedAddressId;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.addressCard,
                    {
                      borderColor: selected ? colors.primary : colors.borderLight,
                      backgroundColor: selected ? `${colors.primary}12` : colors.surface,
                    },
                  ]}
                  onPress={() => onSelectAddress(item)}
                  activeOpacity={0.75}
                >
                  <View style={[styles.iconCircle, { backgroundColor: colors.surfaceVariant }]}>
                    <Icon name={labelIcon(item.label)} size={22} color={colors.primary} />
                  </View>
                  <View style={styles.addressTextCol}>
                    <Text style={[styles.addrLabel, { color: colors.text, textAlign: 'auto' }]}>
                      {t(`address_labels.${(item.label || 'other').toLowerCase()}`, {
                        defaultValue: item.label,
                      })}
                    </Text>
                    <Text
                      style={[styles.addrLine, { color: colors.textSecondary, textAlign: 'auto' }]}
                      numberOfLines={2}
                    >
                      {item.address}
                    </Text>
                  </View>
                  {selected ? (
                    <Icon name="check-circle" size={22} color={colors.primary} />
                  ) : (
                    <Icon
                      name={I18nManager.isRTL ? 'chevron-left' : 'chevron-right'}
                      size={20}
                      color={colors.border}
                    />
                  )}
                </TouchableOpacity>
              );
            })
          )}

          <View style={styles.divider} />

          <TouchableOpacity
            style={[styles.optionRow, { borderColor: colors.borderLight, backgroundColor: colors.surface }]}
            onPress={onOpenMap}
            activeOpacity={0.75}
          >
            <View style={[styles.optionIcon, { backgroundColor: `${colors.primary}18` }]}>
              <Icon name="map-search-outline" size={22} color={colors.primary} />
            </View>
            <View style={styles.optionText}>
              <Text style={[styles.optionTitle, { color: colors.text, textAlign: 'auto' }]}>
                {t('home.deliverToDifferentLocation')}
              </Text>
              <Text style={[styles.optionSub, { color: colors.textSecondary, textAlign: 'auto' }]}>
                {t('home.chooseLocationOnMap')}
              </Text>
            </View>
            <Icon
              name={I18nManager.isRTL ? 'chevron-left' : 'chevron-right'}
              size={22}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          <Button
            label={t('home.deliverToCurrentLocation')}
            rightIcon={<Icon name="crosshairs-gps" size={20} color={colors.primary} />}
            variant="outline"
            style={styles.gpsBtn}
            onPress={onUseCurrentLocation}
            loading={isGpsLoading}
          />
        </BottomSheetScrollView>
      </BottomSheet>
    );
  },
);

const styles = StyleSheet.create({
  scrollInner: {
    paddingHorizontal: space.lg,
    paddingTop: space.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: space.md,
  },
  title: {
    ...typography.h3,
    flex: 1,
    marginEnd: space.sm,
  },
  closeBtn: {
    padding: space.xs,
  },
  sectionTitle: {
    ...typography.label,
    marginBottom: space.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  loadingBox: {
    paddingVertical: space.xl,
    alignItems: 'center',
  },
  emptyHint: {
    ...typography.body2,
    marginBottom: space.lg,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: space.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginBottom: space.sm,
    gap: space.md,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressTextCol: {
    flex: 1,
  },
  addrLabel: {
    ...typography.body1,
    fontWeight: '700',
    marginBottom: 2,
  },
  addrLine: {
    ...typography.body2,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: space.lg,
    opacity: 0,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: space.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginBottom: space.md,
    gap: space.md,
  },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    ...typography.body1,
    fontWeight: '700',
    marginBottom: 2,
  },
  optionSub: {
    ...typography.body2,
  },
  gpsBtn: {
    marginBottom: space.sm,
  },
});
