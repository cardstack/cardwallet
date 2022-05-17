import { useCallback, useEffect } from 'react';

import { useBooleanState } from '@cardstack/hooks';

import { useTimeout } from '@rainbow-me/hooks';

export default function useInvalidPaste() {
  const [startTimeout, stopTimeout] = useTimeout();

  const [isInvalidPaste, setInvalid, unsetInvalid] = useBooleanState();

  const onInvalidPaste = useCallback(() => {
    stopTimeout();
    setInvalid();
  }, [setInvalid, stopTimeout]);

  // ⏰️ Reset isInvalidPaste value after 3 seconds.
  useEffect(() => {
    if (isInvalidPaste) {
      stopTimeout();
      startTimeout(unsetInvalid, 3000);
    }
  }, [isInvalidPaste, unsetInvalid, startTimeout, stopTimeout]);

  // 🚪️ Reset isInvalidPaste when we leave the screen
  useEffect(() => () => unsetInvalid(), [unsetInvalid]);

  return {
    isInvalidPaste,
    onInvalidPaste,
  };
}
