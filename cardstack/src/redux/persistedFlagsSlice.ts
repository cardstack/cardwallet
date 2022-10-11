import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppState } from '@rainbow-me/redux/store';

type SliceType = {
  hasSkippedProfileCreation: boolean;
  hasSkippedBackup: boolean;
};

const initialState: SliceType = {
  hasSkippedProfileCreation: false,
  hasSkippedBackup: false,
};

const slice = createSlice({
  name: 'persistedFlags',
  initialState,
  reducers: {
    skipProfileCreation(state, action: PayloadAction<boolean>) {
      state.hasSkippedProfileCreation = action.payload;
    },
    skipBackup(state, action: PayloadAction<boolean>) {
      state.hasSkippedBackup = action.payload;
    },
    clearFlags() {
      return initialState;
    },
  },
});

export const {
  name: persistedFlagsName,
  actions: { skipProfileCreation, skipBackup, clearFlags },
} = slice;

export const usePersistedFlagsSelector = () => {
  const persistedFlags = useSelector((state: AppState) => state.persistedFlags);

  return persistedFlags;
};

export const usePersistedFlagsActions = () => {
  const dispatch = useDispatch();

  const triggerSkipProfileCreation = useCallback(() => {
    dispatch(skipProfileCreation(true));
  }, [dispatch]);

  const triggerSkipBackup = useCallback(() => {
    dispatch(skipBackup(true));
  }, [dispatch]);

  return {
    triggerSkipProfileCreation,
    triggerSkipBackup,
  };
};

export default slice.reducer;
