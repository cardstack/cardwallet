import { StackNavigationOptions } from '@react-navigation/stack';
import { Routes } from './routes';
import { horizontalInterpolator } from './presetOptions';
import {
  BuyPrepaidCard,
  DepotScreen,
  MerchantScreen,
  PrepaidCardModal,
  SendSheetDepot,
  ShowQRCodeModal,
  TransactionConfirmation,
} from '@cardstack/screen';
import { colors } from '@cardstack/theme';
import { expandedPreset, sheetPreset } from '@rainbow-me/navigation/effects';

interface ScreenNavigation {
  component: React.ComponentType<any>;
  options?: StackNavigationOptions;
}

export const Screens: Record<keyof typeof Routes, ScreenNavigation> = {
  DEPOT_SCREEN: { component: DepotScreen, options: horizontalInterpolator },
  MERCHANT_SCREEN: {
    component: MerchantScreen,
    options: horizontalInterpolator,
  },
  PREPAID_CARD_MODAL: {
    component: PrepaidCardModal,
    options: expandedPreset as StackNavigationOptions,
  },
  BUY_PREPAID_CARD: { component: BuyPrepaidCard },
  CONFIRM_REQUEST: {
    component: TransactionConfirmation,
    options: { gestureEnabled: false },
  },
  SEND_FLOW_DEPOT: {
    component: SendSheetDepot,
    options: sheetPreset as StackNavigationOptions,
  },
  SHOW_QRCODE_MODAL: {
    component: ShowQRCodeModal,
    options: {
      allowsDragToDismiss: true,
      backgroundColor: colors.overlayGray,
      backgroundOpacity: 0.95,
      transparentCard: true,
      onAppear: null,
      topOffset: 0,
      ignoreBottomOffset: true,
      cornerRadius: 0,
      customStack: true,
      springDamping: 1,
      transitionDuration: 0.2,
    } as StackNavigationOptions,
  },
};
