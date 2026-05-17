import React, { useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { ScreenTemplate, Text } from '@dawwar/ui';
import { useTheme } from '@dawwar/theme';
import { Language } from '@dawwar/types';
import { useController } from './useController';
import { createStyles } from './styles';

const LANGUAGES = [
  { value: Language.AR, flag: '🇪🇬', label: 'العربية' },
  { value: Language.EN, flag: '🇬🇧', label: 'English' },
] as const;

export function LanguageScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const ctrl = useController();

  return (
    <ScreenTemplate
      headerProps={{ title: t('language.title') }}
    >
      <View style={styles.card}>
        {LANGUAGES.map((lang, idx) => (
          <TouchableOpacity
            key={lang.value}
            style={[styles.optionRow, idx === LANGUAGES.length - 1 && { borderBottomWidth: 0 }]}
            onPress={() => ctrl.handleSelect(lang.value)}
          >
            <View style={styles.optionLeft}>
              <Text style={styles.flag}>{lang.flag}</Text>
              <Text style={styles.optionLabel}>{lang.label}</Text>
            </View>
            <View style={[styles.radio, ctrl.currentLanguage === lang.value && styles.radioSelected]}>
              {ctrl.currentLanguage === lang.value && <View style={styles.radioDot} />}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScreenTemplate>
  );
}
