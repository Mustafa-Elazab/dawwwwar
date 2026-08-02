import { m0ReadinessTranslationKeys } from '../src/features/home/data/readiness';

describe('m0ReadinessTranslationKeys', () => {
  it('keeps the readiness checklist aligned with M0 scope', () => {
    expect(m0ReadinessTranslationKeys).toEqual([
      'farha.m0.workspaceReady',
      'farha.m0.themeReady',
      'farha.m0.i18nReady',
    ]);
  });
});
