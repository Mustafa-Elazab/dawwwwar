import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import Voice from '@react-native-voice/voice';
import { useTheme } from '@dawwar/theme';
import { Text, Icon } from '@dawwar/ui';
import { useTranslation } from '@dawwar/i18n';
import { createStyles } from './styles';
import type { VoiceRecorderProps } from './types';

const MAX_SECONDS = 60;

// Mock waveform bars (Phase 1 — real audio processing in Phase 2)
const MOCK_BARS = [12, 20, 8, 28, 16, 24, 10, 30, 14, 18, 22, 8, 26, 12, 20];

export function VoiceRecorder({ uri, onRecorded, onClear }: VoiceRecorderProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const styles = createStyles(colors, isRecording);

  const startRecording = async () => {
    try {
      await Voice.start('ar-EG');
      setIsRecording(true);
      setSeconds(0);
      timerRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s >= MAX_SECONDS - 1) {
            void stopRecording();
            return MAX_SECONDS;
          }
          return s + 1;
        });
      }, 1000);
    } catch {
      Alert.alert(t('errors.microphone_denied'));
    }
  };

  const stopRecording = async () => {
    if (!isRecording) return;
    try {
      await Voice.stop();
    } catch {}
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
    // Phase 1 mock: use a placeholder URI
    const mockUri = `voice_note_${Date.now()}.m4a`;
    onRecorded(mockUri, seconds);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      Voice.destroy().catch(() => {});
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('custom_order.voice_label')}</Text>

      {!uri ? (
        <TouchableOpacity
          style={styles.recordBtn}
          onPressIn={startRecording}
          onPressOut={isRecording ? stopRecording : undefined}
          activeOpacity={0.8}
        >
          <Icon
            name={isRecording ? 'stop-circle' : 'microphone'}
            size={20}
            color={isRecording ? colors.error : colors.icon}
          />
          <Text style={styles.recordText}>
            {isRecording
              ? t('custom_order.recording', { seconds })
              : t('custom_order.hold_to_record')}
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.playerRow}>
          <TouchableOpacity style={styles.playBtn}>
            <Icon name="play" size={20} color={colors.primary} />
          </TouchableOpacity>
          {/* Mock waveform */}
          <View style={styles.waveform}>
            {MOCK_BARS.map((h, i) => (
              <View key={i} style={[styles.wavebar, { height: h }]} />
            ))}
          </View>
          <TouchableOpacity style={styles.clearBtn} onPress={onClear}>
            <Icon name="close-circle" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
