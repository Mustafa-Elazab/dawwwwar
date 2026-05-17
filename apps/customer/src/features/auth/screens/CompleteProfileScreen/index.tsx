import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { ScreenTemplate, Text, Input, Button } from '@dawwar/ui';
import { useTheme } from '@dawwar/theme';
import { useController } from './useController';
import { createStyles } from './styles';

export function CompleteProfileScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const ctrl = useController();

  return (
    <ScreenTemplate
      headerProps={{
        title: t('auth.complete_profile_title'),
        subtitle: t('auth.complete_profile_subtitle'),
        type: 'none',
      }}
    >
      <View style={styles.container}>
        <View style={styles.form}>
          <Input
            label={t('auth.name_label')}
            placeholder={t('auth.name_placeholder')}
            value={ctrl.name}
            onChangeText={ctrl.setName}
            error={ctrl.nameError ?? undefined}
            autoFocus
          />

          <View style={styles.spacer} />

          <Button
            label={t('common.save')}
            onPress={ctrl.handleSave}
            loading={ctrl.isLoading}
            disabled={!ctrl.name.trim() || ctrl.isLoading}
            fullWidth
          />
        </View>
      </View>
    </ScreenTemplate>
  );
}
