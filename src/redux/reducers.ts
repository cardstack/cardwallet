import appState from '@cardstack/redux/appState';
import biometryToggle from '@cardstack/redux/biometryToggleSlice';
import collectibles from '@cardstack/redux/collectibles';
import persistedFlags from '@cardstack/redux/persistedFlagsSlice';
import primarySafe from '@cardstack/redux/primarySafeSlice';
import remoteConfigSlice from '@cardstack/redux/remoteConfigSlice';
import requests from '@cardstack/redux/requests';
import welcomeBanner from '@cardstack/redux/welcomeBanner';

import contacts from './contacts';
import data from './data';
import imageMetadata from './imageMetadata';
import settings from './settings';
import walletconnect from './walletconnect';
import wallets from './wallets';

export default {
  appState,
  collectibles, // responsible for extracting collectibles (NFTs) from the assets state and fetching additional metadata for display
  contacts,
  data,
  imageMetadata,
  requests,
  settings,
  walletconnect,
  wallets,
  primarySafe,
  biometryToggle,
  welcomeBanner,
  persistedFlags,
  remoteConfigSlice,
};
