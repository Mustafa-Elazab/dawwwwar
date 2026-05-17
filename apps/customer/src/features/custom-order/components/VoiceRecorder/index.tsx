import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Alert, Animated, Easing } from 'react-native';
import Voice from '@react-native-voice/voice';
import { useTheme } from '@dawwar/theme';
import { Text, Icon } from '@dawwar/ui';
import { useTranslation } from '@dawwar/i18n';
import { createStyles } from './styles';
import type { VoiceRecorderProps } from './types';

const MAX_SECONDS = 60;
const MOCK_BARS = [12, 20, 8, 28, 16, 24, 10, 30, 14, 18, 22, 8, 26, 12, 20];

export function VoiceRecorder({ uri, onRecorded, onClear }: VoiceRecorderProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const styles = createStyles(colors, isRecording);

  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.4,
            duration: 800,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording]);

  const startRecording = async () => {
    try {
      // @ts-ignore
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
      // @ts-ignore
      await Voice.stop();
    } catch {}
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
    const mockUri = `voice_note_${Date.now()}.m4a`;
    onRecorded(mockUri, seconds);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      // @ts-ignore
      Voice.destroy().catch(() => {});
    };
  }, []);

  return (
    <View style={styles.container}>
      {!uri ? (
        <View style={{ alignItems: 'center' }}>
          <View style={{ position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
            {isRecording && (
              <Animated.View 
                style={[
                  styles.pulseRing, 
                  { transform: [{ scale: pulseAnim }] }
                ]} 
              />
            )}
            <TouchableOpacity
              style={styles.recordBtn}
              onPressIn={startRecording}
              onPressOut={isRecording ? stopRecording : undefined}
              activeOpacity={0.9}
            >
              <Icon
                name={isRecording ? 'stop-circle' : 'microphone'}
                size={32}
                color="#fff"
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.recordText}>
            {isRecording
              ? t('custom_order.recording', { seconds })
              : t('custom_order.hold_to_record')}
          </Text>
        </View>
      ) : (
        <View style={styles.playerRow}>
          <TouchableOpacity style={styles.playBtn} activeOpacity={0.7}>
            <Icon name="play" size={24} color={colors.primary} />
          </TouchableOpacity>
          <View style={styles.waveform}>
            {MOCK_BARS.map((h, i) => (
              <View key={i} style={[styles.wavebar, { height: h }]} />
            ))}
          </View>
          <TouchableOpacity style={styles.clearBtn} onPress={onClear}>
            <Icon name="close-circle" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
