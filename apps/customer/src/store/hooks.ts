import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '.';

// Typed dispatch — use this instead of raw useDispatch()
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Typed selector — use this instead of raw useSelector()
export const useAppSelector = <T>(selector: (state: RootState) => T): T =>
  useSelector(selector);
