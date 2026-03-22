import React from 'react';
import { ScreenTemplate } from '../ScreenTemplate';
import type { ScreenTemplateProps } from '../ScreenTemplate/types';

// TabScreenTemplate is ScreenTemplate with bottom edge excluded.
// The tab bar itself handles the bottom safe area.
export function TabScreenTemplate({
  edges = ['top'],  // no 'bottom' — tab bar handles it
  ...rest
}: ScreenTemplateProps) {
  return <ScreenTemplate edges={edges} {...rest} />;
}
