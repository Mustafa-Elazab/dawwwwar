import React from 'react';
import { View, TouchableOpacity, ViewStyle, I18nManager } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@dawwar/theme';
import { Text } from '../../atoms/Text';
import { Icon } from '../../atoms/Icon';
import { createStyles } from './styles';
import type { HeaderProps } from './types';

export function Header({
  title,
  subtitle,
  leftComponent,
  rightComponent,
  type = 'default',
  onBackPress,
  style,
}: HeaderProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const navigation = useNavigation();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const renderLeft = () => {
    if (leftComponent) return leftComponent;
    if (type === 'default') {
      return (
        <TouchableOpacity style={styles.leftAction} onPress={handleBack}>
          <Icon 
            name="arrow-left" 
            size={24} 
            color={colors.text} 
            style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }}
          />
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.leftContainer}>{renderLeft()}</View>
      
      <View style={styles.contentContainer}>
        {title && <Text style={styles.title}>{title}</Text>}
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      <View style={styles.rightContainer}>{rightComponent}</View>
    </View>
  );
}
