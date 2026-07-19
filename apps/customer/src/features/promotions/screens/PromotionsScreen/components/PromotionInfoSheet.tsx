import React from 'react';
import { View } from 'react-native';
import { Icon, ModalSheetTemplate, Text } from '@dawwar/ui';
import type { AppColors } from '@dawwar/theme';
import type { PromotionItem } from '../useController';
import type { createStyles } from '../styles';

interface PromotionInfoSheetProps {
  promotion: PromotionItem | null;
  visible: boolean;
  colors: AppColors;
  styles: ReturnType<typeof createStyles>;
  labels: {
    information: string;
    description: string;
    duration: string;
    promoCode: string;
    applicableScope: string;
    discountAmount: string;
    terms: string;
    close: string;
  };
  onClose: () => void;
}

function Detail({
  label,
  value,
  styles,
}: {
  label: string;
  value: string;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <View>
      <Text style={styles.detailLabel}>{label} :</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

export function PromotionInfoSheet({
  promotion,
  visible,
  colors,
  styles,
  labels,
  onClose,
}: PromotionInfoSheetProps) {
  if (!promotion) return null;

  return (
    <ModalSheetTemplate
      visible={visible}
      title={labels.information}
      onClose={onClose}
      closeLabel={labels.close}
      maxHeight="86%"
    >
      <View style={styles.sheetContent}>
        <View style={styles.sheetIconWrap}>
          <Icon name="ticket-percent" size={58} color={colors.warning} />
        </View>
        <Text style={styles.sheetTitle}>{promotion.title}</Text>
        <View style={styles.sheetDetails}>
          <Detail label={labels.description} value={promotion.description} styles={styles} />
          <Detail label={labels.duration} value={promotion.duration} styles={styles} />
          <Detail label={labels.promoCode} value={promotion.code} styles={styles} />
          <Detail label={labels.applicableScope} value={promotion.scope} styles={styles} />
          <Detail label={labels.discountAmount} value={promotion.discountAmount} styles={styles} />
          <Detail label={labels.terms} value={promotion.terms} styles={styles} />
        </View>
      </View>
    </ModalSheetTemplate>
  );
}
