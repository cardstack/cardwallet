import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { skipProfileCreation } from '../persistedFlagsSlice';

export const usePersistedFlags = () => {
  const dispatch = useDispatch();

  const triggerSkipProfileCreation = useCallback(() => {
    dispatch(skipProfileCreation(true));
  }, [dispatch]);

  return {
    triggerSkipProfileCreation,
  };
};
