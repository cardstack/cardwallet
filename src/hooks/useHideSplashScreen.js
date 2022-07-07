import { useCallback } from 'react';
import { InteractionManager, StatusBar } from 'react-native';
import RNBootSplash from 'react-native-bootsplash';

export default function useHideSplashScreen() {
  return useCallback(() => {
    RNBootSplash.hide({ fade: true });

    if (android) {
      StatusBar.setBackgroundColor('transparent', false);
      StatusBar.setTranslucent(true);
    }
    // show the StatusBar
    (ios && StatusBar.setHidden(false, 'fade')) ||
      InteractionManager.runAfterInteractions(() => {
        StatusBar.setHidden(false, 'fade');
      });
  }, []);
}
