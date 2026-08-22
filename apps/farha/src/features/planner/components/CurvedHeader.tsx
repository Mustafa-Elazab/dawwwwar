import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { useTheme, spacing } from '@dawwar/theme';
import { AppIcon, AppPressable, AppText } from '@dawwar/ui';

interface CurvedHeaderProps {
  title: string;
  subtitle?: string;
  backLabel: string;
  onBackPress?: () => void;
  action?: React.ReactNode;
  helpLabel: string;
  onHelpPress: () => void;
  coverPhotoUri?: string;
}

export function CurvedHeader({
  title,
  subtitle,
  backLabel,
  onBackPress,
  action,
  helpLabel,
  onHelpPress,
  coverPhotoUri,
}: CurvedHeaderProps) {
  const { colors } = useTheme();

  const content = (
    <View style={[styles.headerContent, coverPhotoUri ? styles.photoOverlay : null]}>
      <View style={styles.row}>
        <View style={styles.titleBlock}>
          {onBackPress ? (
            <AppPressable
              accessibilityRole="button"
              accessibilityLabel={backLabel}
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
         
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.header, { backgroundColor: colors.primary }]}>
      {coverPhotoUri ? (
        <ImageBackground
          source={{ uri: coverPhotoUri }}
          resizeMode="cover"
          style={styles.photoBackground}
        >
          {content}
        </ImageBackground>
      ) : content}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 132,
    overflow: 'hidden',
  },
  headerContent: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
    paddingBottom: spacing[8],
  },
  photoBackground: {
    minHeight: 132,
  },
  photoOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.34)',
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
