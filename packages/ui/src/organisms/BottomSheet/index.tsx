import React, { forwardRef, useImperativeHandle, useRef, useCallback } from 'react';
import { View } from 'react-native';
import GorhomBottomSheet, {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { useTheme } from '@dawwar/theme';
import { createStyles } from './styles';
import type { BottomSheetRef, BottomSheetProps } from './types';

export const BottomSheet = forwardRef<BottomSheetRef, BottomSheetProps>(
  (
    {
      snapPoints = ['50%'],
      children,
      onClose,
      enablePanDownToClose = true,
      testID,
    },
    ref,
  ) => {
    const { colors } = useTheme();
    const styles = createStyles(colors);
    const sheetRef = useRef<GorhomBottomSheet>(null);

    useImperativeHandle(ref, () => ({
      open: () => sheetRef.current?.expand(),
      close: () => sheetRef.current?.close(),
    }));

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
        />
      ),
      [],
    );

    return (
      <GorhomBottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={enablePanDownToClose}
        onClose={onClose}
        backdropComponent={renderBackdrop}
        handleComponent={() => <View style={styles.handle} />}
        backgroundStyle={styles.background}
        testID={testID}
      >
        {children}
      </GorhomBottomSheet>
    );
  },
);

BottomSheet.displayName = 'BottomSheet';
