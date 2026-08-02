export type Phase1BillingSource = 'localEntitlement' | 'playBilling';

export interface Phase1BillingResult {
  entitled: boolean;
  source: Phase1BillingSource;
}

export interface Phase1BillingClient {
  purchasePro: () => Promise<Phase1BillingResult>;
  restorePro: () => Promise<Phase1BillingResult>;
}

export const createPhase1BillingClient = (): Phase1BillingClient => ({
  async purchasePro() {
    return { entitled: true, source: 'localEntitlement' };
  },
  async restorePro() {
    return { entitled: true, source: 'localEntitlement' };
  },
});
