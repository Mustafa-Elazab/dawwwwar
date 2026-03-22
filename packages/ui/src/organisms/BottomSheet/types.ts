import type { BottomSheetModal } from '@gorhom/bottom-sheet';

export interface BottomSheetRef {
  open: () => void;
  close: () => void;
}

export interface BottomSheetProps {
  snapPoints?: (string | number)[];
  children: React.ReactNode;
  onClose?: () => void;
  enablePanDownToClose?: boolean;
  testID?: string;
}
