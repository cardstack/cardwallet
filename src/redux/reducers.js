import { combineReducers } from 'redux';

import addCash from './addCash';
import charts from './charts';
import coingecko from './coingecko';
import contacts from './contacts';
import currencyConversion from './currencyConversion';
import data from './data';
import editOptions from './editOptions';
import explorer from './explorer';
import fallbackExplorer from './fallbackExplorer';
import gas from './gas';
import imageMetadata from './imageMetadata';
import keyboardHeight from './keyboardHeight';
import multicall from './multicall';
import openStateSettings, {
  openSavingsReducer,
  openSmallBalancesReducer,
} from './openStateSettings';
import raps from './raps';
import requests from './requests';
import settings from './settings';
import showcaseTokens from './showcaseTokens';
import swap from './swap';
import uniqueTokens from './uniqueTokens';
import uniswap from './uniswap';
import uniswapLiquidity from './uniswapLiquidity';
import walletconnect from './walletconnect';
import wallets from './wallets';
import appState from '@cardstack/redux/appState';
import payment from '@cardstack/redux/payment';

export default combineReducers({
  addCash,
  appState,
  coingecko,
  charts,
  contacts,
  currencyConversion,
  data,
  editOptions,
  explorer,
  fallbackExplorer,
  gas,
  imageMetadata,
  keyboardHeight,
  multicall,
  openSavings: openSavingsReducer,
  openSmallBalances: openSmallBalancesReducer,
  openStateSettings,
  raps,
  requests,
  settings,
  showcaseTokens,
  swap,
  uniqueTokens,
  uniswap,
  uniswapLiquidity,
  walletconnect,
  wallets,
  payment,
});
