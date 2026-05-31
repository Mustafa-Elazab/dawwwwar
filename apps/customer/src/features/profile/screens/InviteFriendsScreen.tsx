import React from 'react';
import { Linking, Share, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from '@dawwar/i18n';
import { Icon, ScreenTemplate, Text } from '@dawwar/ui';
import { useTheme, radius, shadows, space, typography } from '@dawwar/theme';

const APP_LINK = 'https://dawwar.com/app';

export function InviteFriendsScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const message = t('invite_friends.message', { link: APP_LINK });
  const encodedMessage = encodeURIComponent(message);
  const encodedUrl = encodeURIComponent(APP_LINK);

  const shareNative = () => Share.share({ message, url: APP_LINK });

  const socials = [
    {
      key: 'whatsapp',
      label: 'WhatsApp',
      icon: 'whatsapp',
      onPress: () => Linking.openURL(`whatsapp://send?text=${encodedMessage}`),
    },
    {
      key: 'telegram',
      label: 'Telegram',
      icon: 'send',
      onPress: () => Linking.openURL(`https://t.me/share/url?url=${encodedUrl}&text=${encodedMessage}`),
    },
    {
      key: 'facebook',
      label: 'Facebook',
      icon: 'facebook',
      onPress: () => Linking.openURL(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`),
    },
    {
      key: 'x',
      label: 'X',
      icon: 'alpha-x-circle',
      onPress: () => Linking.openURL(`https://twitter.com/intent/tweet?text=${encodedMessage}`),
    },
  ];

  return (
    <ScreenTemplate
      headerProps={{
        title: t('invite_friends.title'),
        onBackPress: () => navigation.goBack(),
      }}
    >
      <View style={styles.content}>
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Icon name="account-multiple-plus-outline" size={44} color={colors.primary} />
          </View>
          <Text style={styles.title}>{t('invite_friends.heading')}</Text>
          <Text style={styles.subtitle}>{t('invite_friends.body')}</Text>
        </View>

        <TouchableOpacity style={styles.nativeButton} onPress={shareNative} activeOpacity={0.85}>
          <Icon name="share-variant" size={22} color="#fff" />
          <Text style={styles.nativeButtonText}>{t('invite_friends.share_sheet')}</Text>
        </TouchableOpacity>

        <View style={styles.grid}>
          {socials.map((item) => (
            <TouchableOpacity key={item.key} style={styles.socialCard} onPress={item.onPress} activeOpacity={0.85}>
              <View style={styles.socialIcon}>
                <Icon name={item.icon} size={26} color={colors.primary} />
              </View>
              <Text style={styles.socialLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScreenTemplate>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    content: {
      flex: 1,
      padding: space.base,
      gap: space.lg,
    },
    hero: {
      alignItems: 'center',
      paddingVertical: space.xl,
    },
    heroIcon: {
      width: 92,
      height: 92,
      borderRadius: 46,
      backgroundColor: colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: space.base,
    },
    title: {
      ...typography.h3,
      color: colors.text,
      fontWeight: '900',
      textAlign: 'center',
      marginBottom: space.sm,
    },
    subtitle: {
      ...typography.body2,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 21,
    },
    nativeButton: {
      height: 56,
      borderRadius: radius.full,
      backgroundColor: colors.primary,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: space.sm,
      ...shadows.md,
    },
    nativeButtonText: {
      ...typography.body1,
      color: '#fff',
      fontWeight: '900',
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: space.md,
    },
    socialCard: {
      width: '47.5%',
      minHeight: 112,
      borderRadius: radius.lg,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.borderLight,
      alignItems: 'center',
      justifyContent: 'center',
      gap: space.sm,
      ...shadows.sm,
    },
    socialIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    socialLabel: {
      ...typography.label,
      color: colors.text,
      fontWeight: '800',
      textAlign: 'center',
    },
  });
