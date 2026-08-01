import React from 'react';

import { usePhase1Planner } from './hooks/usePhase1Planner';
import {
  BudgetCategoryListScreen,
  BudgetItemFormScreen,
  BudgetItemListScreen,
  ChecklistItemEditScreen,
  ChecklistTimelineScreen,
  EventCreateScreen,
  EventDashboardScreen,
  EventEditScreen,
  EventListScreen,
  OnboardingWelcomeScreen,
  ProUpgradeScreen,
  SettingsScreen,
  ShareCardPreviewScreen,
  SplashScreen,
} from './screens/Phase1Screens';

export function FarhaPhase1App() {
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
