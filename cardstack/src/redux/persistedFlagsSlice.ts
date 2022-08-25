import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

import { AppState } from '@rainbow-me/redux/store';

type SliceType = {
  hasSkippedProfileCreation: boolean;
};

const initialState: SliceType = {
  hasSkippedProfileCreation: false,
};

const slice = createSlice({
  name: 'persistedFlags',
  initialState,
  reducers: {
    skipProfileCreation(state, action: PayloadAction<boolean>) {
      state.hasSkippedProfileCreation = action.payload;
    },
  },
});

export const {
  name: persistedFlagsName,
  actions: { skipProfileCreation },
} = slice;

export const usePersistedFlagsSelector = () => {
  const persistedFlags = useSelector((state: AppState) => state.persistedFlags);

  return persistedFlags;
};

export default slice.reducer;