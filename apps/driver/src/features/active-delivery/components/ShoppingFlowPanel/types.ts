export interface ShoppingFlowPanelProps {
  estimatedBudget: number;
  onPhotosCapture: (uris: string[]) => void;
  onSendPhotos: () => void;
  onActualAmountConfirm: (amount: number, receiptUri: string) => void;
  isLoading: boolean;
  photosSent: boolean;
}
