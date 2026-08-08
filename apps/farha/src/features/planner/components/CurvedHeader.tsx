import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme, spacing } from '@dawwar/theme';
import { AppIcon, AppPressable, AppText } from '@dawwar/ui';

interface CurvedHeaderProps {
  title: string;
  subtitle?: string;
  onBackPress?: () => void;
  action?: React.ReactNode;
}

export function CurvedHeader({ title, subtitle, onBackPress, action }: CurvedHeaderProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.header, { backgroundColor: colors.primary }]}>
      <View style={styles.row}>
        <View style={styles.titleBlock}>
          {onBackPress ? (
            <AppPressable
              accessibilityRole="button"
              accessibilityLabel="Back"
              onPress={onBackPress}
              style={[styles.backButton, { borderColor: colors.primaryMuted }]}
            >
              <AppIcon name="chevron-left" size={22} color={colors.primaryText} />
            </AppPressable>
          ) : null}
          <View style={styles.copy}>
            <AppText variant="h2" color={colors.primaryText} align="auto" numberOfLines={2}>
              {title}
            </AppText>
            {subtitle ? (
              <AppText variant="body2" color={colors.primaryText} align="auto" numberOfLines={2}>
                {subtitle}
              </AppText>
            ) : null}
          </View>
        </View>
        {action ?? (
          <View style={[styles.iconCircle, { backgroundColor: colors.primaryDark }]}>
            <AppIcon name="bell-outline" size={22} color={colors.primaryText} />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 132,
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
    paddingBottom: spacing[8],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing[3],
  },
  titleBlock: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[3],
  },
  copy: {
    flex: 1,
    gap: spacing[1],
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
