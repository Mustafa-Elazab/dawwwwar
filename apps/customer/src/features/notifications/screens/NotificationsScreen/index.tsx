import React, { useCallback } from 'react';
import { ListRenderItem } from 'react-native';
import { ListScreenTemplate } from '@dawwar/ui';
import { NotificationRow } from './components/NotificationRow';
import { useController, type NotificationListItem } from './useController';

export function NotificationsScreen() {
  const controller = useController();

  const renderItem = useCallback<ListRenderItem<NotificationListItem>>(
    ({ item }) => (
      <NotificationRow
        item={item}
        colors={controller.colors}
        onPress={controller.handlers.handleNotificationPress}
      />
    ),
    [controller.colors, controller.handlers.handleNotificationPress],
  );

  return (
    <ListScreenTemplate
      headerProps={{ title: controller.headerTitle }}
      data={controller.items}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      onRefresh={controller.handlers.handleRefresh}
      refreshing={controller.isRefreshing}
      emptyIcon={controller.emptyState.icon}
      emptyTitle={controller.emptyState.title}
      emptySubtitle={controller.emptyState.subtitle}
      emptyAction={controller.emptyState.action}
    />
  );
}
