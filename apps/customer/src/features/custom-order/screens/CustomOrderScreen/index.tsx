import React, { useMemo } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { ScreenTemplate, Text, Button, Icon } from '@dawwar/ui';
import { space, useTheme } from '@dawwar/theme';
import RTLTextInput from '../../../../components/RTLTextInput';
import { VoiceRecorder } from '../../components/VoiceRecorder';
import { PhotoGrid } from '../../components/PhotoGrid';
import { MapPickerModal } from '../../components/MapPickerModal';
import { useController } from './useController';
import { createStyles } from './styles';

function Section({ 
  icon, 
  title, 
  subtitle, 
  children 
}: { 
  icon: string, 
  title: string, 
  subtitle?: string, 
  children: React.ReactNode 
}) {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconContainer}>
          <Icon name={icon} size={18} color={colors.primary} />
        </View>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
      {children}
    </View>
  );
}

function StyledInput({ 
  icon, 
  placeholder, 
  value, 
  onChangeText, 
  error 
}: { 
  icon: string, 
  placeholder: string, 
  value: string, 
  onChangeText: (t: string) => void,
  error?: string
}) {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.inputContainer}>
      <View style={[styles.styledInput, error ? { borderColor: colors.error } : null]}>
        <RTLTextInput
          style={styles.inputField}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder}
        />
        <Icon name={icon} size={20} color={colors.textDisabled}  />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

export function CustomOrderScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const ctrl = useController();

  return (
    <View style={styles.container}>
      <ScreenTemplate
        headerProps={{ title: t('custom_order.title') }}
        footer={
          <View style={styles.stickyFooter}>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Icon name={ctrl.shopAddress ? "check-circle" : "circle-outline"} size={16} color={ctrl.shopAddress ? colors.success : colors.textDisabled} />
                <Text style={[styles.summaryText, { color: ctrl.shopAddress ? colors.text : colors.textDisabled }]}>{t('custom_order.summary_address')}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Icon name={(ctrl.textDescription || ctrl.voiceUri) ? "check-circle" : "circle-outline"} size={16} color={(ctrl.textDescription || ctrl.voiceUri) ? colors.success : colors.textDisabled} />
                <Text style={[styles.summaryText, { color: (ctrl.textDescription || ctrl.voiceUri) ? colors.text : colors.textDisabled }]}>{t('custom_order.summary_description')}</Text>
              </View>
            </View>
            <Button
              label={ctrl.isLoading ? t('custom_order.placing') : t('custom_order.place_order')}
              onPress={ctrl.handleSubmit}
              loading={ctrl.isLoading}
              fullWidth
              style={styles.submitBtn}
            />
          </View>
        }
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Section 1: Shop Location */}
          <Section icon="store" title={t('custom_order.shop_section')}>
            <TouchableOpacity style={styles.mapCard} onPress={() => ctrl.setShowMapPicker(true)} activeOpacity={0.85}>
              <View style={styles.mapIcon}>
                <Icon name="map-marker-radius-outline" size={28} color={colors.primary} />
              </View>
              <View style={styles.mapText}>
                <Text style={styles.mapTitle}>{t('custom_order.shop_location_title')}</Text>
                <Text style={styles.mapSubtitle} numberOfLines={2}>
                  {ctrl.shopAddress || t('custom_order.shop_location_hint')}
                </Text>
              </View>
              <Icon name="chevron-right" size={22} color={colors.textTertiary} />
            </TouchableOpacity>

            <StyledInput
              icon="store-outline"
              placeholder={t('custom_order.shop_name_placeholder')}
              value={ctrl.shopName}
              onChangeText={ctrl.setShopName}
            />
            <StyledInput
              icon="map-marker-outline"
              placeholder={t('custom_order.shop_address_placeholder')}
              value={ctrl.shopAddress}
              onChangeText={ctrl.setShopAddress}
              error={ctrl.errors.shopAddress}
            />
          </Section>

          {/* Section 2: What to Buy */}
          <Section 
            icon="clipboard-list-outline" 
            title={t('custom_order.items_section')}
            subtitle={t('custom_order.items_hint')}
          >
            <RTLTextInput
              style={styles.textArea}
              value={ctrl.textDescription}
              onChangeText={ctrl.setTextDescription}
              placeholder={t('custom_order.text_placeholder')}
              placeholderTextColor={colors.placeholder}
              multiline
              numberOfLines={4}
            />

            <View style={styles.itemsDivider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>{t('common.or').toUpperCase()}</Text>
              <View style={styles.dividerLine} />
            </View>

            <VoiceRecorder
              uri={ctrl.voiceUri}
              onRecorded={ctrl.handleVoiceRecorded}
              onClear={ctrl.handleVoiceClear}
            />

            <View style={styles.itemsDivider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>{t('common.or').toUpperCase()}</Text>
              <View style={styles.dividerLine} />
            </View>

            <PhotoGrid
              photos={ctrl.photos}
              onAdd={ctrl.handleAddPhoto}
              onRemove={ctrl.handleRemovePhoto}
            />
            {ctrl.errors.items ? <Text style={styles.errorText}>{ctrl.errors.items}</Text> : null}
          </Section>

          {/* Section 3: Budget & Payment */}
          <Section icon="cash-multiple" title={t('custom_order.budget_section')}>
            <Text style={styles.sectionSubtitle}>{t('custom_order.budget_label')}</Text>
            <View style={[styles.budgetRow, (ctrl.errors.budget || ctrl.errors.payment) ? { borderColor: colors.error } : null]}>
              <RTLTextInput
                style={styles.budgetInput}
                value={ctrl.budget}
                onChangeText={ctrl.setBudget}
                placeholder={t('custom_order.budget_placeholder')}
                placeholderTextColor={colors.placeholder}
                keyboardType="numeric"
              />
              <Text style={styles.budgetSuffix}>{t('common.egp')}</Text>
            </View>

            {/* Payment method */}
            <View style={{ marginTop: space.sm }}>
              {(['CASH', 'WALLET'] as const).map((method) => (
                <TouchableOpacity
                  key={method}
                  style={styles.paymentRow}
                  onPress={() => ctrl.setPaymentMethod(method)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.radio, ctrl.paymentMethod === method && styles.radioSelected]}>
                    {ctrl.paymentMethod === method && <View style={styles.radioDot} />}
                  </View>
                  <Text variant="label" color={colors.text}>
                {method === 'CASH' ? t('checkout.cash') : t('checkout.wallet')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {ctrl.errors.budget ? <Text style={styles.errorText}>{ctrl.errors.budget}</Text> : null}
            {ctrl.errors.payment ? <Text style={styles.errorText}>{ctrl.errors.payment}</Text> : null}
          </Section>

        </ScrollView>
      </ScreenTemplate>

      {/* Map picker modal */}
      <MapPickerModal
        visible={ctrl.showMapPicker}
        initialLatitude={ctrl.shopLat}
        initialLongitude={ctrl.shopLng}
        onConfirm={ctrl.handleMapConfirm}
        onClose={() => ctrl.setShowMapPicker(false)}
      />
    </View>
  );
}
