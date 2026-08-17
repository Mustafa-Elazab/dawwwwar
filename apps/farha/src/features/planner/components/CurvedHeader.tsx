import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme, spacing } from '@dawwar/theme';
import { AppIcon, AppPressable, AppText } from '@dawwar/ui';

import { GuidedTipOverlay } from '../../tips/components';

interface CurvedHeaderProps {
  title: string;
  subtitle?: string;
  onBackPress?: () => void;
  action?: React.ReactNode;
  tipTitle: string;
  tipBody: string;
  tipCloseLabel: string;
}

export function CurvedHeader({
  title,
  subtitle,
  onBackPress,
  action,
  tipTitle,
  tipBody,
  tipCloseLabel,
}: CurvedHeaderProps) {
  const { colors } = useTheme();
  const [isTipVisible, setIsTipVisible] = useState(false);

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
        <View style={styles.actions}>
          {action}
          <AppPressable
            accessibilityRole="button"
            accessibilityLabel={tipTitle}
            onPress={() => setIsTipVisible(true)}
            style={[styles.iconCircle, { backgroundColor: colors.primaryDark }]}
          >
            <AppIcon name="help-circle-outline" size={22} color={colors.primaryText} />
          </AppPressable>
        </View>
      </View>
      <GuidedTipOverlay
        visible={isTipVisible}
        title={tipTitle}
        body={tipBody}
        closeLabel={tipCloseLabel}
        onClose={() => setIsTipVisible(false)}
      />
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
  actions: {
    alignItems: 'flex-end',
    gap: spacing[2],
  },
});
