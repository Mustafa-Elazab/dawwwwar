import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ScreenTemplate, Header, Text } from '@dawwar/ui';
import { useTranslation } from '@dawwar/i18n';
import { space } from '@dawwar/theme';

export function PrivacyScreen() {
  const { t } = useTranslation();

  return (
    <ScreenTemplate edges={['top', 'bottom']}>
      <Header title={t('auth.privacy_link')} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="h2" style={styles.title}>{t('auth.privacy_link')}</Text>
        <Text variant="body1" style={styles.body}>
          {`نحن نهتم بخصوصيتك. توضح هذه السياسة كيفية جمعنا واستخدامنا لبياناتك...

1. البيانات التي نجمعها
نجمع رقم الهاتف والموقع الجغرافي واسم المتجر لتقديم خدماتنا.

2. كيف نستخدم بياناتك
نستخدم بياناتك لتسهيل عملية التوصيل وتحسين تجربة المستخدم.

3. مشاركة البيانات
لا نشارك بياناتك مع أطراف ثالثة إلا في حدود ما يتطلبه القانون أو لإتمام عملية التوصيل.`}
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
