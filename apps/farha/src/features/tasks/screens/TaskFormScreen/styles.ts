import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { createPhase1ScreenStyles } from '../../../planner/utils/styles';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    ...createPhase1ScreenStyles(colors),
  });
