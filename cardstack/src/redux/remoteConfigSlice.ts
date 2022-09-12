import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  forceFetch,
  loadRemoteConfigs,
  RemoteConfigValues,
} from '@cardstack/services/remote-config';
import { remoteConfigDefaults } from '@cardstack/services/remote-config/remoteConfigDefaults';

export const initRemoteConfigsThunk = createAsyncThunk(
  'remoteConfig/initRemoteConfigsThunk',
  loadRemoteConfigs
);

export const forceFetchRemoteConfigsThunk = createAsyncThunk(
  'remoteConfig/forceFetchRemoteConfigsThunk',
  forceFetch
);

const initialState: RemoteConfigValues = remoteConfigDefaults;

const remoteConfigSlice = createSlice({
  name: 'remoteConfigSlice',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(
      initRemoteConfigsThunk.fulfilled,
      (state, { payload }: PayloadAction<RemoteConfigValues>) => payload
    );

    builder.addCase(
      forceFetchRemoteConfigsThunk.fulfilled,
      (state, { payload }: PayloadAction<RemoteConfigValues>) => payload
    );
  },
});

export const { name: remoteConfigName } = remoteConfigSlice;

export default remoteConfigSlice.reducer;
