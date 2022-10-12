import { NavigationState, ScreenListeners } from '@react-navigation/native';
import { StackNavigationOptions } from '@react-navigation/stack';
import { StackNavigationEventMap } from '@react-navigation/stack/lib/typescript/src/types';

import {
  BuyPrepaidCard,
  CurrencySelectionGlobalModal,
  DepotScreen,
  ErrorFallbackScreen,
  MerchantScreen,
  PayMerchant,
  PrepaidCardModal,
  SendSheetDepot,
  TransactionConfirmation,
  CollectibleSheet,
  PaymentReceivedSheet,
  PaymentRequestExpandedSheet,
  UnclaimedRevenueSheet,
  ConfirmClaimDestinySheet,
  WalletConnectApprovalSheet,
  WalletConnectRedirectSheet,
  TransferCardScreen,
  PaymentConfirmationSheet,
  MerchantTransactionSheet,
  ChoosePrepaidCardSheet,
  RewardsCenterScreen,
  RewardsRegisterSheet,
  RewardsClaimSheet,
  TransactionConfirmationSheet,
  ColorPickerModal,
  RequestPrepaidCardScreen,
  SupportAndFeesSheet,
  AvailableBalanceSheet,
  TokenWithChartSheet,
  WyreAuthenticationWidget,
} from '@cardstack/screens';
import {
  RewardWithdrawConfirmationScreen,
  RewardWithdrawToScreen,
} from '@cardstack/screens/RewardsCenterScreen/flows';
import { Device } from '@cardstack/utils';

import SendSheetEOA from '@rainbow-me/screens/SendSheetEOA';
import SettingsModal from '@rainbow-me/screens/SettingsModal';

import {
  dismissAndroidKeyboardOnClose,
  horizontalInterpolator,
  overlayPreset,
  sheetPreset,
  slideLeftToRightPreset,
} from './presetOptions';
import { MainRoutes, Routes } from './routes';

export interface ScreenNavigation {
  component: React.ComponentType<any>;
  options?: StackNavigationOptions;
  listeners?: ScreenListeners<NavigationState, StackNavigationEventMap>;
}

