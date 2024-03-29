import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppState } from '@rainbow-me/redux/store';

type SliceType = {
  hasSkippedProfileCreation: boolean;
  hasSkippedBackup: boolean;
  hasSkippedNotificationPermission: boolean;
};

const initialState: SliceType = {
  hasSkippedProfileCreation: false,
  hasSkippedBackup: false,
  hasSkippedNotificationPermission: false,
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
    skipNotificationPermission(state, action: PayloadAction<boolean>) {
      state.hasSkippedNotificationPermission = action.payload;
    },
    clearFlags() {
      return initialState;
    },
  },
});

export const {
  name: persistedFlagsName,
  actions: {
    skipProfileCreation,
    skipBackup,
    skipNotificationPermission,
    clearFlags,
  },
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

  const triggerSkipNotificationPermission = useCallback(() => {
    dispatch(skipNotificationPermission(true));
  }, [dispatch]);

  return {
    triggerSkipProfileCreation,
    triggerSkipBackup,
    triggerSkipNotificationPermission,
  };
};

export default slice.reducer;
