const SET_CURRENCY_CONVERSIONS = 'currencyConversions/SET_CURRENCY_CONVERSIONS';

export const setCurrencyConversionRates = rates => dispatch =>
  dispatch({
    rates,
    type: SET_CURRENCY_CONVERSIONS,
  });

export const INITIAL_CURRENCY_CONVERSION_STATE = {
  rates: {},
};

export default (state = INITIAL_CURRENCY_CONVERSION_STATE, action) => {
  switch (action.type) {
    case SET_CURRENCY_CONVERSIONS:
      return {
        ...state,
        rates: action.rates,
      };
    default:
      return state;
  }
};
