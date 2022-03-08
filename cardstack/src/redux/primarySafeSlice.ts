import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '@rainbow-me/redux/store';
import { MerchantSafeType } from '@cardstack/types';
import { Network } from '@rainbow-me/helpers/networkTypes';

interface AccountType {
  [accountAddress: string]: {
    primary?: MerchantSafeType;
  };
}

type SliceType = Record<Network, AccountType>;

const initialState: SliceType = Object.keys(Network).reduce(
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
        network: Network;
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

export const selectPrimarySafe = (network: Network, accountAddress: string) => (
  state: AppState
) => state.primarySafe?.[network]?.[accountAddress]?.primary;

export default slice.reducer;
