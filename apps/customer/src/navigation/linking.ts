import type { LinkingOptions } from '@react-navigation/native';
import type { RootParamList } from './types';

export const linking: LinkingOptions<RootParamList> = {
  prefixes: ['dawwar://', 'https://dawwar.com'],
  config: {
    screens: {
      CustomerTabs: {
        screens: {
          OrdersTab: {
            screens: {
              TrackingScreen: 'track/:orderId',
              OrderDetailScreen: 'order/:orderId',
            },
          },
          HomeTab: {
            screens: {
              MerchantDetailScreen: 'merchant/:merchantId',
            },
          },
        },
      },
    },
  },
};
