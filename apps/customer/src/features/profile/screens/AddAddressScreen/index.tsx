import React from 'react';
import { View } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { ScrollScreenTemplate, Input, Button, Text } from '@dawwar/ui';
import { useTheme } from '@dawwar/theme';
import { space } from '@dawwar/theme';
import { MapPickerModal } from '../../../custom-order/components/MapPickerModal';
import { useController } from './useController';

export function AddAddressScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const ctrl = useController();

  return (
    <>
      <ScrollScreenTemplate
        headerProps={{ title: ctrl.editId ? t('addresses.update_address') : t('addresses.add') }}
        footer={
          <Button
            label={ctrl.editId ? t('addresses.update_address') : t('addresses.save_address')}
            onPress={ctrl.handleSave}
            loading={ctrl.isLoading}
            disabled={ctrl.isButtonDisabled}
            fullWidth
            style={{ margin: space.base }}
          />
        }
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ padding: space.base, gap: space.md }}>
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
