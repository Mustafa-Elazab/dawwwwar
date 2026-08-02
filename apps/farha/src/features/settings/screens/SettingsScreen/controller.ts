import { i18n, updateLanguage, type AppLanguage } from '@dawwar/i18n';
import { useTranslation } from '@dawwar/i18n';
import { useState } from 'react';

import { usePlannerController } from '../../../planner/context/PlannerControllerContext';
import { confirmAction } from '../../../planner/utils/helpers';

export function useController() {
  const appController = usePlannerController();
  const { t } = useTranslation();
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);
  const language = (i18n.language === 'en' ? 'en' : 'ar') as AppLanguage;

  const changeLanguage = async (nextLanguage: AppLanguage) => {
    if (isChangingLanguage || language === nextLanguage) return;

    setIsChangingLanguage(true);
    try {
      await updateLanguage(nextLanguage);
    } finally {
      setIsChangingLanguage(false);
    }
  };

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
    isChangingLanguage,
    setArabic: () => void changeLanguage('ar'),
    setEnglish: () => void changeLanguage('en'),
    setNotificationsEnabled: appController.setNotificationsEnabled,
    openPro,
    clearAllData,
  };
}
