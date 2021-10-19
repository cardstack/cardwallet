import { AnyAction } from 'redux';
import { NativeCurrency } from '@cardstack/cardpay-sdk/sdk/currencies';
import { getNativeCurrency } from '@rainbow-me/handlers/localstorage/globalSettings';
import { AppDispatch } from '@rainbow-me/redux/store';
import logger from 'logger';

// -- Constants ------------------------------------------------------------- //

const PAYMENT_UPDATE_CURRENCY_SUCCESS =
  'payment/PAYMENT_UPDATE_CURRENCY_SUCCESS';

// -- Actions --------------------------------------------------------------- //
export const paymentLoadState = () => async (dispatch: AppDispatch) => {
  try {
    const nativeCurrency = await getNativeCurrency();
    dispatch({
      payload: nativeCurrency,
      type: PAYMENT_UPDATE_CURRENCY_SUCCESS,
    });
  } catch (error) {
    logger.log('Error loading native currency', error);
  }
};

export const paymentChangeCurrency = (currency: string) => async (
  dispatch: AppDispatch
) => {
  try {
    dispatch({
      payload: currency,
      type: PAYMENT_UPDATE_CURRENCY_SUCCESS,
    });
  } catch (error) {
    logger.log('Error changing native currency', error);
  }
};

// -- Reducer --------------------------------------------------------------- //
export const INITIAL_STATE = {
  currency: NativeCurrency.USD,
};

export default (state = INITIAL_STATE, action: AnyAction) => {
  switch (action.type) {
    case PAYMENT_UPDATE_CURRENCY_SUCCESS:
      return {
        ...state,
        currency: action.payload,
      };
    default:
      return state;
  }
};
