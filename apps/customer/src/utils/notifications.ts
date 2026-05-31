import { PermissionsAndroid, Platform } from 'react-native';
import { USE_MOCK_API } from '../core/api/config';
import Toast from 'react-native-toast-message';
import api from '../core/api/client';
import { navigationRef } from '../navigation/navigationRef';

/**
 * Request push notification permission
 * iOS: Shows permission dialog
 * Android: No-op (permissions granted automatically for FCM)
 */
export async function requestPushNotificationPermission(): Promise<boolean> {
  if (USE_MOCK_API) return false;

  try {
    if (Platform.OS === 'android' && Number(Platform.Version) >= 33) {
      const alreadyGranted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      if (!alreadyGranted) {
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
        if (result !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('[FCM] Android notification permission denied');
          return false;
        }
      }
    }

    if (Platform.OS === 'android') {
      return true;
    }

    const messaging = await import('@react-native-firebase/messaging');
    const authStatus = await messaging.default().requestPermission();

    const enabled =
      authStatus === (messaging as any).AuthorizationStatus.AUTHORIZED ||
      authStatus === (messaging as any).AuthorizationStatus.PROVISIONAL;

    console.log('[FCM] Push notification permission:', enabled ? 'granted' : 'denied');
    return enabled;
  } catch (err) {
    console.warn('[FCM] Permission request failed:', err);
    return false;
  }
}

/**
 * Get current FCM token
 * Used to register device with backend
 */
export async function getFcmToken(): Promise<string | null> {
  if (USE_MOCK_API) return null;

  try {
    const messaging = await import('@react-native-firebase/messaging');
    return await messaging.default().getToken();
  } catch (err) {
    console.warn('[FCM] Get token failed:', err);
    return null;
  }
}

/**
 * Setup token refresh handler
 */
export function setupTokenRefresh(): void {
  if (USE_MOCK_API) return;
  import('@react-native-firebase/messaging').then((messaging) => {
    messaging.default().onTokenRefresh(async (newToken) => {
      try {
        await api.post('/users/fcm-token', { token: newToken, platform: Platform.OS });
      } catch (err) {
        console.warn('Failed to refresh FCM token', err);
      }
    });
  });
}

/**
 * Setup foreground notification handler
 * Shows in-app alert when notification arrives while app is open
 */
export function setupForegroundNotifications(): void {
  if (USE_MOCK_API) return;

  import('@react-native-firebase/messaging')
    .then((messaging) => {
      // Handle foreground messages
      messaging.default().onMessage(async (remoteMessage) => {
        console.log('[FCM] Foreground message received:', remoteMessage);

        const title = remoteMessage.notification?.title ?? 'New Notification';
        const body = remoteMessage.notification?.body ?? '';
        const data = remoteMessage.data;

        // Show in-app toast
        Toast.show({
          type: 'info',
          text1: title,
          text2: body,
          onPress: () => data?.orderId && handleNotificationTap(data as Record<string, string>),
          visibilityTime: 5000,
        });
      });

      // Handle notification tap when app was in background
      messaging.default().onNotificationOpenedApp((remoteMessage) => {
        console.log('[FCM] Notification opened app:', remoteMessage);
        handleNotificationTap(remoteMessage.data as Record<string, string>);
      });

      // Check if app was opened from notification (killed state)
      messaging
        .default()
        .getInitialNotification()
        .then((remoteMessage) => {
          if (remoteMessage) {
            console.log('[FCM] App opened from quit state:', remoteMessage);
            handleNotificationTap(remoteMessage.data as Record<string, string>);
          }
        });

      console.log('[FCM] Foreground notification handler registered');
    })
    .catch((err) => {
      console.warn('[FCM] Setup foreground notifications failed:', err);
    });
}

/**
 * Handle notification tap - navigate to relevant screen
 */
function handleNotificationTap(data?: Record<string, string>): void {
  if (!data || !navigationRef.isReady()) return;

  const { type, orderId } = data;

  switch (type) {
    case 'NEW_ORDER':
    case 'ORDER_STATUS':
    case 'DRIVER_ASSIGNED':
    case 'ORDER_REJECTED':
      if (orderId) {
        // Navigate to order details using tracking screen
        navigationRef.navigate('CustomerTabs', {
          screen: 'OrdersTab',
          params: { screen: 'TrackingScreen', params: { orderId } }
        });
      }
      break;
    default:
      console.log('[FCM] Unknown notification type:', type);
  }
}
