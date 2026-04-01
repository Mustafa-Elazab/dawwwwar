export interface PhotoGridProps {
  photos: string[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  maxPhotos?: number;
}
