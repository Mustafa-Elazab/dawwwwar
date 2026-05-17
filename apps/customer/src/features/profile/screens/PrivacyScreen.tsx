import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { ScrollScreenTemplate, Text, Divider } from '@dawwar/ui';
import { useTheme, space, typography } from '@dawwar/theme';

export function PrivacyScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <ScrollScreenTemplate
      headerProps={{ title: t('privacy.title') }}
      contentStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{t('privacy.title')}</Text>
        <Text style={styles.lastUpdated}>{t('common.today')}</Text>
      </View>

      <Divider />

      <View style={styles.section}>
        <Text style={styles.paragraph}>
          {t('privacy.content')}
        </Text>
      </View>
    </ScrollScreenTemplate>
  );
}
const styles = StyleSheet.create({
  content: {
    padding: space.lg,
    paddingBottom: space['3xl'],
  },
  header: {
    marginBottom: space.lg,
  },
  title: {
    ...typography.h2,
    marginBottom: space.xs,
    alignSelf:"flex-start",
    textAlign:"auto",
  },
  lastUpdated: {
    ...typography.caption,
    color: '#888',
    alignSelf:"flex-start"
  },
  section: {
    marginVertical: space.md,
  },
  sectionTitle: {
    ...typography.h4,
    marginBottom: space.sm,
  },
  paragraph: {
    ...typography.body1,
    lineHeight: 24,
    color: '#444',
      alignSelf:"flex-start",
      textAlign:"auto",
  },
  bold: {
    fontWeight: '700',
  },
});
