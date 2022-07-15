import { createSlice } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

import { AppState } from '@rainbow-me/redux/store';

type SliceType = {
  dismissedByUser: boolean;
  requestedCardDrop: boolean;
};

const initialState: SliceType = {
  dismissedByUser: false,
  requestedCardDrop: false,
};

const slice = createSlice({
  name: 'welcomeBanner',
  initialState,
  reducers: {
    dismissBanner(state) {
      state.dismissedByUser = true;
    },
    setRequestedCardDrop(state) {
      state.requestedCardDrop = true;
    },
  },
});

export const {
  name: welcomeBannerSliceName,
  actions: { dismissBanner, setRequestedCardDrop },
} = slice;

export const useWelcomeBannerSelector = () => {
  const welcomeBannerState = useSelector(
    (state: AppState) => state.welcomeBanner
  );

  return welcomeBannerState;
};

export default slice.reducer;
