import type { NavigatorScreenParams } from '@react-navigation/native';

import type { Phase1Route } from '../core/planner/domain/phase1Types';
import { FARHA_ROOT_ROUTES, FARHA_TAB_ROUTES } from './routes';

export type FarhaRouteParams = Phase1Route['params'];

export type FarhaTabParamList = {
  [FARHA_TAB_ROUTES.HOME]: FarhaRouteParams;
  [FARHA_TAB_ROUTES.BUDGET]: FarhaRouteParams;
  [FARHA_TAB_ROUTES.CHECKLIST]: FarhaRouteParams;
  [FARHA_TAB_ROUTES.SETTINGS]: FarhaRouteParams;
};

export type FarhaRootParamList = {
  [FARHA_ROOT_ROUTES.SPLASH]: FarhaRouteParams;
  [FARHA_ROOT_ROUTES.ONBOARDING]: FarhaRouteParams;
  [FARHA_ROOT_ROUTES.EVENT_CREATE]: FarhaRouteParams;
  [FARHA_ROOT_ROUTES.EVENT_LIST]: FarhaRouteParams;
  [FARHA_ROOT_ROUTES.EVENT_EDIT]: FarhaRouteParams;
  [FARHA_ROOT_ROUTES.BUDGET_ITEM_LIST]: FarhaRouteParams;
  [FARHA_ROOT_ROUTES.BUDGET_ITEM_FORM]: FarhaRouteParams;
  [FARHA_ROOT_ROUTES.CHECKLIST_ITEM_EDIT]: FarhaRouteParams;
  [FARHA_ROOT_ROUTES.SHARE_CARD_PREVIEW]: FarhaRouteParams;
  [FARHA_ROOT_ROUTES.PRO_UPGRADE]: FarhaRouteParams;
  [FARHA_ROOT_ROUTES.TABS]: NavigatorScreenParams<FarhaTabParamList>;
};
