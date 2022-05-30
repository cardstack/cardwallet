import { useEffect } from 'react';
import { NativeModules } from 'react-native';

import { Device } from '@cardstack/utils';

type AndroidKeyboardMode = 'nothing' | 'pan' | 'resize';

export const useAndroidKeyboardMode = (
  mode: AndroidKeyboardMode = 'resize' // our default in androidmanifest.
) => {
  useEffect(() => {
    if (Device.isAndroid) {
      switch (mode) {
        case 'pan':
          NativeModules?.AndroidKeyboardAdjust.setAdjustPan();
          break;
        case 'resize':
          NativeModules?.AndroidKeyboardAdjust.setAdjustResize();
          break;
        case 'nothing':
        default:
          NativeModules?.AndroidKeyboardAdjust.setAdjustNothing();
          break;
      }
    }
  }, [mode]);
};
