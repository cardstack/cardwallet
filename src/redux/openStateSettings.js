import { saveSmallBalanceToggle } from '../handlers/localstorage/accountLocal';

// -- Constants ------------------------------------------------------------- //

const SET_OPEN_SAVINGS = 'openStateSettings/SET_OPEN_SAVINGS';
const SET_OPEN_SMALL_BALANCES = 'openStateSettings/SET_OPEN_SMALL_BALANCES';

export const setOpenSmallBalances = payload => (dispatch, getState) => {
  const { accountAddress, network } = getState().settings;
  saveSmallBalanceToggle(payload, accountAddress, network);
  dispatch({
    payload,
    type: SET_OPEN_SMALL_BALANCES,
  });
};

export const openSmallBalancesReducer = (state = false, action) => {
  switch (action.type) {
    case SET_OPEN_SMALL_BALANCES:
      return action.payload;
    default:
      return state;
  }
};

export const openSavingsReducer = (state = false, action) => {
  switch (action.type) {
    case SET_OPEN_SAVINGS:
      return action.payload;
    default:
      return state;
  }
};
