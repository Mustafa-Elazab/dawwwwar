import { Alert } from 'react-native';
import { USE_MOCK_API } from '../core/api/config';

/**
 * Request push notification permission
 * iOS: Shows permission dialog
 * Android: No-op (permissions granted automatically for FCM)
 */
export async function requestPushNotificationPermission(): Promise<boolean> {
  if (USE_MOCK_API) return false;

  try {
    const messaging = await import('@react-native-firebase/messaging');
    const authStatus = await messaging.default().requestPermission();
    const enabled =
      authStatus === messaging.default().AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.default().AuthorizationStatus.PROVISIONAL;

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
 * Setup foreground notification handler
 * Shows in-app alert with sound for merchant order alerts
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

        // Play alert sound for new orders
        if (data?.type === 'NEW_ORDER') {
          playAlertSound();
        }

        // Show in-app alert
        Alert.alert(title, body, [
          { text: 'Dismiss', style: 'cancel' },
          data?.orderId
            ? { text: 'View', onPress: () => handleNotificationTap(data) }
            : { text: 'OK', style: 'default' },
        ]);
      });

      // Handle notification tap when app was in background
      messaging.default().onNotificationOpenedApp((remoteMessage) => {
        console.log('[FCM] Notification opened app:', remoteMessage);
        handleNotificationTap(remoteMessage.data);
      });

      // Check if app was opened from notification (killed state)
      messaging
        .default()
        .getInitialNotification()
        .then((remoteMessage) => {
          if (remoteMessage) {
            console.log('[FCM] App opened from quit state:', remoteMessage);
            handleNotificationTap(remoteMessage.data);
          }
        });

      console.log('[FCM] Foreground notification handler registered');
    })
    .catch((err) => {
      console.warn('[FCM] Setup foreground notifications failed:', err);
    });
}

/**
 * Play alert sound for new orders
 */
function playAlertSound(): void {
  // Import sound utility and play
  import('./sound').then(({ playAlertSound }) => {
    playAlertSound();
  }).catch(() => {
    // Sound module not available
  });
}

/**
 * Handle notification tap - navigate to relevant screen
 */
function handleNotificationTap(data?: Record<string, string>): void {
  if (!data) return;

  const { type, orderId } = data;

  switch (type) {
    case 'NEW_ORDER':
    case 'MERCHANT_ORDER_ALERT':
      if (orderId) {
        console.log('[FCM] Navigate to order:', orderId);
      }
      break;
    default:
      console.log('[FCM] Unknown notification type:', type);
  }
}
