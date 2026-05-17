import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch } from '../../../../store/hooks';
import { updateUser } from '../../../../store/slices/auth.slice';
import { useTranslation } from '@dawwar/i18n';
import { ScreenTemplate, Text, Input, Button } from '@dawwar/ui';
import { space, radius } from '@dawwar/theme';

export function CompleteProfileScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setError(t('merchant.completeProfile.nameError'));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // In a real app, this would be an API call to update user profile
      // For now, we simulate success and update local state
      dispatch(updateUser({ name: trimmed }));
      // RootNavigator will re-render and move to the next stage
    } catch {
      setError(t('merchant.common.errorTryAgain'));
    } finally {
      setIsLoading(false);
    }
  }, [name, dispatch, t]);

  return (
    <ScreenTemplate edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.content}>
          <Text variant="h2" style={styles.title}>{t('merchant.completeProfile.title')}</Text>
          <Text variant="body1" style={styles.subtitle}>{t('merchant.completeProfile.subtitle')}</Text>

          <Input
            label={t('merchant.completeProfile.namePlaceholder')}
            value={name}
            onChangeText={(text) => {
              setName(text);
              setError(null);
            }}
            placeholder={t('merchant.completeProfile.namePlaceholder')}
            error={error ?? undefined}
          />

          <View style={styles.spacer} />

          <Button
            label={t('merchant.completeProfile.submit')}
            onPress={handleSubmit}
            loading={isLoading}
            disabled={isLoading || name.trim().length < 2}
            fullWidth
            style={styles.button}
          />
        </View>
      </KeyboardAvoidingView>
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: space.xl, justifyContent: 'center' },
  title: { marginBottom: space.sm, textAlign: 'center' },
  subtitle: { color: 'rgba(0,0,0,0.6)', marginBottom: space['2xl'], textAlign: 'center' },
  spacer: { flex: 1 },
  button: {
    height: 56,
    borderRadius: radius.lg,
  },
});
