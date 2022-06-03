import contacts from './contacts';
import data from './data';
import fallbackExplorer from './fallbackExplorer';
import gas from './gas';
import imageMetadata from './imageMetadata';
import keyboardHeight from './keyboardHeight';
import settings from './settings';
import walletconnect from './walletconnect';
import wallets from './wallets';
import appState from '@cardstack/redux/appState';
import biometryToggle from '@cardstack/redux/biometryToggleSlice';
import collectibles from '@cardstack/redux/collectibles';
import localAuthentication from '@cardstack/redux/localAuthenticationSlice';
import primarySafe from '@cardstack/redux/primarySafeSlice';
import requests from '@cardstack/redux/requests';

export default {
  appState,
  collectibles, // responsible for extracting collectibles (NFTs) from the assets state and fetching additional metadata for display
  contacts,
  data,
  fallbackExplorer,
  gas,
  imageMetadata,
  keyboardHeight,
  requests,
  settings,
  walletconnect,
  wallets,
  primarySafe,
  biometryToggle,
  localAuthentication,
};
