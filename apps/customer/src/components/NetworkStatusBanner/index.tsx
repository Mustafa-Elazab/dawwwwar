import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from '@dawwar/i18n';
import { useTheme, typography } from '@dawwar/theme';
import { Text } from '@dawwar/ui';

type NetworkBannerState = 'online' | 'offline' | 'restored';
const BANNER_BODY_HEIGHT = 40;

export function NetworkStatusBanner() {
  const [networkState, setNetworkState] = useState<NetworkBannerState>('online');
  const [isRestoredDismissed, setIsRestoredDismissed] = useState(true);
  const wasOfflineRef = useRef(false);
  const { t } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const isOffline =
        state.isConnected === false || state.isInternetReachable === false;

      if (isOffline) {
        wasOfflineRef.current = true;
        setIsRestoredDismissed(false);
        setNetworkState('offline');
        return;
      }

      if (wasOfflineRef.current) {
        wasOfflineRef.current = false;
        setIsRestoredDismissed(false);
        setNetworkState('restored');
        return;
      }

      setNetworkState('online');
    });
    return unsubscribe;
  }, []);

  const handleDismissRestored = useCallback(() => {
    setIsRestoredDismissed(true);
  }, []);

  const isOffline = networkState === 'offline';
  const showRestored = networkState === 'restored' && !isRestoredDismissed;

  if (!isOffline && !showRestored) return null;

  const backgroundColor = isOffline ? colors.error : colors.success;

  return (
    <>
      <View style={[styles.layoutSpacer, { backgroundColor }]} />
      <View
        pointerEvents="box-none"
        style={[styles.overlay, { backgroundColor }]}
      >
        <View
          style={[
            styles.banner,
            {
              backgroundColor,
              minHeight: insets.top + BANNER_BODY_HEIGHT,
              paddingTop: insets.top,
            },
          ]}
        >
          <Text style={styles.text} numberOfLines={1}>
            {t(isOffline ? 'errors.no_internet' : 'errors.internet_back')}
          </Text>
          {showRestored ? (
            <TouchableOpacity
              style={styles.dismissButton}
              onPress={handleDismissRestored}
              accessibilityRole="button"
              accessibilityLabel={t('common.close')}
            >
              <Text style={styles.dismissText} numberOfLines={1}>
                {t('common.close')}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  layoutSpacer: {
    height: BANNER_BODY_HEIGHT,
    zIndex: 9998,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    start: 0,
    end: 0,
    zIndex: 9999,
    elevation: 9999,
  },
  banner: {
    width: '100%',
    paddingBottom: 0,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  text: {
    ...typography.label,
    flex: 1,
    color: '#fff',
    fontWeight: '800',
    textAlign: 'center',
  },
  dismissButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  dismissText: {
    ...typography.caption,
    color: '#fff',
    fontWeight: '800',
  },
});
