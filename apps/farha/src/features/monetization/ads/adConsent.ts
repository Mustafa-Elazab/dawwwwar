import mobileAds, { AdsConsent } from 'react-native-google-mobile-ads';

export const ADS_ENABLED = false;

let consentReady = false;

export async function initializeFarhaAds(): Promise<void> {
  if (!ADS_ENABLED) return;

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
  return ADS_ENABLED && !isPro && consentReady;
}
