import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, FlatList, Dimensions } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useTheme } from '@dawwar/theme';
import FastImage from 'react-native-fast-image';
import { createStyles } from './styles';
import type { Banner } from './types';

const MOCK_BANNERS: Banner[] = [
  {
    id: '1',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1000',
    title: 'Welcome',
  },
  {
    id: '2',
    imageUrl: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?auto=format&fit=crop&q=80&w=1000',
    title: 'Fast delivery',
  },
  {
    id: '3',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1000',
    title: 'Order anything',
  },
];

const SCREEN_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = SCREEN_WIDTH - 40;
const ITEM_TOTAL_WIDTH = ITEM_WIDTH + 16;

const getItemLayout = (_: any, index: number) => ({
  length: ITEM_TOTAL_WIDTH,
  offset: ITEM_TOTAL_WIDTH * index,
  index,
});

export const BannerSlider = React.memo(function BannerSlider() {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const [activeIndex, setActiveIndex] = useState(0);
  const flatRef = useRef<FlatList<Banner>>(null);
  const isFocused = useIsFocused();

  // Auto-scroll every 3 seconds only when focused
  useEffect(() => {
    if (!isFocused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % MOCK_BANNERS.length;
        flatRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, [isFocused]);

  const renderItem = useCallback(({ item }: { item: Banner }) => (
    <View style={[styles.banner, { width: ITEM_WIDTH }]}> 
      <FastImage
        source={{ uri: item.imageUrl, priority: FastImage.priority.high }}
        style={styles.bannerImage}
        resizeMode={FastImage.resizeMode.cover}
      />
    </View>
  ), [styles.banner, styles.bannerImage]);

  return (
    <View style={styles.container}>
      <FlatList<Banner>
        ref={flatRef}
        data={MOCK_BANNERS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        snapToInterval={ITEM_TOTAL_WIDTH}
        decelerationRate="fast"
        getItemLayout={getItemLayout}
        onScrollToIndexFailed={() => {}}
      />
      {/* Pagination dots */}
      <View style={styles.dotsRow}>
        {MOCK_BANNERS.map((_, i) => (
          <View key={i} style={[styles.dot, i === activeIndex && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
});
