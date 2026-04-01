export interface MapPickerModalProps {
  visible: boolean;
  initialLatitude?: number;
  initialLongitude?: number;
  onConfirm: (lat: number, lng: number, address: string) => void;
  onClose: () => void;
}
