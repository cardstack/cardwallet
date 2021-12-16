import { StackNavigationOptions } from '@react-navigation/stack';
import { MainRoutes, GlobalRoutes } from './routes';
import { horizontalInterpolator, overlayPreset } from './presetOptions';
import {
  BuyPrepaidCard,
  CurrencySelectionGlobalModal,
  DepotScreen,
  ErrorFallbackScreen,
  LoadingOverlayScreen,
  MerchantScreen,
  PayMerchant,
  PrepaidCardModal,
  SendSheetDepot,
  ShowQRCodeModal,
  TransactionConfirmation,
  WelcomeScreen,
} from '@cardstack/screen';
import { expandedPreset, sheetPreset } from '@rainbow-me/navigation/effects';
import { nativeStackModalConfig } from '@rainbow-me/navigation/config';
import RainbowRoutes from '@rainbow-me/navigation/routesNames';
import SendSheetEOA from '@rainbow-me/screens/SendSheetEOA';
import { Device } from '@cardstack/utils';
import CollectibleSheet from '@cardstack/screen/sheets/collectibles/CollectibleSheet';

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
  SEND_FLOW_EOA: {
    component: SendSheetEOA,
    options: sheetPreset as StackNavigationOptions,
  },
  PAY_MERCHANT: {
    component: PayMerchant,
    options: expandedPreset as StackNavigationOptions,
  },
  ERROR_FALLBACK_SCREEN: {
    component: ErrorFallbackScreen,
    options: { ...overlayPreset, gestureEnabled: false },
  },
  LOADING_OVERLAY: {
    component: LoadingOverlayScreen,
    options: { ...overlayPreset, gestureEnabled: false },
  },
  WELCOME_SCREEN: {
    component: WelcomeScreen,
  },
  COLLECTIBLE_SHEET: {
    component: CollectibleSheet,
    options: expandedPreset as StackNavigationOptions,
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
  CURRENCY_SELECTION_MODAL: {
    component: CurrencySelectionGlobalModal,
    options: {
      customStack: true,
      ignoreBottomOffset: true,
      onAppear: null,
      topOffset: 0,
      animationEnabled: true,
      interactWithScrollView: false,
    } as StackNavigationOptions,
  },
};

// TODO: Merge paths once, navigation redesign happens
const sharedNavigatorPath = {
  [RainbowRoutes.MAIN_NAVIGATOR]: {
    initialRouteName: RainbowRoutes.SWIPE_LAYOUT,
    screens: {
      [MainRoutes.PAY_MERCHANT]: 'pay/:network/:merchantAddress',
    },
  },
};

const iOSNavigatorPath = {
  [RainbowRoutes.STACK]: {
    screens: sharedNavigatorPath,
  },
};

export const linking = {
  prefixes: [
    'https://wallet.cardstack.com',
    'https://wallet-staging.stack.cards',
    'cardwallet://',
  ],
  config: {
    screens: Device.isIOS ? iOSNavigatorPath : sharedNavigatorPath,
  },
};
