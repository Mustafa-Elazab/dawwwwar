import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { ScreenTemplate, Input, Button, Icon, AnimatedPressable } from '@dawwar/ui';
import { useTheme } from '@dawwar/theme';
import FastImage from 'react-native-fast-image';
import { launchImageLibrary } from 'react-native-image-picker';
import { useController } from './useController';
import { createStyles } from './styles';

export function CompleteProfileScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const ctrl = useController();
  const [avatarUri, setAvatarUri] = React.useState<string | null>(null);

  const handlePickAvatar = React.useCallback(async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
      selectionLimit: 1,
    });

    const picked = result.assets?.[0]?.uri;
    if (picked) {
      setAvatarUri(picked);
    }
  }, []);

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
          <AnimatedPressable style={styles.avatarWrap} onPress={handlePickAvatar} pressTranslateY={1}>
            {avatarUri ? (
              <FastImage source={{ uri: avatarUri }} style={styles.avatarImage} resizeMode={FastImage.resizeMode.cover} />
            ) : (
              <Icon name="camera" size={28} color="#1DB954" />
            )}
          </AnimatedPressable>

          <Input
            label={t('auth.name_label')}
            placeholder={t('auth.name_placeholder')}
            value={ctrl.name}
            onChangeText={ctrl.setName}
            error={ctrl.nameError ?? undefined}
            autoFocus
          />

          {__DEV__ ? (
            <AnimatedPressable
              style={styles.devFillBtn}
              onPress={() => ctrl.setName(t('auth.name_label'))}
              pressTranslateY={1}
            >
              <Icon name="flash" size={16} color={colors.primary} />
            </AnimatedPressable>
          ) : null}

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
