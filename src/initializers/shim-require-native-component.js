// eslint-disable-next-line import/default
import ReactNative from 'react-native';

// If using the crypto shim, uncomment the following line to ensure
// crypto is loaded first, so it can populate global.crypto
// eslint-disable-next-line import/no-commonjs
require('crypto');

const description = Object.getOwnPropertyDescriptor(
  ReactNative,
  'requireNativeComponent'
);

if (!description.writable) {
  Object.defineProperty(ReactNative, 'requireNativeComponent', {
    value: (function () {
      const cache = {};
      const _requireNativeComponent = ReactNative.requireNativeComponent;

      return function requireNativeComponent(nativeComponent) {
        if (!cache[nativeComponent]) {
          cache[nativeComponent] = _requireNativeComponent(nativeComponent);
        }

        return cache[nativeComponent];
      };
    })(),
    writable: true,
  });
}
