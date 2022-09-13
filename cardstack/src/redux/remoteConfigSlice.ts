import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  forceFetch,
  loadRemoteConfigs,
  RemoteConfigValues,
} from '@cardstack/services/remote-config';
import { remoteConfigDefaults } from '@cardstack/services/remote-config/remoteConfigDefaults';

import logger from 'logger';

interface RemoteConfigSliceType {
  configs: RemoteConfigValues;
  isInitializing: boolean;
  isReady: boolean;
}

export const initRemoteConfigsThunk = createAsyncThunk(
  'remoteConfig/initRemoteConfigsThunk',
  loadRemoteConfigs
);

export const forceFetchRemoteConfigsThunk = createAsyncThunk(
  'remoteConfig/forceFetchRemoteConfigsThunk',
  forceFetch
);

const initialState: RemoteConfigSliceType = {
  configs: remoteConfigDefaults,
  isInitializing: false,
  isReady: false,
};

const remoteConfigSlice = createSlice({
  name: 'remoteConfigSlice',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(initRemoteConfigsThunk.pending, state => {
      state.isInitializing = true;

      return state;
    });

    builder.addCase(
      initRemoteConfigsThunk.fulfilled,
      (state, { payload }: PayloadAction<RemoteConfigValues>) => {
        state.configs = payload;
        state.isInitializing = false;
        state.isReady = true;

        return state;
      }
    );

    builder.addCase(initRemoteConfigsThunk.rejected, (state, { error }) => {
      state.isInitializing = false;
      state.isReady = true;

      logger.sentry("Couldn't fetch remote config", error);

      return state;
    });

    builder.addCase(
      forceFetchRemoteConfigsThunk.fulfilled,
      (state, { payload }: PayloadAction<RemoteConfigValues>) => {
        state.configs = payload;

        return state;
      }
    );
  },
});

export const { name: remoteConfigName } = remoteConfigSlice;

export default remoteConfigSlice.reducer;
