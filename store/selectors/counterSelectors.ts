import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Selector cơ bản
const selectCounterState = (state: RootState) => state.counter;

// Selector memoized
export const selectCount = createSelector(
  [selectCounterState],
  (counterState) => counterState.value
);

// Selector với logic
export const selectIsPositive = createSelector(
  [selectCount],
  (count) => count > 0
);

// Selector với logic phức tạp hơn
export const selectCountStatus = createSelector(
  [selectCount],
  (count) => {
    if (count === 0) return 'zero';
    if (count > 0) return 'positive';
    return 'negative';
  }
); 