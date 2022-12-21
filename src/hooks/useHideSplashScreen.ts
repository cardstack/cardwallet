import { useCallback } from 'react';
import { InteractionManager, StatusBar } from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import { Device } from '@cardstack/utils';

export default function useHideSplashScreen() {
  return useCallback(() => {
    RNBootSplash.hide({ fade: true });

    if (Device.isAndroid) {
      StatusBar.setBackgroundColor('transparent', false);
      StatusBar.setTranslucent(true);
    }
    // show the StatusBar
    (Device.isIOS && StatusBar.setHidden(false, 'fade')) ||
      InteractionManager.runAfterInteractions(() => {
        StatusBar.setHidden(false, 'fade');
      });
  }, []);
}
