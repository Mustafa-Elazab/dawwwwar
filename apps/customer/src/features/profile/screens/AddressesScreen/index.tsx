import React from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { ListScreenTemplate, Header, Text, Icon, Badge } from '@dawwar/ui';
import { useTheme } from '@dawwar/theme';
import { space } from '@dawwar/theme';
import { useController } from './useController';
import type { Address } from '@dawwar/types';

export function AddressesScreen() {
  const { colors } = useTheme();
  const ctrl = useController();

  const confirmDelete = (id: string, label: string) => {
    Alert.alert(
      ctrl.t('addresses.delete_confirm_title'),
      ctrl.t('addresses.delete_confirm_body'),
      [
        { text: ctrl.t('common.cancel'), style: 'cancel' },
        { text: ctrl.t('addresses.delete'), style: 'destructive', onPress: () => ctrl.handleDelete(id) },
      ],
    );
  };

  return (
    <ListScreenTemplate<Address>
      header={
        <Header
          title={ctrl.t('addresses.title')}
          leftAction={{ icon: 'arrow-left', onPress: ctrl.handleBack }}
          rightAction={{ icon: 'plus', onPress: ctrl.handleAddNew }}
        />
      }
      data={ctrl.addresses}
      renderItem={({ item }) => (
        <View style={{
          flexDirection: 'row', alignItems: 'center',
          padding: space.base, backgroundColor: colors.card,
          borderBottomWidth: 1, borderBottomColor: colors.borderLight,
          gap: space.md,
        }}>
          <Icon name="map-marker" size={24} color={colors.primary} />
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', gap: space.sm, alignItems: 'center' }}>
              <Text variant="label" color={colors.text}>{item.label}</Text>
              {item.isDefault && (
                <Badge label={ctrl.t('addresses.default')} variant="primary" size="sm" />
              )}
            </View>
            <Text variant="body2" color={colors.textSecondary} numberOfLines={2}>
              {item.address}
            </Text>
          </View>
          <TouchableOpacity onPress={() => ctrl.handleEdit(item.id)}>
            <Icon name="pencil-outline" size={20} color={colors.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => confirmDelete(item.id, item.label)}>
            <Icon name="trash-can-outline" size={20} color={colors.error} />
          </TouchableOpacity>
        </View>
      )}
      keyExtractor={(item) => item.id}
      isLoading={ctrl.isLoading}
      isError={ctrl.isError}
      onRetry={ctrl.refetch}
      onRefresh={ctrl.refetch}
      refreshing={false}
      emptyIcon="map-marker-off-outline"
      emptyTitle={ctrl.t('addresses.empty')}
      emptySubtitle={ctrl.t('addresses.empty_sub')}
      emptyAction={{ label: ctrl.t('addresses.add'), onPress: ctrl.handleAddNew }}
    />
  );
}
