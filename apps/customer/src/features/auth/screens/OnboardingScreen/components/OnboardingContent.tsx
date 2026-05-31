import React from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  View,
} from 'react-native';
import type { RefObject } from 'react';
import type { AppColors } from '@dawwar/theme';
import { Button, Icon, Text } from '@dawwar/ui';
import { createStyles } from '../styles';
import type { OnboardingStep } from '../useController';

interface OnboardingContentProps {
  colors: AppColors;
  width: number;
  steps: OnboardingStep[];
  index: number;
  isLast: boolean;
  listRef: RefObject<FlatList<OnboardingStep> | null>;
  nextLabel: string;
  loginLabel: string;
  onNext: () => void;
  onLogin: () => void;
  onMomentumEnd: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

export function OnboardingContent({
  colors,
  width,
  steps,
  index,
  isLast,
  listRef,
  nextLabel,
  loginLabel,
  onNext,
  onLogin,
  onMomentumEnd,
}: OnboardingContentProps) {
  const styles = createStyles(colors, width);

  return (
    <View style={styles.content}>
      <FlatList
        ref={listRef}
        data={steps}
        keyExtractor={(item) => item.title}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onMomentumScrollEnd={onMomentumEnd}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <View style={styles.illustration}>
              <Icon name={item.icon} size={112} color={colors.primary} />
            </View>
            <View style={styles.copy}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.body}>{item.body}</Text>
            </View>
          </View>
        )}
      />

      <View style={styles.dots}>
        {steps.map((step, dotIndex) => (
          <View
            key={step.title}
            style={[styles.dot, dotIndex === index && styles.dotActive]}
          />
        ))}
      </View>

      <View style={styles.actions}>
        <Button
          label={isLast ? loginLabel : nextLabel}
          onPress={isLast ? onLogin : onNext}
          fullWidth
          style={styles.primaryButton}
        />
      </View>
    </View>
  );
}
