import React from 'react';
import { View } from 'react-native';
import { ScrollScreenTemplate, Header, Input, Button, Text } from '@dawwar/ui';
import { useTheme } from '@dawwar/theme';
import { space } from '@dawwar/theme';
import { MapPickerModal } from '../../../custom-order/components/MapPickerModal';
import { useController } from './useController';

export function AddAddressScreen() {
  const { colors } = useTheme();
  const ctrl = useController();

  return (
    <>
      <ScrollScreenTemplate
        header={<Header title={ctrl.t('addresses.add')} leftAction={{ icon: 'arrow-left', onPress: ctrl.handleBack }} />}
        edges={['bottom']}
        footer={
          <Button
            label={ctrl.t('addresses.save_address')}
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
          <Input label={ctrl.t('addresses.label_label')} value={ctrl.label} onChangeText={ctrl.setLabel} />
          <Input
            label={ctrl.t('addresses.address_label')}
            value={ctrl.address}
            onChangeText={ctrl.setAddress}
            rightIcon={
              <Text variant="label" color={colors.primary} onPress={() => ctrl.setShowMap(true)}>
                {ctrl.t('custom_order.pick_on_map')}
              </Text>
            }
          />
          <Input label={ctrl.t('addresses.phone_label')} value={ctrl.phone} onChangeText={ctrl.setPhone} keyboardType="phone-pad" />
          <Input label={ctrl.t('addresses.notes_label')} value={ctrl.notes} onChangeText={ctrl.setNotes} placeholder={ctrl.t('addresses.notes_placeholder')} multiline />
        </View>
      </ScrollScreenTemplate>

      <MapPickerModal
        visible={ctrl.showMap}
        onConfirm={ctrl.handleMapConfirm}
        onClose={() => ctrl.setShowMap(false)}
      />
    </>
  );
}
