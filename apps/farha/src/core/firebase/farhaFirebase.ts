import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import messaging from '@react-native-firebase/messaging';
import perf from '@react-native-firebase/perf';

export type FarhaAnalyticsEvent =
  | 'event_created'
  | 'budget_item_added'
  | 'checklist_task_completed'
  | 'share_completed'
  | 'savings_contribution_added'
  | 'savings_allocation_confirmed'
  | 'pro_purchase_completed';

let initialized = false;

export async function initFarhaFirebaseServices(): Promise<void> {
  if (initialized) return;

  try {
    await crashlytics().setCrashlyticsCollectionEnabled(true);
    initialized = true;
  } catch {}
}

export function recordFarhaError(error: unknown, context: string): void {
  try {
    const normalized = error instanceof Error ? error : new Error(String(error));
    crashlytics().log(context);
    crashlytics().recordError(normalized);
  } catch {}
}

export function logFarhaEvent(
  name: FarhaAnalyticsEvent,
  params?: Record<string, string | number | boolean>,
): void {
  try {
    void analytics().logEvent(name, params);
  } catch {}
}

export function traceFarhaBootLoad<T>(operation: () => T): T {
  let trace: ReturnType<ReturnType<typeof perf>['newTrace']> | undefined;
  try {
    trace = perf().newTrace('farha_boot_mmkv_read');
    void trace.start().catch(() => undefined);
  } catch {}

  try {
    return operation();
  } finally {
    void trace?.stop().catch(() => undefined);
  }
}

export function registerFarhaMessagingToken(): void {
  void (async () => {
    try {
      await messaging().registerDeviceForRemoteMessages();
      await messaging().getToken();
    } catch (error) {
      recordFarhaError(error, 'farha_messaging_token_registration_failed');
    }
  })();
}
