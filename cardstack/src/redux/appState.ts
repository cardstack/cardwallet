import { AnyAction } from 'redux';
import { AppDispatch } from '@rainbow-me/redux/store';

// -- Constants --------------------------------------- //
const APP_STATE_UPDATE = 'contacts/APP_STATE_UPDATE';
// -- Actions ---------------------------------------- //

// -- Reducer ----------------------------------------- //
const INITIAL_STATE = {
  walletReady: false,
};

export const appStateUpdate = (stateToUpdate: { walletReady: boolean }) => (
  dispatch: AppDispatch
) => {
  dispatch({
    payload: stateToUpdate,
    type: APP_STATE_UPDATE,
  });
};

export default (state = INITIAL_STATE, action: AnyAction) => {
  switch (action.type) {
    case APP_STATE_UPDATE:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