export const MainScreens: Record<keyof typeof MainRoutes, ScreenNavigation> = {
  DEPOT_SCREEN: { component: DepotScreen, options: horizontalInterpolator },
  MERCHANT_SCREEN: {
    component: MerchantScreen,
    options: horizontalInterpolator,
  },
  MERCHANT_PAYMENT_REQUEST_SHEET: {
    component: PaymentRequestExpandedSheet,
    options: sheetPreset(),
    listeners: dismissAndroidKeyboardOnClose,
  },
  PREPAID_CARD_MODAL: {
    component: PrepaidCardModal,
    options: { ...sheetPreset(), gestureEnabled: Device.isIOS },
  },
  BUY_PREPAID_CARD: {
    component: BuyPrepaidCard,
    options: sheetPreset(),
  },
  SEND_FLOW_DEPOT: {
    component: SendSheetDepot,
    options: sheetPreset(),
    listeners: dismissAndroidKeyboardOnClose,
  },
  SEND_FLOW_EOA: {
    component: SendSheetEOA,
    options: sheetPreset(),
    listeners: dismissAndroidKeyboardOnClose,
  },
  PAY_MERCHANT: {
    component: PayMerchant,
    options: { ...sheetPreset(), gestureEnabled: false },
    listeners: dismissAndroidKeyboardOnClose,
  },
  ERROR_FALLBACK_SCREEN: {
    component: ErrorFallbackScreen,
    options: { ...overlayPreset, gestureEnabled: false },
  },
  COLLECTIBLE_SHEET: {
    component: CollectibleSheet,
    options: sheetPreset(),
  },
  PAYMENT_RECEIVED_SHEET: {
    component: PaymentReceivedSheet,
    options: sheetPreset(),
  },
  UNCLAIMED_REVENUE_SHEET: {
    component: UnclaimedRevenueSheet,
    options: sheetPreset(),
  },
  CONFIRM_CLAIM_DESTINY_SHEET: {
    component: ConfirmClaimDestinySheet,
    options: sheetPreset({ backgroundOpacity: 'half' }),
  },
  WALLET_CONNECT_APPROVAL_SHEET: {
    component: WalletConnectApprovalSheet,
    options: sheetPreset({ bounce: false, backgroundOpacity: 'half' }),
  },
  WALLET_CONNECT_REDIRECT_SHEET: {
    component: WalletConnectRedirectSheet,
    options: sheetPreset({ bounce: false, backgroundOpacity: 'half' }),
  },
  SETTINGS_MODAL: {
    component: SettingsModal,
    options: { ...slideLeftToRightPreset, gestureEnabled: false },
  },
  TRANSFER_CARD: {
    component: TransferCardScreen,
    options: { ...overlayPreset, gestureEnabled: false },
  },
  PAYMENT_CONFIRMATION_SHEET: {
    component: PaymentConfirmationSheet,
    options: sheetPreset(),
  },
  MERCHANT_TRANSACTION_SHEET: {
    component: MerchantTransactionSheet,
    options: sheetPreset({ backgroundOpacity: 'half' }),
  },
  CHOOSE_PREPAIDCARD_SHEET: {
    component: ChoosePrepaidCardSheet,
    options: { ...sheetPreset(), gestureEnabled: false },
    listeners: dismissAndroidKeyboardOnClose,
  },
  REWARDS_CENTER_SCREEN: {
    component: RewardsCenterScreen,
    options: horizontalInterpolator,
  },
  REWARDS_REGISTER_SHEET: {
    component: RewardsRegisterSheet,
    options: sheetPreset(),
  },
  REWARDS_CLAIM_SHEET: {
    component: RewardsClaimSheet,
    options: sheetPreset(),
  },
  REWARD_WITHDRAW_TO: {
    component: RewardWithdrawToScreen,
    options: horizontalInterpolator,
  },
  REWARD_WITHDRAW_CONFIRMATION: {
    component: RewardWithdrawConfirmationScreen,
    options: horizontalInterpolator,
  },
  TRANSACTION_CONFIRMATION_SHEET: {
    component: TransactionConfirmationSheet,
    options: sheetPreset(),
  },
  REQUEST_PREPAID_CARD: {
    component: RequestPrepaidCardScreen,
    options: horizontalInterpolator,
  },
  CONFIRM_REQUEST: {
    component: TransactionConfirmation,
    options: { ...sheetPreset(), gestureEnabled: false },
  },
  CURRENCY_SELECTION_MODAL: {
    component: CurrencySelectionGlobalModal,
    options: sheetPreset({ backgroundOpacity: 'half' }),
  },
  COLOR_PICKER_MODAL: {
    component: ColorPickerModal,
    options: sheetPreset({ backgroundOpacity: 'half' }),
  },
  SUPPORT_AND_FEES: {
    component: SupportAndFeesSheet,
    options: sheetPreset(),
  },
  AVAILABLE_BALANCE_SHEET: {
    component: AvailableBalanceSheet,
    options: sheetPreset(),
  },
  TOKEN_WITH_CHART_SHEET: {
    component: TokenWithChartSheet,
    options: sheetPreset({ backgroundOpacity: 'half' }),
  },
  WYRE_AUTH_WIDGET: {
    component: WyreAuthenticationWidget,
  },
};

const prefixes = [
  'https://wallet.cardstack.com',
  'https://wallet-staging.stack.cards',
  'cardwallet://',
];

export const linking = {
  prefixes,
  config: {
    initialRouteName: Routes.TAB_NAVIGATOR,
    screens: {
      [Routes.TAB_NAVIGATOR]: {
        screens: {
          initialRouteName: Routes.WALLET_SCREEN,
        },
      },
      [Routes.PAY_MERCHANT]: 'pay/:network/:merchantAddress',
    },
  },
};
