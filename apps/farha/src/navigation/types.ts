import type { NavigatorScreenParams } from '@react-navigation/native';

import type { Phase1Route } from '../core/planner/domain/phase1Types';
import { FARHA_ROOT_ROUTES, FARHA_TAB_ROUTES } from './routes';

export type FarhaRouteParams = Phase1Route['params'];

export type FarhaTabParamList = {
  [FARHA_TAB_ROUTES.HOME]: FarhaRouteParams;
  [FARHA_TAB_ROUTES.TASKS]: FarhaRouteParams;
  [FARHA_TAB_ROUTES.SHARE]: FarhaRouteParams;
  [FARHA_TAB_ROUTES.SETTINGS]: FarhaRouteParams;
};

export type FarhaRootParamList = {
  [FARHA_ROOT_ROUTES.SPLASH]: FarhaRouteParams;
  [FARHA_ROOT_ROUTES.OCCASION_CREATE]: FarhaRouteParams;
  [FARHA_ROOT_ROUTES.OCCASION_LIST]: FarhaRouteParams;
  [FARHA_ROOT_ROUTES.OCCASION_EDIT]: FarhaRouteParams;
  [FARHA_ROOT_ROUTES.TASK_FORM]: FarhaRouteParams;
  [FARHA_ROOT_ROUTES.PRO_UPGRADE]: FarhaRouteParams;
  [FARHA_ROOT_ROUTES.TABS]: NavigatorScreenParams<FarhaTabParamList>;
};
