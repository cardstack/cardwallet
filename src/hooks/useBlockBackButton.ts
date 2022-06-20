import { useEffect } from 'react';
import { NativeModules } from 'react-native';

// RNBackHandler might be undefined
// Bc it doesn't exist on ios
interface LocalNativeModule {
  RNBackHandler?: {
    setBlockBackButton: (flag: boolean) => void;
  };
}

const { RNBackHandler } = NativeModules as LocalNativeModule;

export function useBlockBackButton() {
  useEffect(() => {
    RNBackHandler?.setBlockBackButton(true);
    return () => RNBackHandler?.setBlockBackButton(false);
  }, []);
}
