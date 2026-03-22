import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@dawwar/theme';
import { Text } from '@dawwar/ui';
import { space } from '@dawwar/theme';
import { useTranslation } from '@dawwar/i18n';

interface SectionHeaderProps {
  title: string;
  onSeeAll?: () => void;
}

export function SectionHeader({ title, onSeeAll }: SectionHeaderProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View
      style={[styles.row, { paddingHorizontal: space.base, marginBottom: space.md }]}
    >
      <Text variant="h4" color={colors.text}>
        {title}
      </Text>
      {onSeeAll != null && (
        <TouchableOpacity onPress={onSeeAll}>
          <Text variant="label" color={colors.primary}>
            {t('home.see_all')}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
