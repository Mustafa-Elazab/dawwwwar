import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ScreenTemplate, Header, Text } from '@dawwar/ui';
import { useTheme } from '@dawwar/theme';
import { ThemeMode } from '@dawwar/types';
import { useController } from './useController';
import { createStyles } from './styles';

const MODES = [
  { value: ThemeMode.LIGHT, icon: '☀️', labelKey: 'appearance.light' },
  { value: ThemeMode.DARK, icon: '🌙', labelKey: 'appearance.dark' },
  { value: ThemeMode.SYSTEM, icon: '📱', labelKey: 'appearance.system', subtitleKey: 'appearance.system_sub' },
] as const;

export function AppearanceScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const ctrl = useController();

  return (
    <ScreenTemplate
      edges={['top', 'bottom']}
      header={<Header title={ctrl.t('appearance.title')} leftAction={{ icon: 'arrow-left', onPress: ctrl.handleBack }} />}
    >
      <View style={styles.card}>
        {MODES.map((mode, idx) => (
          <TouchableOpacity
            key={mode.value}
            style={[styles.optionRow, idx === MODES.length - 1 && { borderBottomWidth: 0 }]}
            onPress={() => ctrl.handleSelect(mode.value)}
          >
            <View style={styles.optionLeft}>
              <Text style={styles.flag}>{mode.icon}</Text>
              <View>
                <Text style={styles.optionLabel}>{ctrl.t(mode.labelKey)}</Text>
                {'subtitleKey' in mode && (
                  <Text variant="caption" color={colors.textSecondary}>{ctrl.t(mode.subtitleKey)}</Text>
                )}
              </View>
            </View>
            <View style={[styles.radio, ctrl.currentMode === mode.value && styles.radioSelected]}>
              {ctrl.currentMode === mode.value && <View style={styles.radioDot} />}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScreenTemplate>
  );
}
