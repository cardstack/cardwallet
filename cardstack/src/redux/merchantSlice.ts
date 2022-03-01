import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '@rainbow-me/redux/store';
import { MerchantSafeType } from '@cardstack/types';

type SliceState = {
  primary?: MerchantSafeType;
};

const initialState: SliceState = {
  primary: undefined,
};

const slice = createSlice({
  name: 'merchant',
  initialState,
  reducers: {
    changePrimaryMerchant(
      state,
      { payload }: PayloadAction<{ primary: MerchantSafeType }>
    ) {
      state.primary = payload.primary;
    },
  },
});

export const { changePrimaryMerchant } = slice.actions;

export default slice.reducer;

export const selectPrimaryMerchantSafe = (state: AppState) =>
  state.merchant.primary;
