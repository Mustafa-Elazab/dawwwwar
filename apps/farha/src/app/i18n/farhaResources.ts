import { i18n } from '@dawwar/i18n';
import { phase1Resources } from './phase1Resources';

export const farhaResources = {
  en: {
    farha: {
      phase1: phase1Resources.en,
    },
  },
  ar: {
    farha: {
      phase1: phase1Resources.ar,
    },
  },
} as const;

export const registerFarhaTranslations = () => {
  i18n.addResourceBundle('en', 'translation', farhaResources.en, true, true);
  i18n.addResourceBundle('ar', 'translation', farhaResources.ar, true, true);
};
