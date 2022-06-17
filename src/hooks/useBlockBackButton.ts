import { useNavigation } from '@react-navigation/native';
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
  const navigation = useNavigation();

  useEffect(() => {
    RNBackHandler?.setBlockBackButton(true);
    return () => RNBackHandler?.setBlockBackButton(false);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      e.preventDefault();
    });

    return unsubscribe;
  }, [navigation]);
}
