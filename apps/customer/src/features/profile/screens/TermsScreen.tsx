import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { ScrollScreenTemplate, Text, Divider } from '@dawwar/ui';
import { useTheme, space, typography } from '@dawwar/theme';

export function TermsScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const dynamicStyles = React.useMemo(
    () => ({
      lastUpdated: { color: colors.textSecondary },
      paragraph: { color: colors.textSecondary },
    }),
    [colors],
  );

  return (
    <ScrollScreenTemplate headerProps={{ title: t('terms.title') }} contentStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('terms.title')}</Text>
        <Text style={[styles.lastUpdated, dynamicStyles.lastUpdated]}>{t('common.today')}</Text>
      </View>

      <Divider />

      <View style={styles.section}>
        <Text style={[styles.paragraph, dynamicStyles.paragraph]}>{t('terms.content')}</Text>
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
    alignSelf: 'flex-start',
  },
  lastUpdated: {
    ...typography.caption,
    alignSelf: 'flex-start',
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
    alignSelf: 'flex-start',
    textAlign: 'auto',
  },
});
