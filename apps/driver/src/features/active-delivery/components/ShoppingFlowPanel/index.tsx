import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import { useTheme } from '@dawwar/theme';
import { Text, Icon, Button } from '@dawwar/ui';
import { useTranslation } from '@dawwar/i18n';
import { createStyles } from './styles';
import type { ShoppingFlowPanelProps } from './types';

const MAX_PHOTOS = 5;
const OVERBUDGET_THRESHOLD = 1.2; // 20% over estimate triggers warning

export function ShoppingFlowPanel({
  estimatedBudget,
  onPhotosCapture,
  onSendPhotos,
  onActualAmountConfirm,
  isLoading,
  photosSent,
}: ShoppingFlowPanelProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();

  const [photos, setPhotos] = useState<string[]>([]);
  const [actualAmount, setActualAmount] = useState('');
  const [receiptUri, setReceiptUri] = useState<string | null>(null);

  const budget = parseFloat(actualAmount);
  const isOverBudget = !isNaN(budget) && budget > estimatedBudget * OVERBUDGET_THRESHOLD;
  const canConfirm = !isNaN(budget) && budget > 0 && receiptUri !== null;

  const addPhoto = () => {
    launchCamera({ mediaType: 'photo', quality: 0.7 }, (res) => {
      if (res.assets?.[0]?.uri) {
        const newPhotos = [...photos, res.assets[0].uri!];
        setPhotos(newPhotos);
        onPhotosCapture(newPhotos);
      }
    });
  };

  const captureReceipt = () => {
    launchCamera({ mediaType: 'photo', quality: 0.8 }, (res) => {
      if (res.assets?.[0]?.uri) {
        setReceiptUri(res.assets[0].uri!);
      }
    });
  };

  return (
    <View style={styles.container}>

      {/* Step 1 — Capture items photos */}
      <View>
        <Text style={styles.stepTitle}>{t('driver.photo_items')}</Text>
        <Text style={styles.stepSubtitle}>
          {t('custom_order.photos_count', { count: photos.length })}/{MAX_PHOTOS}
        </Text>
        <View style={styles.photoGrid}>
          {photos.map((_, i) => (
            <View key={i} style={[styles.photoThumb, styles.photoThumbFilled]}>
              <Icon name="image-check" size={24} color={colors.primary} />
            </View>
          ))}
          {photos.length < MAX_PHOTOS && (
            <TouchableOpacity style={styles.photoThumb} onPress={addPhoto}>
              <Icon name="camera-plus-outline" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
        {photos.length > 0 && !photosSent && (
          <Button
            label={t('driver.photo_items')}
            onPress={onSendPhotos}
            variant="outline"
            size="sm"
            style={{ marginTop: 8 }}
          />
        )}
        {photosSent && (
          <Text variant="caption" color={colors.success}>✓ Photos sent to customer</Text>
        )}
      </View>

      {/* Step 2 — Enter actual total */}
      <View>
        <Text style={styles.stepTitle}>{t('driver.actual_amount')}</Text>
        <Text style={styles.stepSubtitle}>
          Estimated: {estimatedBudget} {t('common.egp')}
        </Text>
        <View style={styles.amountRow}>
          <TextInput
            style={styles.amountInput}
            value={actualAmount}
            onChangeText={setActualAmount}
            placeholder={t('driver.actual_amount_placeholder')}
            placeholderTextColor={colors.placeholder}
            keyboardType="numeric"
          />
          <Text style={styles.amountSuffix}>{t('common.egp')}</Text>
        </View>
        {isOverBudget && (
          <View style={styles.warningBox}>
            <Icon name="alert" size={16} color={colors.warning} />
            <Text style={styles.warningText}>
              Amount is over 20% above estimate. Customer approval may be needed.
            </Text>
          </View>
        )}
      </View>

      {/* Step 3 — Receipt photo */}
      <View>
        <Text style={styles.stepTitle}>{t('driver.photo_receipt')}</Text>
        <Button
          label={receiptUri ? '✓ Receipt captured' : t('driver.photo_receipt')}
          onPress={captureReceipt}
          variant={receiptUri ? 'secondary' : 'outline'}
          size="sm"
        />
      </View>

      {/* Confirm button */}
      <Button
        label={t('driver.items_purchased')}
        onPress={() => canConfirm && onActualAmountConfirm(budget, receiptUri!)}
        disabled={!canConfirm}
        loading={isLoading}
        fullWidth
      />
    </View>
  );
}
