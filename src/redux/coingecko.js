const SET_COINS = 'coingecko/SET_COINS';

export const setCoingeckoCoins = coins => dispatch =>
  dispatch({
    coins,
    type: SET_COINS,
  });

export const INITIAL_COINGECKO_STATE = {
  coins: [],
};

export default (state = INITIAL_COINGECKO_STATE, action) => {
  switch (action.type) {
    case SET_COINS:
      return {
        ...state,
        coins: action.coins,
      };
    default:
      return state;
  }
};
