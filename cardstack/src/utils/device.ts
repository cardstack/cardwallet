import { Platform } from 'react-native';

import { IAPProviderType } from '@cardstack/types';

import { screenHeight, screenWidth } from './dimension-utils';

const isIOS = Platform.OS === 'ios';
const isAndroid = Platform.OS === 'android';

const Device = {
  isAndroid,
  isIOS,
  screenHeight,
  screenWidth,
  cloudPlatform: isIOS ? 'iCloud' : 'Google Drive',
  keyboardBehavior: 'padding' as const,
  supportsFiatOnRamp: isIOS,
  supportsNativeWyreIntegration: isIOS,
  supportsHapticFeedback: isIOS,
  scrollSheetOffset: isIOS ? -(screenHeight * 0.2) : 1,
  tabBarHeightSize: screenHeight * 0.1,
  keyboardEventWillShow: isIOS
    ? ('keyboardWillShow' as const)
    : ('keyboardDidShow' as const),
  keyboardEventWillHide: isIOS
    ? ('keyboardWillHide' as const)
    : ('keyboardDidHide' as const),
  enableBackup: true,
  iap: {
    provider: isIOS ? IAPProviderType.apple : IAPProviderType.google,
    type: isIOS ? ('iap' as const) : ('inapp' as const),
    receiptKey: isIOS
      ? ('transactionReceipt' as const)
      : ('purchaseToken' as const),
    isConsumable: true,
  },
};

export { Device };
