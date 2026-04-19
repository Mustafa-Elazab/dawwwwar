export interface RatingBarProps {
  rating: number;       // 0.0 – 5.0
  maxStars?: number;    // default 5
  size?: number;        // star size in px, default 20
  readOnly?: boolean;
  onRate?: (rating: number) => void;
  showValue?: boolean;
  testID?: string;
}
