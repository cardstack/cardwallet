import { StackNavigationOptions } from '@react-navigation/stack';
import { Routes } from './routes';
import { horizontalInterpolator } from './presetOptions';
import {
  BuyPrepaidCard,
  DepotScreen,
  MerchantScreen,
  PayMerchantCustomAmount,
  PayMerchantUniversalLink,
  PrepaidCardModal,
  SendSheetDepot,
  ShowQRCodeModal,
  TransactionConfirmation,
} from '@cardstack/screen';
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
    options: sheetPreset as StackNavigationOptions,
  },
  PAY_MERCHANT_LINK: {
    component: PayMerchantUniversalLink,
  },
  PAY_MERCHANT_CUSTOM_AMOUNT: {
    component: PayMerchantCustomAmount,
    options: expandedPreset as StackNavigationOptions,
  },
};

export const linking = {
  prefixes: [
    'https://wallet.cardstack.com',
    'https://wallet-staging.stack.cards',
    'cardwallet://',
  ],
  config: {
    screens: {
      [Routes.PAY_MERCHANT_LINK]: 'pay/:network/:merchantAddress',
    },
  },
};
