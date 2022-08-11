import { useCallback, useRef } from 'react';

const DEFAULT_BOUNCE_RATE = 2000;

/**
 * useDebounce: simple way to avoid too fast or duplicated actions to happen.
 * @returns func debounce, to wrap any function to avoid bounces.
 */
export const useDebounce = (bounceRate = DEFAULT_BOUNCE_RATE) => {
  const busy = useRef(false);

  const debounce = useCallback(
    async (callback: () => void) => {
      setTimeout(() => {
        busy.current = false;
      }, bounceRate);

      if (!busy.current) {
        busy.current = true;
        callback();
      }
    },
    [bounceRate]
  );

  return { debounce };
};
