import { useCallback, useState } from 'react';

export const useBooleanState = (
  initialStateBoolean = false
): [boolean, () => void, () => void] => {
  const [bool, setBool] = useState(initialStateBoolean);

  const setTrue = useCallback(() => setBool(true), []);
  const setFalse = useCallback(() => setBool(false), []);

  return [bool, setTrue, setFalse];
};
