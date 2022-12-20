import { getConstantByNetwork } from '@cardstack/cardpay-sdk';
import {
  getNativeCurrency,
  getNetwork,
  saveLanguage,
  saveNativeCurrency,
  saveNetwork,
} from '../handlers/localstorage/globalSettings';
import { updateLanguage } from '../languages';

import { dataResetState } from './data';
import { walletConnectUpdateSessions } from './walletconnect';
import { collectiblesResetState } from '@cardstack/redux/collectibles';
import { requestsResetState } from '@cardstack/redux/requests';
import { getExchangeRatesQuery } from '@cardstack/services/hub/hub-service';
import { NetworkType } from '@cardstack/types';
import { mapDispatchToActions, restartApp } from '@cardstack/utils';
import { saveAddress } from '@rainbow-me/model/wallet';
import logger from 'logger';

// -- Constants ------------------------------------------------------------- //

const SETTINGS_UPDATE_SETTINGS_ADDRESS =
  'settings/SETTINGS_UPDATE_SETTINGS_ADDRESS';
const SETTINGS_UPDATE_NATIVE_CURRENCY_SUCCESS =
  'settings/SETTINGS_UPDATE_NATIVE_CURRENCY_SUCCESS';
const SETTINGS_UPDATE_LANGUAGE_SUCCESS =
  'settings/SETTINGS_UPDATE_LANGUAGE_SUCCESS';
const SETTINGS_UPDATE_NETWORK_SUCCESS =
  'settings/SETTINGS_UPDATE_NETWORK_SUCCESS';

// -- Actions --------------------------------------------------------------- //
export const settingsLoadCurrency = () => async dispatch => {
  try {
    const nativeCurrency = await getNativeCurrency();

    await getExchangeRatesQuery();

    dispatch({
      payload: nativeCurrency,
      type: SETTINGS_UPDATE_NATIVE_CURRENCY_SUCCESS,
    });
  } catch (error) {
    logger.log('Error loading native currency', error);
  }
};

export const settingsLoadNetwork = () => async dispatch => {
  try {
    const network = await getNetwork();

    const chainId = getConstantByNetwork('chainId', network);

    // Creates tag on Sentry labeling the current network.
    logger.setTag('network', network);

    dispatch({
      payload: { chainId, network },
      type: SETTINGS_UPDATE_NETWORK_SUCCESS,
    });
  } catch (error) {
    logger.error('Error loading network settings', error);
  }
};

export const settingsUpdateAccountAddress = accountAddress => async dispatch => {
  await saveAddress(accountAddress);

  dispatch({
    payload: accountAddress,
    type: SETTINGS_UPDATE_SETTINGS_ADDRESS,
  });
  dispatch(walletConnectUpdateSessions());
};

export const resetAccountState = () => async dispatch => {
  const actions = [dataResetState, collectiblesResetState, requestsResetState];

  await Promise.allSettled(mapDispatchToActions(dispatch, actions));
};

export const settingsUpdateNetwork = network => async () => {
  try {
    await saveNetwork(network);
    // Creates tag on Sentry labeling the current network.
    logger.setTag('network', network);
    restartApp(); // restart app so it reloads with updated network
  } catch (error) {
    logger.log('Error updating network settings', error);
  }
};

export const settingsChangeLanguage = language => async dispatch => {
  updateLanguage(language);
  try {
    dispatch({
      payload: language,
      type: SETTINGS_UPDATE_LANGUAGE_SUCCESS,
    });
    saveLanguage(language);
  } catch (error) {
    logger.log('Error changing language', error);
  }
};

export const settingsChangeNativeCurrency = nativeCurrency => async dispatch => {
  dispatch(dataResetState());
  try {
    dispatch({
      payload: nativeCurrency,
      type: SETTINGS_UPDATE_NATIVE_CURRENCY_SUCCESS,
    });
    saveNativeCurrency(nativeCurrency);
  } catch (error) {
    logger.log('Error changing native currency', error);
  }
};

// -- Reducer --------------------------------------------------------------- //
export const INITIAL_STATE = {
  accountAddress: '',
  chainId: 100,
  language: 'en',
  nativeCurrency: 'USD',
  network: NetworkType.gnosis,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SETTINGS_UPDATE_SETTINGS_ADDRESS:
      return {
        ...state,
        accountAddress: action.payload,
      };
    case SETTINGS_UPDATE_NATIVE_CURRENCY_SUCCESS:
      return {
        ...state,
        nativeCurrency: action.payload,
      };
    case SETTINGS_UPDATE_NETWORK_SUCCESS:
      return {
        ...state,
        chainId: action.payload.chainId,
        network: action.payload.network,
      };
    case SETTINGS_UPDATE_LANGUAGE_SUCCESS:
      return {
        ...state,
        language: action.payload,
      };
    default:
      return state;
  }
};
