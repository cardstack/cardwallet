import RNRestart from 'react-native-restart';
import {
  getNativeCurrency,
  getNetwork,
  saveLanguage,
  saveNativeCurrency,
  saveNetwork,
} from '../handlers/localstorage/globalSettings';
import { etherWeb3SetHttpProvider } from '../handlers/web3';
import networkTypes from '../helpers/networkTypes';
import { updateLanguage } from '../languages';

import { ethereumUtils, promiseUtils } from '../utils';
import { addCashClearState } from './addCash';
import { dataResetState } from './data';
import { explorerClearState } from './explorer';
import {
  fallbackExplorerClearState,
  fallbackExplorerInit,
} from './fallbackExplorer';
import { resetOpenStateSettings } from './openStateSettings';
import { uniswapResetState } from './uniswap';
import { uniswapLiquidityResetState } from './uniswapLiquidity';
import { walletConnectUpdateSessions } from './walletconnect';
import { collectiblesResetState } from '@cardstack/redux/collectibles';
import { requestsResetState } from '@cardstack/redux/requests';
import { getExchangeRatesQuery } from '@cardstack/services/hub/hub-service';
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
export const settingsLoadState = () => async dispatch => {
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
    const chainId = ethereumUtils.getChainIdFromNetwork(network);
    await etherWeb3SetHttpProvider(network);

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
  dispatch({
    payload: accountAddress,
    type: SETTINGS_UPDATE_SETTINGS_ADDRESS,
  });
  dispatch(walletConnectUpdateSessions());
};

export const resetAccountState = async dispatch => {
  const p0 = dispatch(explorerClearState());
  const p1 = dispatch(dataResetState());
  const p2 = dispatch(collectiblesResetState());
  const p3 = dispatch(resetOpenStateSettings());
  const p4 = dispatch(requestsResetState());
  const p5 = dispatch(uniswapResetState());
  const p6 = dispatch(uniswapLiquidityResetState());
  const p7 = dispatch(addCashClearState());
  await promiseUtils.PromiseAllWithFails([p0, p1, p2, p3, p4, p5, p6, p7]);
};

export const settingsUpdateNetwork = network => async dispatch => {
  try {
    await saveNetwork(network);
    await resetAccountState(dispatch);
    // Creates tag on Sentry labeling the current network.
    logger.setTag('network', network);
    RNRestart.Restart(); // restart app so it reloads with updated network
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
  dispatch(fallbackExplorerClearState());
  try {
    dispatch({
      payload: nativeCurrency,
      type: SETTINGS_UPDATE_NATIVE_CURRENCY_SUCCESS,
    });
    dispatch(fallbackExplorerInit());
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
  network: networkTypes.xdai,
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
