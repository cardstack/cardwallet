import { createSlice } from '@reduxjs/toolkit';

import { AppState } from '@rainbow-me/redux/store';

type SliceType = {
  enabled: boolean;
};

const initialState: SliceType = {
  enabled: false,
};

const slice = createSlice({
  name: 'biometryToggle',
  initialState,
  reducers: {
    toggleBiometry(state) {
      state.enabled = !state.enabled;
    },
  },
});

export const {
  name: biometryToggleSliceName,
  actions: { toggleBiometry },
} = slice;

export const selectBiometryEnabled = () => (state: AppState) =>
  state.biometryToggle.enabled;

export default slice.reducer;
