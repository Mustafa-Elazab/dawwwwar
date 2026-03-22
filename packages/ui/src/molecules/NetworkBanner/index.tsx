import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import NetInfo from '@react-native-community/netinfo';
import { useTheme } from '@dawwar/theme';
import { Text, Icon } from '../../atoms';
import { createStyles } from './styles';
import type { NetworkBannerProps } from './types';

export function NetworkBanner({ testID }: NetworkBannerProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [isOffline, setIsOffline] = React.useState(false);
  const translateY = useSharedValue(-50);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const offline = !state.isConnected;
      setIsOffline(offline);
      translateY.value = withTiming(offline ? 0 : -50, { duration: 300 });
    });
    return unsubscribe;
  }, [translateY]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!isOffline) return null;

  return (
    <Animated.View style={[animStyle]} testID={testID}>
      <View style={styles.banner}>
        <Icon name="wifi-off" size={16} color="#FFFFFF" />
        <Text style={styles.text}>No internet connection</Text>
      </View>
    </Animated.View>
  );
}
