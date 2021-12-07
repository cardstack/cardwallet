// eslint-disable-next-line import/default
import ReactNative from 'react-native';

if (
  !global.__reanimatedModuleProxy &&
  !ReactNative.TurboModuleRegistry.get('NativeReanimated')
) {
  global.__reanimatedModuleProxy = {
    __shimmed: true,
    installCoreFunctions() {},
    makeMutable(init) {
      return { value: init };
    },
    makeRemote() {},
    makeShareable() {
      return () => {};
    },
    registerEventHandler() {},
    startMapper() {},
    stopMapper() {},
    unregisterEventHandler() {},
  };
}
