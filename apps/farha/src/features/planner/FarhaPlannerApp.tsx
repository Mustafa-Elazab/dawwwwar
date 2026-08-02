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
import { PlannerControllerProvider } from './context/PlannerControllerContext';
import type { Phase1ScreenName } from './domain/phase1Types';
import { usePhase1Planner } from './hooks/usePhase1Planner';

export function FarhaPlannerApp() {
  const controller = usePhase1Planner();

  return (
    <PlannerControllerProvider controller={controller}>
      <FarhaPlannerRoute routeName={controller.route.name} />
    </PlannerControllerProvider>
  );
}

interface FarhaPlannerRouteProps {
  routeName: Phase1ScreenName;
}

function FarhaPlannerRoute({ routeName }: FarhaPlannerRouteProps) {
  switch (routeName) {
    case 'SplashScreen':
      return <SplashScreen />;
    case 'OnboardingWelcomeScreen':
      return <OnboardingWelcomeScreen />;
    case 'EventCreateScreen':
      return <EventCreateScreen />;
    case 'EventListScreen':
      return <EventListScreen />;
    case 'EventDashboardScreen':
      return <EventDashboardScreen />;
    case 'EventEditScreen':
      return <EventEditScreen />;
    case 'BudgetCategoryListScreen':
      return <BudgetCategoryListScreen />;
    case 'BudgetItemListScreen':
      return <BudgetItemListScreen />;
    case 'BudgetItemFormScreen':
      return <BudgetItemFormScreen />;
    case 'ChecklistTimelineScreen':
      return <ChecklistTimelineScreen />;
    case 'ChecklistItemEditScreen':
      return <ChecklistItemEditScreen />;
    case 'ShareCardPreviewScreen':
      return <ShareCardPreviewScreen />;
    case 'ProUpgradeScreen':
      return <ProUpgradeScreen />;
    case 'SettingsScreen':
      return <SettingsScreen />;
    default:
      return <SplashScreen />;
  }
}
