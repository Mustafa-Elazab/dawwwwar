import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@dawwar/theme';

import type { Phase1PlannerController } from '../core/planner/usePhase1Planner';
import type { Phase1Route, Phase1ScreenName } from '../core/planner/domain/phase1Types';
import {
  EventCreateScreen,
  EventEditScreen,
  EventListScreen,
} from '../features/events/screens';
import { ProUpgradeScreen } from '../features/monetization/screens';
import { SplashScreen } from '../features/onboarding/screens';
import { TaskFormScreen } from '../features/tasks/screens';
import { FarhaTabs } from './FarhaTabs';
import { FARHA_ROOT_ROUTES } from './routes';
import type { FarhaRootParamList } from './types';
import { getPlannerTabForScreen } from './plannerTabs';

const RootStack = createNativeStackNavigator<FarhaRootParamList>();

interface FarhaNavigatorProps {
  controller: Phase1PlannerController;
}

export function FarhaNavigator({ controller }: FarhaNavigatorProps) {
  const navigationRef = useNavigationContainerRef<FarhaRootParamList>();
  const { colors } = useTheme();
  const [isReady, setIsReady] = useState(false);
  const lastRouteKeyRef = useRef<string | undefined>(undefined);

  const screenOptions = useMemo(
    () => ({
      headerShown: false,
      contentStyle: {
        backgroundColor: colors.background,
      },
    }),
    [colors.background],
  );

  useEffect(() => {
    if (!isReady || !navigationRef.isReady()) return;

    const routeKey = createRouteKey(controller.route);
    if (lastRouteKeyRef.current === routeKey) return;

    lastRouteKeyRef.current = routeKey;
    applyPhase1Route(navigationRef, controller.route);
  }, [controller.route, isReady, navigationRef]);

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => setIsReady(true)}
    >
      <RootStack.Navigator
        initialRouteName={FARHA_ROOT_ROUTES.SPLASH}
        screenOptions={screenOptions}
      >
        <RootStack.Screen name={FARHA_ROOT_ROUTES.SPLASH} component={SplashScreen} />
        <RootStack.Screen name={FARHA_ROOT_ROUTES.OCCASION_CREATE} component={EventCreateScreen} />
        <RootStack.Screen name={FARHA_ROOT_ROUTES.OCCASION_LIST} component={EventListScreen} />
        <RootStack.Screen name={FARHA_ROOT_ROUTES.OCCASION_EDIT} component={EventEditScreen} />
        <RootStack.Screen name={FARHA_ROOT_ROUTES.TASK_FORM} component={TaskFormScreen} />
        <RootStack.Screen name={FARHA_ROOT_ROUTES.PRO_UPGRADE} component={ProUpgradeScreen} />
        <RootStack.Screen name={FARHA_ROOT_ROUTES.TABS} component={FarhaTabs} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

function createRouteKey(route: Phase1Route) {
  return `${route.name}:${JSON.stringify(route.params ?? {})}`;
}

function applyPhase1Route(
  navigationRef: ReturnType<typeof useNavigationContainerRef<FarhaRootParamList>>,
  route: Phase1Route,
) {
  const tab = getPlannerTabForScreen(route.name);

  if (tab) {
    navigationRef.resetRoot({
      index: 0,
      routes: [
        {
          name: FARHA_ROOT_ROUTES.TABS,
          params: {
            screen: route.name,
            params: route.params,
          },
        },
      ],
    });
    return;
  }

  navigationRef.resetRoot({
    index: 0,
    routes: [
      {
        name: route.name as Exclude<Phase1ScreenName, 'OccasionDashboardScreen' | 'TaskListScreen' | 'ShareCardPreviewScreen' | 'SettingsScreen'>,
        params: route.params,
      },
    ],
  });
}
