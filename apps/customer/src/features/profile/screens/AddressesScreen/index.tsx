import React, { useMemo } from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { ListScreenTemplate, Text, Icon } from '@dawwar/ui';
import { useTheme } from '@dawwar/theme';
import { useController } from './useController';
import { createStyles } from './styles';
import type { Address } from '@dawwar/types';

export function AddressesScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const ctrl = useController();

  const handleMenuPress = (item: Address) => {
    Alert.alert(item.label, '', [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('addresses.edit'), onPress: () => ctrl.handleEdit(item.id) },
      { text: t('addresses.delete'), style: 'destructive', onPress: () => confirmDelete(item.id) },
    ]);
  };

  const confirmDelete = (id: string) => {
    Alert.alert(t('addresses.delete_confirm_title'), t('addresses.delete_confirm_body'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('addresses.delete'), style: 'destructive', onPress: () => ctrl.handleDelete(id) },
    ]);
  };

  const isHomeLabel = (label?: string) => {
    const l = (label || '').toLowerCase();
    return l === 'home' || l === 'المنزل' || l.includes('home');
  };

  const renderItem = React.useCallback(
    ({ item }: { item: Address }) => (
      <View style={styles.card}>
        {item.isDefault && (
          <View style={styles.defaultBadge}>
            <Text style={styles.defaultText}>{t('addresses.default')}</Text>
          </View>
        )}

        <View
          style={[
            styles.iconCircle,
            {
              backgroundColor: isHomeLabel(item.label) ? `${colors.primary}20` : `${colors.info}15`,
            },
          ]}
        >
          <Icon
            name={isHomeLabel(item.label) ? 'home-variant' : 'briefcase-variant'}
            size={22}
            color={isHomeLabel(item.label) ? colors.primary : colors.info}
          />
        </View>

        <View style={styles.info}>
          <Text style={styles.label}>
            {t(`address_labels.${(item.label || 'other').toLowerCase()}`, {
              defaultValue: item.label || t('addresses.other'),
            })}
          </Text>
          <Text style={styles.street} numberOfLines={1}>
            {item.address}
          </Text>
        </View>

        <TouchableOpacity style={styles.menuBtn} onPress={() => handleMenuPress(item)}>
          <Icon name="dots-vertical" size={22} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    ),
    [colors.primary, colors.textSecondary, handleMenuPress, styles, t],
  );

  return (
    <ListScreenTemplate<Address>
      headerProps={{
        title: t('addresses.title'),
        onBackPress: ctrl.handleBack,
      }}
      ListHeaderComponent={
        <TouchableOpacity style={styles.addCard} onPress={ctrl.handleAddNew} activeOpacity={0.7}>
          <Icon name="plus" size={24} color={colors.primary} />
          <Text style={styles.addText}>{t('addresses.add')}</Text>
        </TouchableOpacity>
      }
      data={ctrl.addresses}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      isLoading={ctrl.isLoading}
      isError={ctrl.isError}
      onRetry={ctrl.refetch}
      onRefresh={ctrl.refetch}
      refreshing={false}
      emptyTitle={t('addresses.empty')}
      emptySubtitle={t('addresses.empty_sub')}
    />
  );
}
