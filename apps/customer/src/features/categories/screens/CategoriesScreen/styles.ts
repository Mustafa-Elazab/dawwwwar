import { StyleSheet } from 'react-native';
import { spacing } from '@dawwar/theme';

export const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[8],
  },
  columnWrapper: {
    gap: spacing[3],
  },
  spacer: {
    flex: 1,
    margin: spacing[2] - spacing[1] / 2,
  },
});
