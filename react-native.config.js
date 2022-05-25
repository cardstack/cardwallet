module.exports = {
  assets: ['./cardstack/src/assets/fonts'],
  project: {
    android: {},
    ios: {},
  },
  dependencies: {
    'react-native-tooltips': {
      platforms: {
        ios: null,
      },
    },
    '@rainbow-me/react-native-payments': {
      platforms: {
        android: null,
      },
    },
  },
};
