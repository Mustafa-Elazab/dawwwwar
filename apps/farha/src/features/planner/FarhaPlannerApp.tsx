import React from 'react';

import {
  BudgetCategoryListScreen,
  BudgetItemFormScreen,
  BudgetItemListScreen,
} from '../budget/screens';
import {
  ChecklistItemEditScreen,
  ChecklistTimelineScreen,
} from '../checklist/screens';
import {
  EventCreateScreen,
  EventDashboardScreen,
  EventEditScreen,
  EventListScreen,
} from '../events/screens';
import {
  OnboardingWelcomeScreen,
  SplashScreen,
} from '../onboarding/screens';
import { ProUpgradeScreen } from '../monetization/screens';
import { SettingsScreen } from '../settings/screens';
import { ShareCardPreviewScreen } from '../sharing/screens';
import { usePhase1Planner } from './hooks/usePhase1Planner';

export function FarhaPlannerApp() {
  const controller = usePhase1Planner();

  switch (controller.route.name) {
    case 'SplashScreen':
      return <SplashScreen controller={controller} />;
    case 'OnboardingWelcomeScreen':
      return <OnboardingWelcomeScreen controller={controller} />;
    case 'EventCreateScreen':
      return <EventCreateScreen controller={controller} />;
    case 'EventListScreen':
      return <EventListScreen controller={controller} />;
    case 'EventDashboardScreen':
      return <EventDashboardScreen controller={controller} />;
    case 'EventEditScreen':
      return <EventEditScreen controller={controller} />;
    case 'BudgetCategoryListScreen':
      return <BudgetCategoryListScreen controller={controller} />;
    case 'BudgetItemListScreen':
      return <BudgetItemListScreen controller={controller} />;
    case 'BudgetItemFormScreen':
      return <BudgetItemFormScreen controller={controller} />;
    case 'ChecklistTimelineScreen':
      return <ChecklistTimelineScreen controller={controller} />;
    case 'ChecklistItemEditScreen':
      return <ChecklistItemEditScreen controller={controller} />;
    case 'ShareCardPreviewScreen':
      return <ShareCardPreviewScreen controller={controller} />;
    case 'ProUpgradeScreen':
      return <ProUpgradeScreen controller={controller} />;
    case 'SettingsScreen':
      return <SettingsScreen controller={controller} />;
    default:
      return <SplashScreen controller={controller} />;
  }
}
