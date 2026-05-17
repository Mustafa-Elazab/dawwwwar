import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ScreenTemplate, Header, Text } from '@dawwar/ui';
import { useTranslation } from '@dawwar/i18n';
import { space } from '@dawwar/theme';

export function TermsScreen() {
  const { t } = useTranslation();

  return (
    <ScreenTemplate edges={['top', 'bottom']}>
      <Header title={t('auth.terms_link')} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="h2" style={styles.title}>{t('auth.terms_link')}</Text>
        <Text variant="body1" style={styles.body}>
          {`منصة دوار هي منصة توصيل طلبات تربط بين العملاء والتجار والسائقين...

1. الاستخدام المقبول
يجب استخدام المنصة وفقاً للشروط والقوانين المعمول بها في جمهورية مصر العربية.

2. الخصوصية
نلتزم بحماية بياناتك الشخصية وفقاً لسياسة الخصوصية المعتمدة.

3. العمولات والمدفوعات
تُخصم عمولة المنصة تلقائياً من كل طلب مكتمل.

4. إلغاء الطلبات
يحق للتاجر رفض الطلب في حالات محددة مع إعادة المبلغ كاملاً للعميل.`}
        </Text>
      </ScrollView>
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  content: { padding: space.xl, paddingBottom: space['4xl'] },
  title: { marginBottom: space.lg },
  body: { lineHeight: 26, color: 'rgba(0,0,0,0.7)' },
});
