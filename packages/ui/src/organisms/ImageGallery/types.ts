export interface ImageGalleryProps {
  images: string[];
  initialIndex?: number;
  onClose: () => void;
  testID?: string;
}
