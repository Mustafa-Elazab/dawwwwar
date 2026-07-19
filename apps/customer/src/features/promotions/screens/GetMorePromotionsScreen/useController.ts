import { useCallback, useMemo } from 'react';
import { I18nManager, Share } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useTranslation } from '@dawwar/i18n';
import { useTheme } from '@dawwar/theme';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { ProfileStackParamList } from '../../../../navigation/types';
import { createStyles } from './styles';

export interface EarnPromotionAction {
  id: string;
  icon: string;
  title: string;
}

export function useController() {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const isRTL = i18n.language.startsWith('ar') || I18nManager.isRTL;
  const styles = useMemo(() => createStyles(colors, isRTL), [colors, isRTL]);
  const navigation = useNavigation<StackNavigationProp<ProfileStackParamList>>();

  const actions = useMemo<EarnPromotionAction[]>(
    () => [
      { id: 'share-app', icon: 'share-variant', title: t('promotions.earn.share_app') },
      { id: 'invite-friends', icon: 'account-group', title: t('promotions.earn.invite_friends') },
      { id: 'complete-purchases', icon: 'shopping', title: t('promotions.earn.complete_purchases') },
      { id: 'watch-ads', icon: 'clapperboard', title: t('promotions.earn.watch_ads') },
      { id: 'participate-events', icon: 'party-popper', title: t('promotions.earn.participate_events') },
      { id: 'complete-profile', icon: 'account-circle', title: t('promotions.earn.complete_profile') },
      { id: 'follow-social', icon: 'chart-donut', title: t('promotions.earn.follow_social') },
      { id: 'take-surveys', icon: 'clipboard-edit', title: t('promotions.earn.take_surveys') },
      { id: 'achieve-levels', icon: 'creation', title: t('promotions.earn.achieve_levels') },
      { id: 'daily-logins', icon: 'cellphone', title: t('promotions.earn.daily_logins') },
    ],
    [t],
  );

  const handleActionPress = useCallback(
    async (action: EarnPromotionAction) => {
      if (action.id === 'share-app' || action.id === 'invite-friends') {
        await Share.share({
          message: t('promotions.share_message'),
        });
        return;
      }

      Toast.show({ type: 'info', text1: t('promotions.earn.coming_soon') });
    },
    [t],
  );

  return {
    colors,
    isRTL,
    styles,
    actions,
    labels: {
      title: t('promotions.get_more_title'),
    },
    handlers: {
      handleBack: () => navigation.goBack(),
      handleActionPress,
    },
  };
}
