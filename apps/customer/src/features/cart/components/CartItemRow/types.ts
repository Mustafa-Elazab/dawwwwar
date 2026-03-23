import type { CartItem } from '../../../../store/slices/cart.slice';

export interface CartItemRowProps {
  item: CartItem;
  onAdd: () => void;
  onRemove: () => void;
}
