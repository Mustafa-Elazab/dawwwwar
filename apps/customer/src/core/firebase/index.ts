/**
 * Dawwar — Firebase Analytics + Crashlytics utility
 *
 * Call `initFirebaseServices()` once at app startup.
 * All calls are safe — they silently no-op if Firebase isn't configured.
 */
import crashlytics from '@react-native-firebase/crashlytics';
import analytics from '@react-native-firebase/analytics';

let initialized = false;

export async function initFirebaseServices(): Promise<void> {
  if (initialized) return;
  try {
    await crashlytics().setCrashlyticsCollectionEnabled(true);
    initialized = true;
    console.log('[Firebase] Crashlytics + Analytics initialized');
  } catch (err) {
    console.warn('[Firebase] Init skipped:', err);
  }
}

// ── Crashlytics ─────────────────────────────────────────────────────

export function setUserId(userId: string): void {
  try {
    crashlytics().setUserId(userId);
    analytics().setUserId(userId);
  } catch {}
}

export function setUserRole(role: string): void {
  try {
    crashlytics().setAttribute('role', role);
    analytics().setUserProperty('user_role', role);
  } catch {}
}

export function logError(error: Error, context?: string): void {
  try {
    if (context) crashlytics().log(context);
    crashlytics().recordError(error);
  } catch {}
}

export function logBreadcrumb(message: string): void {
  try {
    crashlytics().log(message);
  } catch {}
}

export function testCrash(): void {
  crashlytics().crash();
}

// ── Analytics ───────────────────────────────────────────────────────

export async function logEvent(
  name: string,
  params?: Record<string, string | number | boolean>,
): Promise<void> {
  try {
    await analytics().logEvent(name, params);
  } catch {}
}

export async function logScreenView(screenName: string, screenClass?: string): Promise<void> {
  try {
    await analytics().logScreenView({
      screen_name: screenName,
      screen_class: screenClass ?? screenName,
    });
  } catch {}
}

// ── Dawwar business events ──────────────────────────────────────────

export const DawwarEvents = {
  // Auth
  otpSent: (phone: string) => logEvent('otp_sent', { phone_prefix: phone.slice(0, 5) }),
  otpVerified: () => logEvent('otp_verified'),
  loginSuccess: (role: string) => logEvent('login_success', { role }),
  roleSelected: (role: string) => logEvent('role_selected', { role }),

  // Customer
  searchPerformed: (query: string) => logEvent('search_performed', { query_length: query.length }),
  merchantViewed: (merchantId: string, name: string) =>
    logEvent('merchant_viewed', { merchant_id: merchantId, merchant_name: name }),
  productAddedToCart: (productId: string, price: number) =>
    logEvent('add_to_cart', { product_id: productId, price }),
  orderPlaced: (orderId: string, total: number, paymentMethod: string) =>
    logEvent('order_placed', { order_id: orderId, total, payment_method: paymentMethod }),
  orderCancelled: (orderId: string) => logEvent('order_cancelled', { order_id: orderId }),
  tipAdded: (orderId: string, amount: number) =>
    logEvent('tip_added', { order_id: orderId, amount }),
  reviewSubmitted: (orderId: string, rating: number) =>
    logEvent('review_submitted', { order_id: orderId, rating }),
  favoriteAdded: (merchantId: string) => logEvent('favorite_added', { merchant_id: merchantId }),
  promoCodeApplied: (code: string) => logEvent('promo_code_applied', { code }),

  // Merchant
  orderAccepted: (orderId: string) => logEvent('order_accepted_merchant', { order_id: orderId }),
  orderRejected: (orderId: string) => logEvent('order_rejected_merchant', { order_id: orderId }),
  orderMarkedReady: (orderId: string) => logEvent('order_marked_ready', { order_id: orderId }),
  merchantWentOnline: () => logEvent('merchant_went_online'),
  merchantWentOffline: () => logEvent('merchant_went_offline'),
  productCreated: (productId: string) => logEvent('product_created', { product_id: productId }),

  // Driver
  driverWentOnline: () => logEvent('driver_went_online'),
  driverWentOffline: () => logEvent('driver_went_offline'),
  deliveryAccepted: (orderId: string) => logEvent('delivery_accepted', { order_id: orderId }),
  deliveryDeclined: (orderId: string) => logEvent('delivery_declined', { order_id: orderId }),
  deliveryStatusUpdated: (orderId: string, status: string) =>
    logEvent('delivery_status_updated', { order_id: orderId, status }),
  deliveryCompleted: (orderId: string) => logEvent('delivery_completed', { order_id: orderId }),

  // Wallet
  walletRecharged: (amount: number) => logEvent('wallet_recharged', { amount }),

  // Navigation
  screenView: (screen: string) => logScreenView(screen),
} as const;
