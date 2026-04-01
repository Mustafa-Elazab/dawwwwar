import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { useTheme } from '@dawwar/theme';
import { Text, Icon } from '../../atoms';
import { createStyles } from './styles';
import type { NetworkBannerProps } from './types';

export function NetworkBanner({ testID }: NetworkBannerProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [isOffline, setIsOffline] = React.useState(false);
  const translateY = React.useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const offline = !state.isConnected;
      setIsOffline(offline);
      Animated.timing(translateY, {
        toValue: offline ? 0 : -50,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
    return unsubscribe;
  }, [translateY]);

  if (!isOffline) return null;

  return (
    <Animated.View style={[{ transform: [{ translateY }] }]} testID={testID}>
      <View style={styles.banner}>
        <Icon name="wifi-off" size={16} color="#FFFFFF" />
        <Text style={styles.text}>No internet connection</Text>
      </View>
    </Animated.View>
  );
}
