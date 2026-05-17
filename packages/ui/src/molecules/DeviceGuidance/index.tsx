import React from 'react';
import { View, TouchableOpacity, Linking, Platform } from 'react-native';
import { useTheme } from '@dawwar/theme';
import { Text } from '../../atoms/Text';
import { Icon } from '../../atoms/Icon';
import { Card } from '../Card';
import { createStyles } from './styles';

interface DeviceGuidanceProps {
  onClose: () => void;
  testID?: string;
}

export function DeviceGuidance({ onClose, testID }: DeviceGuidanceProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const getInstructions = () => {
    // Basic logic to detect major Egyptian Android variants
    const manufacturer = (Platform.OS === 'android' ? (Platform as any).constants.Manufacturer : '')?.toLowerCase() || '';
    
    if (manufacturer.includes('samsung')) {
      return {
        title: 'Samsung Optimization',
        body: 'Please set Dawwar to "Unrestricted" in Battery settings to ensure orders are tracked correctly.',
        url: 'https://dontkillmyapp.com/samsung',
      };
    }
    if (manufacturer.includes('xiaomi')) {
      return {
        title: 'Xiaomi Battery Saver',
        body: 'Please disable "Battery Saver" for Dawwar and enable "Autostart" in App Info.',
        url: 'https://dontkillmyapp.com/xiaomi',
      };
    }
    return {
      title: 'Reliable Tracking',
      body: 'To receive orders in the background, please disable battery optimization for Dawwar.',
      url: 'https://dontkillmyapp.com',
    };
  };

  const info = getInstructions();

  return (
    <Card style={styles.container} testID={testID}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Icon name="shield-alert" size={24} color={colors.primary} />
        </View>
        <Text style={styles.title}>{info.title}</Text>
        <TouchableOpacity onPress={onClose}>
          <Icon name="close" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.body}>{info.body}</Text>
      
      <TouchableOpacity 
        style={styles.action} 
        onPress={() => Linking.openURL(info.url)}
      >
        <Text style={styles.actionText}>Show me how</Text>
        <Icon name="chevron-right" size={16} color={colors.primary} />
      </TouchableOpacity>
    </Card>
  );
}
