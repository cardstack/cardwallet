import charts from './charts';
import coingecko from './coingecko';
import contacts from './contacts';
import data from './data';
import editOptions from './editOptions';
import fallbackExplorer from './fallbackExplorer';
import gas from './gas';
import imageMetadata from './imageMetadata';
import keyboardHeight from './keyboardHeight';
import {
  openSavingsReducer,
  openSmallBalancesReducer,
} from './openStateSettings';
import raps from './raps';
import settings from './settings';
import swap from './swap';
import uniswap from './uniswap';
import uniswapLiquidity from './uniswapLiquidity';
import walletconnect from './walletconnect';
import wallets from './wallets';
import appState from '@cardstack/redux/appState';
import collectibles from '@cardstack/redux/collectibles';
import primarySafe from '@cardstack/redux/primarySafeSlice';
import requests from '@cardstack/redux/requests';

export default {
  appState,
  coingecko,
  charts,
  collectibles, // responsible for extracting collectibles (NFTs) from the assets state and fetching additional metadata for display
  contacts,
  data,
  editOptions,
  fallbackExplorer,
  gas,
  imageMetadata,
  keyboardHeight,
  openSavings: openSavingsReducer,
  openSmallBalances: openSmallBalancesReducer,
  raps,
  requests,
  settings,
  swap,
  uniswap,
  uniswapLiquidity,
  walletconnect,
  wallets,
  primarySafe,
};
