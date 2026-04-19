import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ScreenTemplate, Text, Icon, Button } from '@dawwar/ui';
import { useTheme } from '@dawwar/theme';
import { useController } from './useController';
import { createStyles } from './styles';

export function RoleScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const ctrl = useController();

  return (
    <ScreenTemplate edges={['top', 'bottom']}>
      <View style={styles.container}>
        <Text style={styles.title}>{ctrl.t('auth.choose_role')}</Text>
        <Text style={styles.subtitle}>{ctrl.t('auth.choose_role_subtitle')}</Text>

        {ctrl.roleOptions.map((option) => {
          const isSelected = ctrl.selectedRole === option.role;
          return (
            <TouchableOpacity
              key={option.role}
              style={[styles.card, isSelected && styles.cardSelected]}
              onPress={() => ctrl.setSelectedRole(option.role)}
              activeOpacity={0.85}
            >
              <View style={[styles.iconCircle, isSelected && styles.iconCircleSelected]}>
                <Icon
                  name={option.icon}
                  size={26}
                  color={isSelected ? '#fff' : colors.icon}
                />
              </View>
              <View style={styles.cardText}>
                <Text style={[styles.cardTitle, isSelected && styles.cardTitleSelected]}>
                  {ctrl.t(option.titleKey)}
                </Text>
                <Text style={styles.cardSubtitle}>
                  {ctrl.t(option.subtitleKey)}
                </Text>
              </View>
              {isSelected && (
                <Icon name="check-circle" size={22} color={colors.primary} />
              )}
            </TouchableOpacity>
          );
        })}

        <View style={styles.spacer} />

        <Button
          label={ctrl.t('auth.continue')}
          onPress={ctrl.handleContinue}
          loading={ctrl.isLoading}
          disabled={ctrl.isButtonDisabled}
          fullWidth
          style={styles.continueButton}
        />
      </View>
    </ScreenTemplate>
  );
}
