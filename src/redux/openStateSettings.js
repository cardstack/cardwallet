import produce from 'immer';
import {
  getOpenFamilies,
  getSavingsToggle,
  getSmallBalanceToggle,
  saveOpenFamilies,
  saveSavingsToggle,
  saveSmallBalanceToggle,
} from '../handlers/localstorage/accountLocal';

// -- Constants ------------------------------------------------------------- //
const OPEN_STATE_SETTINGS_LOAD_SUCCESS =
  'openStateSettings/OPEN_STATE_SETTINGS_LOAD_SUCCESS';
const OPEN_STATE_SETTINGS_LOAD_FAILURE =
  'openStateSettings/OPEN_STATE_SETTINGS_LOAD_FAILURE';
const CLEAR_OPEN_STATE_SETTINGS = 'openStateSettings/CLEAR_OPEN_STATE_SETTINGS';
const PUSH_OPEN_FAMILY_TAB = 'openStateSettings/PUSH_OPEN_FAMILY_TAB';
const SET_OPEN_FAMILY_TABS = 'openStateSettings/SET_OPEN_FAMILY_TABS';
const SET_OPEN_SAVINGS = 'openStateSettings/SET_OPEN_SAVINGS';
const SET_OPEN_SMALL_BALANCES = 'openStateSettings/SET_OPEN_SMALL_BALANCES';

// -- Actions --------------------------------------------------------------- //
export const openStateSettingsLoadState = () => async (dispatch, getState) => {
  try {
    const { accountAddress, network } = getState().settings;
    const openSavings = await getSavingsToggle(accountAddress, network);
    const openSmallBalances = await getSmallBalanceToggle(
      accountAddress,
      network
    );
    const openFamilyTabs = await getOpenFamilies(accountAddress, network);
    dispatch({
      payload: {
        openFamilyTabs,
        openSavings,
        openSmallBalances,
      },
      type: OPEN_STATE_SETTINGS_LOAD_SUCCESS,
    });
  } catch (error) {
    dispatch({ type: OPEN_STATE_SETTINGS_LOAD_FAILURE });
  }
};

export const setOpenSavings = payload => (dispatch, getState) => {
  const { accountAddress, network } = getState().settings;
  saveSavingsToggle(payload, accountAddress, network);
  dispatch({
    payload,
    type: SET_OPEN_SAVINGS,
  });
};

export const setOpenSmallBalances = payload => (dispatch, getState) => {
  const { accountAddress, network } = getState().settings;
  saveSmallBalanceToggle(payload, accountAddress, network);
  dispatch({
    payload,
    type: SET_OPEN_SMALL_BALANCES,
  });
};

export const pushOpenFamilyTab = payload => dispatch =>
  dispatch({
    payload,
    type: PUSH_OPEN_FAMILY_TAB,
  });

export const setOpenFamilyTabs = payload => (dispatch, getState) => {
  const { accountAddress, network } = getState().settings;
  const { openFamilyTabs } = getState().openStateSettings;
  const updatedFamilyTabs = {
    ...openFamilyTabs,
    [payload.index]: payload.state,
  };
  saveOpenFamilies(updatedFamilyTabs, accountAddress, network);
  dispatch({
    payload: updatedFamilyTabs,
    type: SET_OPEN_FAMILY_TABS,
  });
};

export const resetOpenStateSettings = () => dispatch =>
  dispatch({
    type: CLEAR_OPEN_STATE_SETTINGS,
  });

// -- Reducer --------------------------------------------------------------- //
export const INITIAL_STATE = {
  openFamilyTabs: {},
};

export default (state = INITIAL_STATE, action) =>
  produce(state, draft => {
    if (action.type === OPEN_STATE_SETTINGS_LOAD_SUCCESS) {
      draft.openFamilyTabs = action.payload.openFamilyTabs;
    } else if (action.type === SET_OPEN_FAMILY_TABS) {
      draft.openFamilyTabs = action.payload;
    } else if (action.type === PUSH_OPEN_FAMILY_TAB) {
      draft.openFamilyTabs = action.payload;
    } else if (action.type === CLEAR_OPEN_STATE_SETTINGS) {
      return INITIAL_STATE;
    }
  });

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
