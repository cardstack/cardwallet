import { createSlice } from '@reduxjs/toolkit';

import { AppState } from '@rainbow-me/redux/store';

type SliceType = {
  authenticated: boolean;
};

const initialState: SliceType = {
  authenticated: false,
};

const slice = createSlice({
  name: 'localAuthentication',
  initialState,
  reducers: {
    authenticate(state) {
      state.authenticated = true;
    },
    revoke(state) {
      state.authenticated = false;
    },
  },
});

export const {
  name: localAuthenticationSliceName,
  actions: { authenticate, revoke },
} = slice;

export const selectIsLocallyAuthenticated = () => (state: AppState) =>
  state.localAuthentication.authenticated;

export default slice.reducer;
