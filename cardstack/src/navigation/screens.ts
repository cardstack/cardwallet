import { StackNavigationOptions } from '@react-navigation/stack';
import { StackNavigationEventMap } from '@react-navigation/stack/lib/typescript/src/types';
import { NavigationState, ScreenListeners } from '@react-navigation/core';
import { MainRoutes, GlobalRoutes } from './routes';
import {
  dismissAndroidKeyboardOnClose,
  horizontalInterpolator,
  overlayPreset,
  slideLeftToRightPreset,
} from './presetOptions';
import {
  BuyPrepaidCard,
  CurrencySelectionGlobalModal,
  DepotScreen,
  ErrorFallbackScreen,
  LoadingOverlayScreen,
  ImportSeedSheet,
  MerchantScreen,
  PayMerchant,
  PrepaidCardModal,
  SendSheetDepot,
  TransactionConfirmation,
  WelcomeScreen,
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
} from '@cardstack/screens';
import {
  bottomSheetPreset,
  expandedPreset,
  sheetPreset,
  wcPromptPreset,
} from '@rainbow-me/navigation/effects';
import RainbowRoutes from '@rainbow-me/navigation/routesNames';
import SendSheetEOA from '@rainbow-me/screens/SendSheetEOA';
import { Device } from '@cardstack/utils';
import SettingsModal from '@rainbow-me/screens/SettingsModal';
import BackupSheet from '@rainbow-me/screens/BackupSheet';
import {
  RewardWithdrawConfirmationScreen,
  RewardWithdrawToScreen,
} from '@cardstack/screens/RewardsCenterScreen/flows';

export interface ScreenNavigation {
  component: React.ComponentType<any>;
  options?: StackNavigationOptions;
  listeners?: ScreenListeners<NavigationState, StackNavigationEventMap>;
}

// Native iOS custom option, should be removed after deleting NativeStack
const nativeStackiOSLoadingConfig = {
  customStack: true,
  onAppear: null,
  allowsDragToDismiss: false,
  allowsTapToDismiss: false,
  onTouchTop: null,
  transitionDuration: 0,
  onWillDismiss: null,
  dismissable: false,
  gesturedEnabled: false,
};

// Shareable component,
// for now android/ios needs on MainStack
// and iOS only on GlobalStack
// the navigator looks for the nearest route
const LoadingOverlayComponent = {
  LOADING_OVERLAY: {
    component: LoadingOverlayScreen,
    options: {
      ...overlayPreset,
      gestureEnabled: false,

      ...(Device.isIOS ? nativeStackiOSLoadingConfig : {}),
    } as StackNavigationOptions,
  },
};

