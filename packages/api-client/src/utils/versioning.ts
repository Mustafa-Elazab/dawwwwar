import dayjs from 'dayjs';

/**
 * Checks if the incoming data is fresher than the current data.
 * Assumes both objects have an 'updatedAt' field (ISO string or Date).
 * 
 * Returns true if incoming is newer, false otherwise.
 */
export const isDataFresher = (current: any, incoming: any): boolean => {
  if (!incoming?.updatedAt) return true; // No versioning on incoming, accept it
  if (!current?.updatedAt) return true; // No current version, accept it

  return dayjs(incoming.updatedAt).isAfter(dayjs(current.updatedAt));
};

/**
 * Higher-order function to wrap a state update with a freshness check.
 */
export const withFreshness = <T>(
  current: T,
  incoming: T,
  updateFn: (data: T) => void
) => {
  if (isDataFresher(current, incoming)) {
    updateFn(incoming);
  } else {
    if (__DEV__) {
      console.log('[Versioning] Ignored stale update:', {
        incoming: (incoming as any).updatedAt,
        current: (current as any).updatedAt,
      });
    }
  }
};
