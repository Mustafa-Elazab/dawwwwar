import type { LinkingOptions } from '@react-navigation/native';
import type { RootParamList } from './types';
import { MODAL_ROUTES, TAB_ROUTES } from './routes';

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
          [TAB_ROUTES.BASKET_TAB]: 'cart',
        },
      },
      [MODAL_ROUTES.CHECKOUT]: 'checkout',
      [MODAL_ROUTES.CUSTOM_ORDER]: 'custom-order',
    },
  },
};
