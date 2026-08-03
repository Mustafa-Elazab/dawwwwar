import mobileAds, { AdsConsent } from 'react-native-google-mobile-ads';

let consentReady = false;

export async function initializeFarhaAds(): Promise<void> {
  try {
    await AdsConsent.requestInfoUpdate();
    await AdsConsent.loadAndShowConsentFormIfRequired();
    await mobileAds().initialize();
    consentReady = true;
  } catch {
    consentReady = false;
  }
}

export function canRequestFarhaAds(isPro: boolean): boolean {
  return !isPro && consentReady;
}
