import 'react-native-gesture-handler';
/**
 * Default RN url has some odd behaviors like adding a trailing slash at the end of the address
 * when a query param is appended which makes the url not be found, so it's being replaced
 * with react-native-url-polyfill which is full implementation of the WHATWG URL Standard
 * */
import 'react-native-url-polyfill/auto';
import '@walletconnect/react-native-compat';

import './shim';

import lang from 'i18n-js';
import { getLocales } from 'react-native-localize';
import { resources } from './src/languages';

const USE_STORYBOOK = false;

// Languages (i18n)
lang.defaultLocale = 'en';
lang.locale = getLocales()?.[0]?.languageCode || 'en';
lang.fallbacks = true;

lang.translations = Object.assign(
  {},
  ...Object.keys(resources).map(key => ({
    [key]: resources[key].translation,
  }))
);

const initializeApp = () => {
  if (!USE_STORYBOOK) {
    require('./src/App');
  } else {
    require('./cardstack/storybook');
  }
};

initializeApp();
