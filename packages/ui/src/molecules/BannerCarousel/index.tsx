import React, { useState } from 'react';
import { FlatList, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useTheme, radius, spacing } from '@dawwar/theme';
import { AppImage, AppPressable, AppText } from '../../atoms';

export interface BannerCarouselItem {
  id: string;
  title: string;
  subtitle?: string;
  imageUri?: string;
}

export interface BannerCarouselProps {
  items: BannerCarouselItem[];
  onPressItem?: (item: BannerCarouselItem) => void;
  testID?: string;
}

export function BannerCarousel({ items, onPressItem, testID }: BannerCarouselProps) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const cardWidth = Math.max(width - spacing[8], 280);

  return (
    <View testID={testID}>
      <FlatList
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={items}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(event) => {
          setActiveIndex(Math.round(event.nativeEvent.contentOffset.x / cardWidth));
        }}
        renderItem={({ item }) => (
          <AppPressable
            style={[styles.card, { width: cardWidth, backgroundColor: colors.primaryLight }]}
            onPress={() => onPressItem?.(item)}
          >
            <View style={styles.copy}>
              <AppText variant="h4" color={colors.primary} numberOfLines={2}>{item.title}</AppText>
              {item.subtitle ? (
                <AppText variant="body2" color={colors.textSecondary} numberOfLines={2}>{item.subtitle}</AppText>
              ) : null}
            </View>
            <AppImage uri={item.imageUri} style={styles.image} />
          </AppPressable>
        )}
      />
      <View style={styles.dots}>
        {items.map((item, index) => (
          <View
            key={item.id}
            style={[
              styles.dot,
              { backgroundColor: index === activeIndex ? colors.primary : colors.border },
              index === activeIndex && styles.dotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 148,
    borderRadius: radius.xl,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
    marginEnd: spacing[3],
  },
  copy: {
    flex: 1,
    gap: spacing[2],
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: radius.lg,
  },
  dots: {
    flexDirection: 'row',
    alignSelf: 'center',
    gap: spacing[2],
    marginTop: spacing[2],
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
  },
  dotActive: {
    width: 26,
  },
});
