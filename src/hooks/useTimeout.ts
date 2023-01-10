import { useCallback, useEffect, useRef } from 'react';

export default function useTimeout() {
  const timeout = useRef<number>();

  const start = useCallback((func, ms) => {
    timeout.current = (setTimeout(func, ms) as unknown) as number;
  }, []);

  const stop = useCallback(() => {
    timeout.current && clearTimeout(timeout.current);
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => stop(), []);

  return { startTimeout: start, stopTimeout: stop };
}
