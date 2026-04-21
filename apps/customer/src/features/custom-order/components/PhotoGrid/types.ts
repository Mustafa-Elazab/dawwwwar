export interface PhotoGridProps {
  photos: string[];
  onAdd: (photoUrl?: string) => void;
  onRemove: (index: number) => void;
  maxPhotos?: number;
}
