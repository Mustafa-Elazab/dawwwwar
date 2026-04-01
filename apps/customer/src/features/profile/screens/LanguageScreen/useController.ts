import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { setAppLanguage } from '@dawwar/i18n';
import RNRestart from 'react-native-restart';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { setLanguage, selectLanguage } from '../../../../store/slices/ui.slice';
import { storage } from '../../../../core/storage/mmkv';
import { Language } from '@dawwar/types';

export function useController() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const currentLanguage = useAppSelector(selectLanguage);

  const handleSelect = useCallback(
    (lang: Language) => {
      if (lang === currentLanguage) return;
      Alert.alert(
        t('language.restart_title'),
        t('language.restart_body'),
        [
          { text: t('language.restart_later'), style: 'cancel' },
          {
            text: t('language.restart_now'),
            onPress: async () => {
              dispatch(setLanguage(lang));
              await setAppLanguage(lang, storage, () => RNRestart.restart());
            },
          },
        ],
      );
    },
    [currentLanguage, dispatch, t],
  );

  return {
    currentLanguage,
    handleSelect,
    handleBack: () => navigation.goBack(),
    t,
  };
}
