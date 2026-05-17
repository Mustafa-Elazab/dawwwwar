import { I18nManager } from 'react-native';
import RNRestart from 'react-native-restart';

export const handleRTLRestart = (locale: string) => {
  const isArabic = locale === 'ar';
  
  if (isArabic && !I18nManager.isRTL) {
    setTimeout(() => RNRestart.restart(), 100);
  }

  if (!isArabic && I18nManager.isRTL) {
    setTimeout(() => RNRestart.restart(), 100);
  }
};

export const configureRTL = (locale: string) => {
  const isArabic = locale === 'ar';
  I18nManager.allowRTL(isArabic);
  I18nManager.forceRTL(isArabic);
};
