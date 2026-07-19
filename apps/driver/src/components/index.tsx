import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { useTranslation } from '@dawwar/i18n';
import { useTheme, typography } from '@dawwar/theme';
import { Text } from '../../../../packages/ui/src/atoms/Text';

export function NetworkStatusBanner() {
  const [isOffline, setIsOffline] = useState(false);
  const { t } = useTranslation();
  const { colors } = useTheme();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(state.isConnected === false);
    });
    return unsubscribe;
  }, []);

  if (!isOffline) return null;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.error }]}>
      <View style={[styles.banner, { backgroundColor: colors.error }]}>
        <Text style={styles.text}>{t('errors.no_internet')}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    zIndex: 9999,
  },
  banner: {
    width: '100%',
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...typography.label,
    color: '#fff',
    fontWeight: '800',
    textAlign: 'center',
  },
});