export const MainScreens: Record<keyof typeof MainRoutes, ScreenNavigation> = {
  DEPOT_SCREEN: { component: DepotScreen, options: horizontalInterpolator },
  MERCHANT_SCREEN: {
    component: MerchantScreen,
    options: horizontalInterpolator,
  },
  MERCHANT_PAYMENT_REQUEST_SHEET: {
    component: PaymentRequestExpandedSheet,
    options: expandedPreset as StackNavigationOptions,
    listeners: dismissAndroidKeyboardOnClose,
  },
  PREPAID_CARD_MODAL: {
    component: PrepaidCardModal,
    options: expandedPreset as StackNavigationOptions,
  },
  BUY_PREPAID_CARD: { component: BuyPrepaidCard },
  SEND_FLOW_DEPOT: {
    component: SendSheetDepot,
    options: sheetPreset as StackNavigationOptions,
    listeners: dismissAndroidKeyboardOnClose,
  },
  SEND_FLOW_EOA: {
    component: SendSheetEOA,
    options: sheetPreset as StackNavigationOptions,
    listeners: dismissAndroidKeyboardOnClose,
  },
  PAY_MERCHANT: {
    component: PayMerchant,
    options: expandedPreset as StackNavigationOptions,
    listeners: dismissAndroidKeyboardOnClose,
  },
  ERROR_FALLBACK_SCREEN: {
    component: ErrorFallbackScreen,
    options: { ...overlayPreset, gestureEnabled: false },
  },
  WELCOME_SCREEN: {
    component: WelcomeScreen,
  },
  COLLECTIBLE_SHEET: {
    component: CollectibleSheet,
    options: expandedPreset as StackNavigationOptions,
  },
  IMPORT_SEED_SHEET: {
    component: ImportSeedSheet,
    options: bottomSheetPreset as StackNavigationOptions,
    listeners: dismissAndroidKeyboardOnClose,
  },
  PAYMENT_RECEIVED_SHEET: {
    component: PaymentReceivedSheet,
    options: expandedPreset as StackNavigationOptions,
  },
  UNCLAIMED_REVENUE_SHEET: {
    component: UnclaimedRevenueSheet,
    options: expandedPreset as StackNavigationOptions,
  },
  CONFIRM_CLAIM_DESTINY_SHEET: {
    component: ConfirmClaimDestinySheet,
    options: expandedPreset as StackNavigationOptions,
  },
  WALLET_CONNECT_APPROVAL_SHEET: {
    component: WalletConnectApprovalSheet,
    options: (Device.isIOS
      ? expandedPreset
      : wcPromptPreset) as StackNavigationOptions,
  },
  WALLET_CONNECT_REDIRECT_SHEET: {
    component: WalletConnectRedirectSheet,
    options: (Device.isIOS
      ? bottomSheetPreset
      : wcPromptPreset) as StackNavigationOptions,
  },
  ...LoadingOverlayComponent,
  SETTINGS_MODAL: {
    component: SettingsModal,
    options: slideLeftToRightPreset,
  },
  TRANSFER_CARD: {
    component: TransferCardScreen,
    options: { ...overlayPreset, gestureEnabled: false },
  },
  PAYMENT_CONFIRMATION_SHEET: {
    component: PaymentConfirmationSheet,
    options: expandedPreset as StackNavigationOptions,
  },
  MERCHANT_TRANSACTION_SHEET: {
    component: MerchantTransactionSheet,
    options: expandedPreset as StackNavigationOptions,
  },
  CHOOSE_PREPAIDCARD_SHEET: {
    component: ChoosePrepaidCardSheet,
    options: expandedPreset as StackNavigationOptions,
    listeners: dismissAndroidKeyboardOnClose,
  },
  REWARDS_CENTER_SCREEN: {
    component: RewardsCenterScreen,
    options: horizontalInterpolator,
  },
  REWARDS_REGISTER_SHEET: {
    component: RewardsRegisterSheet,
    options: expandedPreset as StackNavigationOptions,
  },
  REWARDS_CLAIM_SHEET: {
    component: RewardsClaimSheet,
    options: expandedPreset as StackNavigationOptions,
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
    options: expandedPreset as StackNavigationOptions,
  },
  BACKUP_SHEET: {
    component: BackupSheet,
    options: bottomSheetPreset as StackNavigationOptions,
    listeners: dismissAndroidKeyboardOnClose,
  },
};

// @ts-expect-error it alows undefined for temp solution on loadingOverlay, will be removed on nav redesign
export const GlobalScreens: Record<
  keyof typeof GlobalRoutes,
  ScreenNavigation
> = {
  CONFIRM_REQUEST: {
    component: TransactionConfirmation,
    options: { gestureEnabled: false },
  },
  CURRENCY_SELECTION_MODAL: {
    component: CurrencySelectionGlobalModal,
    options: {
      ...expandedPreset,
      ignoreBottomOffset: true,
      interactWithScrollView: false,
    } as StackNavigationOptions,
  },
  COLOR_PICKER_MODAL: {
    component: ColorPickerModal,
    options: {
      ...expandedPreset,
      ignoreBottomOffset: true,
      interactWithScrollView: false,
    } as StackNavigationOptions,
  },

  // Needs to be the last item of the object, until we move to a single navigator
  ...(Device.isIOS ? LoadingOverlayComponent : {}),
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

const prefixes = [
  'https://wallet.cardstack.com',
  'https://wallet-staging.stack.cards',
  'cardwallet://',
];

export const linking = {
  prefixes,
  config: {
    screens: Device.isIOS ? iOSNavigatorPath : sharedNavigatorPath,
  },
};

export const tabLinking = {
  prefixes,
  config: {
    initialRouteName: RainbowRoutes.SWIPE_LAYOUT,
    screens: {
      [RainbowRoutes.SWIPE_LAYOUT]: {
        screens: {
          initialRouteName: RainbowRoutes.WALLET_SCREEN,
        },
      },
      [MainRoutes.PAY_MERCHANT]: 'pay/:network/:merchantAddress',
    },
  },
};
