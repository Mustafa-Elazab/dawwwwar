import { i18n, updateLanguage, type AppLanguage } from '@dawwar/i18n';
import { useTranslation } from '@dawwar/i18n';

import type { Phase1PlannerController } from '../../planner/hooks/usePhase1Planner';
import { confirmAction } from '../../planner/utils/helpers';

export function useController(appController: Phase1PlannerController) {
  const { t } = useTranslation();
  const language = (i18n.language === 'en' ? 'en' : 'ar') as AppLanguage;

  const openPro = () => {
    if (appController.state.isPro) {
      appController.restorePurchase();
      return;
    }

    appController.navigate('ProUpgradeScreen', { from: 'SettingsScreen' });
  };

  const clearAllData = () => {
    confirmAction(
      t('farha.phase1.confirm.clearAllData'),
      appController.clearAllData,
      t('farha.phase1.confirm.cancel'),
      t('farha.phase1.confirm.ok'),
    );
  };

  return {
    language,
    notificationsEnabled: appController.state.notificationsEnabled,
    isPro: appController.state.isPro,
    setArabic: () => void updateLanguage('ar'),
    setEnglish: () => void updateLanguage('en'),
    setNotificationsEnabled: appController.setNotificationsEnabled,
    openPro,
    clearAllData,
  };
}
