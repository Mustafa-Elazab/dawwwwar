import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text, Icon } from '@dawwar/ui';
import { ProductModifierGroupType, type ModifierGroup } from '@dawwar/types';
import type { ProductDetailStyles } from '../styles';

interface ModifierGroupSectionProps {
  group: ModifierGroup;
  selectedOptionIds: string[];
  labels: {
    required: string;
    optional: string;
    chooseOne: string;
    chooseUpTo: string;
  };
  styles: ProductDetailStyles;
  isRTL: boolean;
  onToggleOption: (optionId: string) => void;
}

export function ModifierGroupSection({
  group,
  selectedOptionIds,
  labels,
  styles,
  isRTL,
  onToggleOption,
}: ModifierGroupSectionProps) {
  const isSingle = group.type === ProductModifierGroupType.SINGLE;
  const helper = isSingle
    ? labels.chooseOne
    : group.max
      ? `${labels.chooseUpTo} ${group.max}`
      : labels.optional;

  return (
    <View style={styles.optionSection}>
      <View style={styles.optionHeader}>
        <View style={styles.optionTitleBlock}>
          <Text style={styles.optionTitle}>{isRTL ? group.nameAr || group.name : group.name || group.nameAr}</Text>
          <Text style={styles.optionHelper}>{helper}</Text>
        </View>
        <View style={group.required ? styles.requiredPill : styles.optionalPill}>
          <Text style={group.required ? styles.requiredPillText : styles.optionalPillText}>
            {group.required ? labels.required : labels.optional}
          </Text>
        </View>
      </View>

      {group.options.map((option) => {
        const selected = selectedOptionIds.includes(option.id);
        const disabled = option.isAvailable === false;
        return (
          <TouchableOpacity
            key={option.id}
            style={[styles.optionRow, selected && styles.optionRowSelected, disabled && styles.optionRowDisabled]}
            onPress={() => !disabled && onToggleOption(option.id)}
            activeOpacity={0.85}
          >
            <View style={styles.optionTextBlock}>
              <Text style={styles.optionName}>
                {isRTL ? option.nameAr || option.name : option.name || option.nameAr}
              </Text>
              {Number(option.priceDelta || 0) > 0 ? (
                <Text style={styles.optionPrice}>+{Number(option.priceDelta).toFixed(2)}</Text>
              ) : null}
            </View>
            <View style={[styles.optionControl, selected && styles.optionControlSelected]}>
              {selected ? (
                <Icon name="check" size={14} color={styles.tokens.primaryText} />
              ) : null}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
