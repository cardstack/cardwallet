import { AnyAction } from 'redux';
import { NativeCurrency } from '@cardstack/cardpay-sdk/sdk/currencies';
import { getNativeCurrency } from '@rainbow-me/handlers/localstorage/globalSettings';
import { AppDispatch } from '@rainbow-me/redux/store';
import logger from 'logger';

// -- Constants ------------------------------------------------------------- //

const PAYMENT_UPDATE_CURRENCY_SUCCESS =
  'payment/PAYMENT_UPDATE_CURRENCY_SUCCESS';

const PAYMENT_PROCESS_REQUEST = 'payment/PAYMENT_PROCESS_REQUEST';

const PAYMENT_PROCESS_SUCCESS = 'payment/PAYMENT_PROCESS_SUCCESS';

const PAYMENT_PROCESS_FAILURE = 'payment/PAYMENT_PROCESS_FAILURE';

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

export const paymentProcessStart = (
  processTitle?: string,
  processSubTitle?: string
) => async (dispatch: AppDispatch) => {
  try {
    dispatch({
      payload: { processTitle, processSubTitle },
      type: PAYMENT_PROCESS_REQUEST,
    });
  } catch (error) {
    logger.log('Error in payment process start', error);
  }
};

export const paymentProcessDone = () => async (dispatch: AppDispatch) => {
  try {
    dispatch({
      type: PAYMENT_PROCESS_SUCCESS,
    });
  } catch (error) {
    logger.log('Error in payment process', error);
  }
};

// -- Reducer --------------------------------------------------------------- //
export const INITIAL_STATE = {
  currency: NativeCurrency.USD,
  inProcess: false,
  processTitle: undefined,
  processSubTitle: undefined,
};

export default (state = INITIAL_STATE, action: AnyAction) => {
  switch (action.type) {
    case PAYMENT_UPDATE_CURRENCY_SUCCESS:
      return {
        ...state,
        currency: action.payload,
      };
    case PAYMENT_PROCESS_REQUEST:
      return {
        ...state,
        inProcess: true,
        processTitle: action.payload.processTitle,
        processSubTitle: action.payload.processSubTitle,
      };
    case PAYMENT_PROCESS_SUCCESS:
      return {
        ...state,
        inProcess: false,
        processTitle: undefined,
        processSubTitle: undefined,
      };
    case PAYMENT_PROCESS_FAILURE:
      return {
        ...state,
        inProcess: false,
        processTitle: undefined,
        processSubTitle: undefined,
      };
    default:
      return state;
  }
};
