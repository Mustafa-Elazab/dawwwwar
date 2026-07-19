import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@dawwar/theme';
import { ChatInterface } from '../../../../../../../packages/ui/src/organisms/Chat';
import { Header } from '../../../../../../../packages/ui/src/organisms/Header';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../../../../store/hooks';
import { selectUser } from '../../../../store/slices/auth.slice';
import { useTranslation } from '@dawwar/i18n';

export function OrderChatScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { orderId, orderNumber } = route.params;
  const user = useAppSelector(selectUser);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header 
        title={`${t('chat.order_title')} #${orderNumber || ''}`}
        onBackPress={navigation.goBack}
      />
      <ChatInterface 
        orderId={orderId} 
        currentUser={user} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
