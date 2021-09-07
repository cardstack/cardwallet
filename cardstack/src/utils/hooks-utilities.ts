import { useCallback, useState } from 'react';

interface WorkerBase {
  isLoading: boolean;
  error: Error | undefined;
  setIsLoading: (_: boolean) => void;
  setError: (_: Error | undefined) => void;
}

export const useWorker = <T extends readonly any[], TReturn>(
  worker: (...args: T) => Promise<TReturn>,
  deps: readonly any[]
): WorkerBase & {
  callback: (...args: T) => Promise<TReturn | undefined>;
} => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>();

  const callback = useCallback(async (...args: T): Promise<
    TReturn | undefined
  > => {
    try {
      setError(undefined);
      setIsLoading(true);

      const result = await worker(...args);

      return result;
    } catch (e) {
      setError(e as Error);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return {
    callback,
    error,
    isLoading,
    setError,
    setIsLoading,
  };
};
