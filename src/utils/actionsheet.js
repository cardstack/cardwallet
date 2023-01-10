import { ActionSheetIOS } from 'react-native';
import ActionSheet from 'react-native-action-sheet';

import { Device } from '@cardstack/utils';

export default function showActionSheetWithOptions(...args) {
  if (Device.isIOS) {
    ActionSheetIOS.showActionSheetWithOptions(...args);
  } else {
    ActionSheet.showActionSheetWithOptions(...args);
  }
}
