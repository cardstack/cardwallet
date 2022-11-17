import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { MerchantSafeType, NetworkType } from '@cardstack/types';

import { AppState } from '@rainbow-me/redux/store';

interface AccountType {
  [accountAddress: string]: {
    primary?: MerchantSafeType;
  };
}

type SliceType = Record<NetworkType, AccountType>;

const initialState: SliceType = Object.keys(NetworkType).reduce(
  (arr: any, key: string) => {
    arr[key] = {};

    return arr;
  },
  {}
);

const slice = createSlice({
  // Using a more generic slice name to avoid a migration in the future.
  name: 'primarySafe',
  initialState,
  reducers: {
    changePrimarySafe(
      state,
      {
        payload,
      }: PayloadAction<{
        network: NetworkType;
        accountAddress: string;
        primary: MerchantSafeType;
      }>
    ) {
      state[payload.network] = {
        [payload.accountAddress]: { primary: payload.primary },
      };
    },
  },
});

export const {
  name: primarySafeSliceName,
  actions: { changePrimarySafe },
} = slice;

export const selectPrimarySafe = (
  network: NetworkType,
  accountAddress: string
) => (state: AppState): MerchantSafeType | undefined =>
  state.primarySafe?.[network]?.[accountAddress]?.primary;

export default slice.reducer;
