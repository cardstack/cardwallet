import 'react-native-gesture-handler';
import './shim';

import lang from 'i18n-js';
import { language } from 'react-native-languages';

import { resources } from './src/languages';

const USE_STORYBOOK = true;

// Languages (i18n)
lang.defaultLocale = 'en';
lang.locale = language;
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
    require('./storybook');
  }
};

initializeApp();
