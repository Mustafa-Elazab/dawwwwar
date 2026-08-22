import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import {
  findNodeHandle,
  View,
  type LayoutChangeEvent,
  type ScrollView,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import type { FarhaPhase1WalkthroughStep } from '../../../core/planner/domain/phase1Types';

type WalkthroughTargetStep = Exclude<FarhaPhase1WalkthroughStep, 'completed'>;

export interface MeasuredWalkthroughTarget {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface RegisteredTarget {
  ref: React.RefObject<View | null>;
  scrollRef?: React.RefObject<ScrollView | null>;
  contentY?: number;
}

interface WalkthroughTargetController {
  registerTarget: (step: WalkthroughTargetStep, target: RegisteredTarget) => () => void;
  measureTarget: (
    step: WalkthroughTargetStep,
    viewportHeight: number,
  ) => Promise<MeasuredWalkthroughTarget | undefined>;
}

const WalkthroughTargetContext = createContext<WalkthroughTargetController | undefined>(undefined);

export function WalkthroughTargetProvider({ children }: { children: React.ReactNode }) {
  const targets = useRef(new Map<WalkthroughTargetStep, RegisteredTarget>());

  const registerTarget = useCallback((step: WalkthroughTargetStep, target: RegisteredTarget) => {
    targets.current.set(step, target);
    return () => {
      if (targets.current.get(step) === target) {
        targets.current.delete(step);
      }
    };
  }, []);

  const measureTarget = useCallback(async (
    step: WalkthroughTargetStep,
    viewportHeight: number,
  ) => {
    const target = targets.current.get(step);
    const firstMeasure = await measureRegisteredTarget(target);
    if (!target || !firstMeasure) return firstMeasure;

    const targetIsBelow = firstMeasure.top + firstMeasure.height > viewportHeight - 120;
    const targetIsAbove = firstMeasure.top < 96;
    if ((targetIsBelow || targetIsAbove) && target.scrollRef?.current && typeof target.contentY === 'number') {
      target.scrollRef.current.scrollTo({
        y: Math.max(target.contentY - 132, 0),
        animated: true,
      });
      await waitForLayout();
      return measureRegisteredTarget(target);
    }

    return firstMeasure;
  }, []);

  const value = useMemo(
    () => ({ registerTarget, measureTarget }),
    [measureTarget, registerTarget],
  );

  return (
    <WalkthroughTargetContext.Provider value={value}>
      {children}
    </WalkthroughTargetContext.Provider>
  );
}

export function useWalkthroughTargetController() {
  return useContext(WalkthroughTargetContext);
}

export function WalkthroughTarget({
  step,
  scrollRef,
  children,
  style,
}: {
  step: WalkthroughTargetStep;
  scrollRef?: React.RefObject<ScrollView | null>;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const controller = useWalkthroughTargetController();
  const ref = useRef<View>(null);
  const contentY = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!controller) return undefined;
    return controller.registerTarget(step, {
      ref,
      scrollRef,
      get contentY() {
        return contentY.current;
      },
    });
  }, [controller, scrollRef, step]);

  const onLayout = (event: LayoutChangeEvent) => {
    contentY.current = event.nativeEvent.layout.y;
  };

  return (
    <View ref={ref} collapsable={false} onLayout={onLayout} style={style}>
      {children}
    </View>
  );
}

const measureRegisteredTarget = (
  target?: RegisteredTarget,
): Promise<MeasuredWalkthroughTarget | undefined> =>
  new Promise((resolve) => {
    const node = target?.ref.current ? findNodeHandle(target.ref.current) : undefined;
    if (!target?.ref.current || !node) {
      resolve(undefined);
      return;
    }

    target.ref.current.measureInWindow((left, top, width, height) => {
      if (width <= 0 || height <= 0) {
        resolve(undefined);
        return;
      }
      resolve({ left, top, width, height });
    });
  });

const waitForLayout = () => new Promise((resolve) => setTimeout(resolve, 320));
