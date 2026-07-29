import { i18n } from '@dawwar/i18n';

export const farhaResources = {
  en: {
    farha: {
      m0: {
        title: 'Farha',
        eyebrow: 'Wedding and life-event planner',
        body: 'Your Farha workspace is connected to the Dawwar design system, theme, and Arabic/English localization.',
        readinessTitle: 'M0 readiness',
        workspaceReady: 'Workspace package wired as @dawwar/farha',
        themeReady: 'Shared theme provider active',
        i18nReady: 'Arabic and English copy registered locally',
        nextAction: 'Start M1 events and budget core',
      },
    },
  },
  ar: {
    farha: {
      m0: {
        title: 'فرحة',
        eyebrow: 'منظم الفرح والمناسبات',
        body: 'مساحة فرحة متصلة بنظام تصميم دوّار والثيم والترجمة العربية والإنجليزية.',
        readinessTitle: 'جاهزية M0',
        workspaceReady: 'تم ربط حزمة العمل باسم @dawwar/farha',
        themeReady: 'الثيم المشترك يعمل داخل التطبيق',
        i18nReady: 'تم تسجيل النصوص العربية والإنجليزية داخل التطبيق',
        nextAction: 'بدء M1 للأحداث والميزانية',
      },
    },
  },
} as const;

export const registerFarhaTranslations = () => {
  i18n.addResourceBundle('en', 'translation', farhaResources.en, true, true);
  i18n.addResourceBundle('ar', 'translation', farhaResources.ar, true, true);
};
