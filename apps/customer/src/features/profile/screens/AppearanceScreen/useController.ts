import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from '@dawwar/i18n';
import { useTheme } from '@dawwar/theme';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { setThemeMode, selectThemeMode } from '../../../../store/slices/ui.slice';
import { ThemeMode } from '@dawwar/types';

export function useController() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const { setMode } = useTheme();
  const dispatch = useAppDispatch();
  const currentMode = useAppSelector(selectThemeMode);

  const handleSelect = useCallback(
    (mode: ThemeMode) => {
      dispatch(setThemeMode(mode));
      setMode(mode);
    },
    [dispatch, setMode],
  );

  return {
    currentMode,
    handleSelect,
    handleBack: () => navigation.goBack(),
    t,
  };
}
