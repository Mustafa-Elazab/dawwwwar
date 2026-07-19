import React from 'react';
import type { ComponentType } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@dawwar/theme';
import { Icon, Text } from '@dawwar/ui';
import { useController } from './useController';
import type { PaymentWebViewNavigationState } from './useController';
import { createStyles } from './styles';

type WebViewProps = {
  source: { uri: string };
  style?: StyleProp<ViewStyle>;
  onNavigationStateChange?: (state: PaymentWebViewNavigationState) => void;
  startInLoadingState?: boolean;
  scalesPageToFit?: boolean;
  javaScriptEnabled?: boolean;
  domStorageEnabled?: boolean;
  originWhitelist?: string[];
};

const { WebView } = require('react-native-webview') as {
  WebView: ComponentType<WebViewProps>;
};

export function PaymentWebViewScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(
    () => createStyles(colors, insets.top),
    [colors, insets.top],
  );
  const ctrl = useController();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={styles.closeButton}
          onPress={ctrl.handleClose}
          hitSlop={8}
          accessibilityRole="button"
        >
          <Icon name="close" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.title} numberOfLines={1}>
          {ctrl.title}
        </Text>
      </View>

      {ctrl.isLoading ? (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : null}

      <WebView
        source={{ uri: ctrl.url }}
        style={styles.webview}
        onNavigationStateChange={ctrl.handleNavigationChange}
        startInLoadingState
        scalesPageToFit
        javaScriptEnabled
        domStorageEnabled
        originWhitelist={[
          'https://accept.paymob.com',
          'https://*.paymob.com',
          'https://dawwar.com',
          'dawwar://',
        ]}
      />
    </View>
  );
}
