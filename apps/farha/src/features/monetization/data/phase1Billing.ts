import type { EventSubscription, Purchase, PurchaseError } from 'react-native-iap';

export type Phase1BillingSource = 'playBilling';

export interface Phase1BillingResult {
  entitled: boolean;
  source: Phase1BillingSource;
}

export interface Phase1BillingAdapter {
  initConnection: () => Promise<boolean>;
  fetchProducts: (request: { skus: string[]; type: 'in-app' }) => Promise<unknown>;
  requestPurchase: (request: {
    request: {
      apple: { sku: string };
      google: { skus: string[] };
    };
    type: 'in-app';
  }) => Promise<unknown>;
  purchaseUpdatedListener: (listener: (purchase: Purchase) => void) => EventSubscription;
  purchaseErrorListener: (listener: (error: PurchaseError) => void) => EventSubscription;
  finishTransaction: (request: { purchase: Purchase; isConsumable: boolean }) => Promise<unknown>;
  getAvailablePurchases: () => Promise<Purchase[]>;
}

export interface Phase1BillingClient {
  purchasePro: () => Promise<Phase1BillingResult>;
  restorePro: () => Promise<Phase1BillingResult>;
}

const FARHA_PRO_SKU = 'farha_pro_lifetime';
const PURCHASE_TIMEOUT_MS = 120000;

export const createPhase1BillingClient = (
  adapterLoader: () => Promise<Phase1BillingAdapter> = createReactNativeIapAdapter,
): Phase1BillingClient => ({
  async purchasePro() {
    const adapter = await adapterLoader();
    await adapter.initConnection();
    await adapter.fetchProducts({ skus: [FARHA_PRO_SKU], type: 'in-app' });

    return new Promise<Phase1BillingResult>((resolve, reject) => {
      const cleanupCallbacks: Array<() => void> = [];
      const timeout = setTimeout(() => {
        cleanup();
        reject(new Error('Farha Pro purchase timed out'));
      }, PURCHASE_TIMEOUT_MS);

      const cleanup = () => {
        clearTimeout(timeout);
        cleanupCallbacks.forEach((callback) => callback());
      };

      cleanupCallbacks.push(
        adapter.purchaseUpdatedListener((purchase) => {
          if (!isFarhaProPurchase(purchase)) return;

          void adapter.finishTransaction({ purchase, isConsumable: false })
            .catch(() => undefined)
            .finally(() => {
              cleanup();
              resolve({ entitled: true, source: 'playBilling' });
            });
        }).remove,
      );
      cleanupCallbacks.push(
        adapter.purchaseErrorListener((error) => {
          cleanup();
          reject(error);
        }).remove,
      );

      void adapter.requestPurchase({
        request: {
          apple: { sku: FARHA_PRO_SKU },
          google: { skus: [FARHA_PRO_SKU] },
        },
        type: 'in-app',
      }).catch((error) => {
        cleanup();
        reject(error);
      });
    });
  },

  async restorePro() {
    const adapter = await adapterLoader();
    await adapter.initConnection();
    const purchases = await adapter.getAvailablePurchases();
    const proPurchase = purchases.find(isFarhaProPurchase);
    if (proPurchase) {
      await adapter.finishTransaction({ purchase: proPurchase, isConsumable: false }).catch(() => undefined);
    }

    return {
      entitled: !!proPurchase,
      source: 'playBilling',
    };
  },
});

async function createReactNativeIapAdapter(): Promise<Phase1BillingAdapter> {
  const iap = await import('react-native-iap');

  return {
    initConnection: iap.initConnection,
    fetchProducts: iap.fetchProducts,
    requestPurchase: iap.requestPurchase,
    purchaseUpdatedListener: iap.purchaseUpdatedListener,
    purchaseErrorListener: iap.purchaseErrorListener,
    finishTransaction: iap.finishTransaction,
    getAvailablePurchases: iap.getAvailablePurchases,
  };
}

function isFarhaProPurchase(purchase: Purchase): boolean {
  return purchase.productId === FARHA_PRO_SKU;
}
