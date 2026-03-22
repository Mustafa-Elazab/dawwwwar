import React, { useState, useRef, useEffect } from 'react';
import { View, FlatList, Image } from 'react-native';
import { useTheme } from '@dawwar/theme';
import { createStyles } from './styles';
import type { Banner } from './types';

const MOCK_BANNERS: Banner[] = [
  {
    id: '1',
    imageUrl: 'https://placehold.co/640x280/FF6B35/white?text=دوّار',
    title: 'Welcome',
  },
  {
    id: '2',
    imageUrl: 'https://placehold.co/640x280/E55A2B/white?text=توصيل+سريع',
    title: 'Fast delivery',
  },
  {
    id: '3',
    imageUrl: 'https://placehold.co/640x280/2D3436/white?text=اطلب+من+أي+مكان',
    title: 'Order anything',
  },
];

const ITEM_WIDTH = 320;

export function BannerSlider() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [activeIndex, setActiveIndex] = useState(0);
  const flatRef = useRef<FlatList<Banner>>(null);

  // Auto-scroll every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % MOCK_BANNERS.length;
        flatRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.container}>
      <FlatList<Banner>
        ref={flatRef}
        data={MOCK_BANNERS}
        renderItem={({ item }) => (
          <View style={styles.banner}>
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.bannerImage}
              resizeMode="cover"
            />
          </View>
        )}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        snapToInterval={ITEM_WIDTH + 16}
        decelerationRate="fast"
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
}
