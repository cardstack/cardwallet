import { StackNavigationOptions } from '@react-navigation/stack';
import { MainRoutes, GlobalRoutes } from './routes';
import { horizontalInterpolator } from './presetOptions';
import {
  BuyPrepaidCard,
  CurrencySelectionGlobalModal,
  DepotScreen,
  MerchantScreen,
  PayMerchant,
  PrepaidCardModal,
  SendSheetDepot,
  ShowQRCodeModal,
  TransactionConfirmation,
} from '@cardstack/screen';
import { expandedPreset, sheetPreset } from '@rainbow-me/navigation/effects';
import { nativeStackModalConfig } from '@rainbow-me/navigation/config';

interface ScreenNavigation {
  component: React.ComponentType<any>;
  options?: StackNavigationOptions;
}

export const MainScreens: Record<keyof typeof MainRoutes, ScreenNavigation> = {
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
  SEND_FLOW_DEPOT: {
    component: SendSheetDepot,
    options: sheetPreset as StackNavigationOptions,
  },
};

export const GlobalScreens: Record<
  keyof typeof GlobalRoutes,
  ScreenNavigation
> = {
  CONFIRM_REQUEST: {
    component: TransactionConfirmation,
    options: { gestureEnabled: false },
  },
  SHOW_QRCODE_MODAL: {
    component: ShowQRCodeModal,
    options: nativeStackModalConfig as StackNavigationOptions,
  },
  PAY_MERCHANT: {
    component: PayMerchant,
    options: expandedPreset as StackNavigationOptions,
  },
  CURRENCY_SELECTION_MODAL: {
    component: CurrencySelectionGlobalModal,
    options: {
      customStack: true,
      ignoreBottomOffset: true,
      onAppear: null,
      topOffset: 0,
      animationEnabled: true,
    } as StackNavigationOptions,
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
      [GlobalRoutes.PAY_MERCHANT]: 'pay/:network/:merchantAddress',
    },
  },
};
