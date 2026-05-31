import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { ScrollScreenTemplate, Input, Button, Text, Icon } from '@dawwar/ui';
import { useTheme, radius, shadows, space, typography } from '@dawwar/theme';
import { MapPickerModal } from '../../../custom-order/components/MapPickerModal';
import { useController } from './useController';

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
          <TouchableOpacity style={styles.mapCard} onPress={() => ctrl.setShowMap(true)} activeOpacity={0.85}>
            <View style={styles.mapIcon}>
              <Icon name="map-marker-radius-outline" size={28} color={colors.primary} />
            </View>
            <View style={styles.mapText}>
              <Text style={styles.mapTitle}>{t('addresses.map_title')}</Text>
              <Text style={styles.mapSubtitle} numberOfLines={2}>
                {ctrl.address || t('addresses.map_instructions')}
              </Text>
            </View>
            <Icon name="chevron-right" size={22} color={colors.textTertiary} />
          </TouchableOpacity>

          <Input label={t('addresses.label_label')} value={ctrl.label} onChangeText={ctrl.setLabel} />
          <Input
            label={t('addresses.address_label')}
            value={ctrl.address}
            onChangeText={ctrl.setAddress}
            rightIcon={
              <Text variant="label" color={colors.primary} onPress={() => ctrl.setShowMap(true)}>
                {t('custom_order.pick_on_map')}
              </Text>
            }
          />
          <Input label={t('addresses.phone_label')} value={ctrl.phone} onChangeText={ctrl.setPhone} keyboardType="phone-pad" />
          <Input label={t('addresses.notes_label')} value={ctrl.notes} onChangeText={ctrl.setNotes} placeholder={t('addresses.notes_placeholder')} multiline />
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
      padding: space.base,
      gap: space.md,
    },
    mapCard: {
      minHeight: 96,
      borderRadius: radius.lg,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.borderLight,
      padding: space.md,
      flexDirection: 'row',
      alignItems: 'center',
      gap: space.md,
      ...shadows.sm,
    },
    mapIcon: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    mapText: {
      flex: 1,
    },
    mapTitle: {
      ...typography.label,
      color: colors.text,
      fontWeight: '900',
      marginBottom: 4,
    },
    mapSubtitle: {
      ...typography.body2,
      color: colors.textSecondary,
      lineHeight: 20,
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
