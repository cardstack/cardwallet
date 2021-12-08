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
import settings from './settings';
import swap from './swap';
import uniswap from './uniswap';
import uniswapLiquidity from './uniswapLiquidity';
import walletconnect from './walletconnect';
import wallets from './wallets';
import appState from '@cardstack/redux/appState';
import collectibles from '@cardstack/redux/collectibles';
import payment from '@cardstack/redux/payment';
import requests from '@cardstack/redux/requests';

export default {
  addCash,
  appState,
  coingecko,
  charts,
  collectibles, // responsible for extracting collectibles (NFTs) from the assets state and fetching additional metadata for display
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
  swap,
  uniswap,
  uniswapLiquidity,
  walletconnect,
  wallets,
  payment,
};
