import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { ScrollScreenTemplate, Header, Text, Input, Button } from '@dawwar/ui';
import { useTheme } from '@dawwar/theme';
import { VoiceRecorder } from '../../components/VoiceRecorder';
import { PhotoGrid } from '../../components/PhotoGrid';
import { MapPickerModal } from '../../components/MapPickerModal';
import { useController } from './useController';
import { createStyles } from './styles';

function OrLabel({ label }: { label: string }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  return (
    <View style={styles.itemsDivider}>
      <View style={styles.dividerLine} />
      <Text style={styles.dividerText}>{label}</Text>
      <View style={styles.dividerLine} />
    </View>
  );
}

export function CustomOrderScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const ctrl = useController();

  return (
    <>
      <ScrollScreenTemplate
        header={
          <Header
            title={ctrl.t('custom_order.title')}
            leftAction={{ icon: 'arrow-left', onPress: ctrl.handleBack }}
          />
        }
        edges={['bottom']}
        keyboardShouldPersistTaps="handled"
      >

        {/* ── Section 1: Shop Location ──────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{ctrl.t('custom_order.shop_section')}</Text>
          <Input
            label={ctrl.t('custom_order.shop_name_label')}
            value={ctrl.shopName}
            onChangeText={ctrl.setShopName}
            placeholder={ctrl.t('custom_order.shop_name_placeholder')}
          />
          <Input
            label={ctrl.t('custom_order.shop_address_label')}
            value={ctrl.shopAddress}
            onChangeText={ctrl.setShopAddress}
            placeholder={ctrl.t('custom_order.shop_address_placeholder')}
            error={ctrl.errors.shopAddress}
            rightIcon={
              <TouchableOpacity onPress={() => ctrl.setShowMapPicker(true)}>
                <Text style={styles.mapPickerText}>{ctrl.t('custom_order.pick_on_map')}</Text>
              </TouchableOpacity>
            }
          />
        </View>

        {/* ── Section 2: What to Buy ─────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{ctrl.t('custom_order.items_section')}</Text>
          <Text style={styles.sectionSubtitle}>{ctrl.t('custom_order.items_hint')}</Text>

          <TextInput
            style={styles.textArea}
            value={ctrl.textDescription}
            onChangeText={ctrl.setTextDescription}
            placeholder={ctrl.t('custom_order.text_placeholder')}
            placeholderTextColor={colors.placeholder}
            multiline
            numberOfLines={4}
          />

          <OrLabel label={ctrl.t('common.or')} />

          <VoiceRecorder
            uri={ctrl.voiceUri}
            onRecorded={ctrl.handleVoiceRecorded}
            onClear={ctrl.handleVoiceClear}
          />

          <OrLabel label={ctrl.t('common.or')} />

          <PhotoGrid
            photos={ctrl.photos}
            onAdd={ctrl.handleAddPhoto}
            onRemove={ctrl.handleRemovePhoto}
          />

          {ctrl.errors.items && (
            <Text style={styles.errorText}>{ctrl.errors.items}</Text>
          )}
        </View>

        {/* ── Section 3: Budget ────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{ctrl.t('custom_order.budget_section')}</Text>
          <Text style={styles.sectionSubtitle}>{ctrl.t('custom_order.budget_label')}</Text>

          <View style={styles.budgetRow}>
            <TextInput
              style={styles.budgetInput}
              value={ctrl.budget}
              onChangeText={ctrl.setBudget}
              placeholder={ctrl.t('custom_order.budget_placeholder')}
              placeholderTextColor={colors.placeholder}
              keyboardType="numeric"
            />
            <Text style={styles.budgetSuffix}>{ctrl.t('common.egp')}</Text>
          </View>

          {ctrl.errors.budget && (
            <Text style={styles.errorText}>{ctrl.errors.budget}</Text>
          )}

          {/* Payment method */}
          {(['CASH', 'WALLET'] as const).map((method) => (
            <TouchableOpacity
              key={method}
              style={styles.paymentRow}
              onPress={() => ctrl.setPaymentMethod(method)}
            >
              <View style={[styles.radio, ctrl.paymentMethod === method && styles.radioSelected]}>
                {ctrl.paymentMethod === method && <View style={styles.radioDot} />}
              </View>
              <Text variant="label" color={colors.text}>
                {method === 'CASH' ? ctrl.t('checkout.cash') : ctrl.t('checkout.wallet')}
              </Text>
            </TouchableOpacity>
          ))}

          {ctrl.errors.payment && (
            <Text style={styles.errorText}>{ctrl.errors.payment}</Text>
          )}
        </View>

        {/* Submit button */}
        <Button
          label={ctrl.isLoading ? ctrl.t('custom_order.placing') : ctrl.t('custom_order.place_order')}
          onPress={ctrl.handleSubmit}
          loading={ctrl.isLoading}
          fullWidth
          style={styles.submitBtn}
        />
      </ScrollScreenTemplate>

      {/* Map picker modal */}
      <MapPickerModal
        visible={ctrl.showMapPicker}
        initialLatitude={30.8704}
        initialLongitude={31.4741}
        onConfirm={ctrl.handleMapConfirm}
        onClose={() => ctrl.setShowMapPicker(false)}
      />
    </>
  );
}
