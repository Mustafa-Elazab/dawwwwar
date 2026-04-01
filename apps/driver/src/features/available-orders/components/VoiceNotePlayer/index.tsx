import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@dawwar/theme';
import { Text, Icon } from '@dawwar/ui';
import { space } from '@dawwar/theme';
import { useTranslation } from '@dawwar/i18n';

interface VoiceNotePlayerProps {
  uri: string;           // Phase 1: mock URI, just show UI
  durationSeconds?: number;
}

export function VoiceNotePlayer({ uri, durationSeconds = 15 }: VoiceNotePlayerProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);

  const MOCK_BARS = [8, 14, 20, 12, 28, 16, 24, 10, 22, 18, 26, 8, 20, 14, 30, 12, 24];

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderRadius: 12, padding: space.md }]}>
      <TouchableOpacity
        style={[styles.playBtn, { backgroundColor: colors.primaryMuted }]}
        onPress={() => setIsPlaying((p) => !p)}
      >
        <Icon name={isPlaying ? 'pause' : 'play'} size={20} color={colors.primary} />
      </TouchableOpacity>

      {/* Waveform */}
      <View style={styles.waveform}>
        {MOCK_BARS.map((h, i) => (
          <View
            key={i}
            style={[styles.bar, {
              height: h,
              backgroundColor: i < (isPlaying ? 8 : 0) ? colors.primary : colors.border,
            }]}
          />
        ))}
      </View>

      <Text variant="caption" color={colors.textSecondary}>
        {durationSeconds}s
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  playBtn: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  waveform: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 2, height: 32 },
  bar: { width: 3, borderRadius: 2 },
});
