import { AdEventType, InterstitialAd, TestIds } from 'react-native-google-mobile-ads';

import { recordFarhaError } from '../../../core/firebase/farhaFirebase';
import { canRequestFarhaAds } from './adConsent';

let lastShownAt = 0;
let shownThisSession = false;

export function showBudgetItemSavedInterstitial(isPro: boolean): void {
  if (!canRequestFarhaAds(isPro) || shownThisSession) return;

  const now = Date.now();
  if (now - lastShownAt < 4 * 60 * 1000) return;

  try {
    const interstitial = InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL, {
      requestNonPersonalizedAdsOnly: true,
    });
    const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      shownThisSession = true;
      lastShownAt = Date.now();
      void interstitial.show().catch((error) =>
        recordFarhaError(error, 'farha_interstitial_show_failed'),
      );
    });
    const unsubscribeError = interstitial.addAdEventListener(AdEventType.ERROR, (error) => {
      unsubscribeLoaded();
      unsubscribeError();
      recordFarhaError(error, 'farha_interstitial_load_failed');
    });
    const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      unsubscribeLoaded();
      unsubscribeError();
      unsubscribeClosed();
    });

    interstitial.load();
  } catch (error) {
    recordFarhaError(error, 'farha_interstitial_create_failed');
  }
}
