import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@dawwar/theme';
import { Text, Icon } from '../../atoms';
import { createStyles } from './styles';
import type { StepIndicatorProps } from './types';

export function StepIndicator({ steps, currentStep, testID }: StepIndicatorProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View testID={testID}>
      <View style={styles.row}>
        {steps.map((step, index) => {
          const isDone = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <React.Fragment key={step}>
              <View style={styles.stepContainer}>
                <View style={[
                  styles.circle,
                  isDone && styles.circleDone,
                  isCurrent && styles.circleCurrent,
                  !isDone && !isCurrent && styles.circlePending,
                ]}>
                  {isDone ? (
                    <Icon name="check" size={14} color="#fff" />
                  ) : (
                    <Text style={isCurrent || isDone ? styles.circleText : styles.circleTextPending}>
                      {String(index + 1)}
                    </Text>
                  )}
                </View>
              </View>
              {index < steps.length - 1 && (
                <View style={[styles.line, isDone && styles.lineDone]} />
              )}
            </React.Fragment>
          );
        })}
      </View>
      <View style={styles.row}>
        {steps.map((step, index) => {
          const isDone = index < currentStep;
          const isCurrent = index === currentStep;
          return (
            <View key={`label-${step}`} style={styles.stepContainer}>
              <Text style={[
                styles.label,
                isCurrent && styles.labelCurrent,
                isDone && styles.labelDone,
              ]}>{step}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
