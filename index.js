import 'react-native-gesture-handler';
/**
 * Default RN url has some odd behaviors like adding a trailing slash at the end of the address
 * when a query param is appended which makes the url not be found, so it's being replaced
 * with react-native-url-polyfill which is full implementation of the WHATWG URL Standard
 * */
import 'react-native-url-polyfill/auto';
import '@walletconnect/react-native-compat';

import './shim';

const USE_STORYBOOK = false;

const initializeApp = () => {
  if (!USE_STORYBOOK) {
    require('./src/App');
  } else {
    require('./cardstack/storybook');
  }
};

initializeApp();
