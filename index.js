import 'react-native-gesture-handler';
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
