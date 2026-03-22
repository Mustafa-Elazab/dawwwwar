/**
 * Simulates network latency. Use in every mock function.
 * Default: 800ms — feels real, not too slow for development.
 * Use 300ms for list refreshes, 1200ms for order placement.
 */
export const delay = (ms = 800): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
