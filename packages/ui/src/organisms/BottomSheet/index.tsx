/**
 * BottomSheet — pure React Native implementation with NO native animated nodes.
 *
 * We deliberately avoid:
 *   1. @gorhom/bottom-sheet  → causes Reanimated to bundle twice via pnpm virtual store
 *   2. Animated API with useNativeDriver:true → causes "Animated node already exists"
 *      crash under React Native 0.84 New Architecture (Fabric)
 *
 * If you need the full Gorhom experience, import it directly inside the app,
 * NOT from this shared package.
 */
import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useCallback,
} from 'react';
import {
  Modal,
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  Platform,
} from 'react-native';
import { useTheme } from '@dawwar/theme';
import { radius } from '@dawwar/theme';
import type { BottomSheetRef, BottomSheetProps } from './types';

export const BottomSheet = forwardRef<BottomSheetRef, BottomSheetProps>(
  (
    {
      children,
      onClose,
      enablePanDownToClose = true,
      testID,
    },
    ref,
  ) => {
    const { colors } = useTheme();
    const [visible, setVisible] = useState(false);

    const open = useCallback(() => {
      setVisible(true);
    }, []);

    const close = useCallback(() => {
      setVisible(false);
      onClose?.();
    }, [onClose]);

    useImperativeHandle(ref, () => ({ open, close }));

    const handleBackdropPress = useCallback(() => {
      if (enablePanDownToClose) {
        close();
      }
    }, [enablePanDownToClose, close]);

    return (
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={handleBackdropPress}
        statusBarTranslucent={Platform.OS === 'android'}
        testID={testID}
      >
        <View style={styles.container}>
          {/* Backdrop */}
          <TouchableWithoutFeedback onPress={handleBackdropPress}>
            <View style={styles.backdrop} />
          </TouchableWithoutFeedback>

          {/* Sheet */}
          <View
            style={[
              styles.sheet,
              { backgroundColor: colors.card },
            ]}
          >
            {/* Handle bar */}
            <View style={[styles.handle, { backgroundColor: colors.border }]} />
            {children}
          </View>
        </View>
      </Modal>
    );
  },
);

BottomSheet.displayName = 'BottomSheet';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    borderTopLeftRadius: radius['2xl'],
    borderTopRightRadius: radius['2xl'],
    paddingBottom: 34,
    minHeight: 200,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: radius.full,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
});
