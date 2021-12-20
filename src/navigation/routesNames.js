import {
  GlobalRoutes as CSGlobalRoutes,
  MainRoutes as CSMainRoutes,
} from '@cardstack/navigation/routes';
import { Device } from '@cardstack/utils/device';

const Routes = {
  ADD_CASH_SCREEN_NAVIGATOR: 'AddCashSheetNavigator',
  ADD_CASH_SHEET: 'AddCashSheet',
  AVATAR_BUILDER: 'AvatarBuilder',
  BACKUP_SCREEN: 'BackupScreen',
  BACKUP_SHEET: 'BackupSheet',
  CHANGE_WALLET_SHEET: 'ChangeWalletSheet',
  CHANGE_WALLET_SHEET_NAVIGATOR: 'ChangeWalletSheetNavigator',
  CURRENCY_SELECT_SCREEN: 'CurrencySelectScreen',
  EXAMPLE_SCREEN: 'ExampleScreen',
  EXCHANGE_MODAL: 'ExchangeModal',
  EXPANDED_ASSET_SCREEN: 'ExpandedAssetScreen',
  EXPANDED_ASSET_SHEET: 'ExpandedAssetSheet',
  EXPANDED_ASSET_SHEET_DRILL: 'ExpandedAssetSheetDrill',
  IMPORT_SCREEN: 'ImportScreen',
  MAIN_EXCHANGE_NAVIGATOR: 'MainExchangeNavigator',
  MAIN_EXCHANGE_SCREEN: 'MainExchangeScreen',
  MAIN_NATIVE_BOTTOM_SHEET_NAVIGATOR: 'MainNativeBottomSheetNavigation',
  MAIN_NAVIGATOR: 'MainNavigator',
  MAIN_NAVIGATOR_WRAPPER: 'MainNavigatorWrapper',
  MODAL_SCREEN: 'ModalScreen',
  NATIVE_STACK: 'NativeStack',
  NON_MODAL_SCREENS: 'NonModalScreens',
  PIN_AUTHENTICATION_SCREEN: 'PinAuthenticationScreen',
  PROFILE_SCREEN: 'ProfileScreen',
  QR_SCANNER_SCREEN: 'QRScannerScreen',
  RESTORE_SHEET: 'RestoreSheet',
  SAVINGS_DEPOSIT_MODAL: 'SavingsDepositModal',
  SAVINGS_SHEET: 'SavingsSheet',
  SAVINGS_WITHDRAW_MODAL: 'SavingsWithdrawModal',
  SEND_SHEET: 'SendSheet',
  SEND_SHEET_NAVIGATOR: 'SendSheetNavigator',
  SPEND_SHEET: 'SpendSheet',
  SPEND_SHEET_NAVIGATOR: 'SpendSheetNavigator',
  SETTINGS_MODAL: 'SettingsModal',
  SPEED_UP_AND_CANCEL_SHEET: 'SpeedUpAndCancelSheet',
  STACK: 'Stack',
  SUPPORTED_COUNTRIES_MODAL_SCREEN: 'SupportedCountriesModalScreen',
  SWAP_DETAILS_SCREEN: 'SwapDetailsScreen',
  SWIPE_LAYOUT: 'SwipeLayout',
  WALLET_CONNECT_APPROVAL_SHEET: 'WalletConnectApprovalSheet',
  WALLET_CONNECT_REDIRECT_SHEET: 'WalletConnectRedirectSheet',
  WALLET_SCREEN: 'WalletScreen',
  WYRE_WEBVIEW: 'WyreWebview',
  WYRE_WEBVIEW_NAVIGATOR: 'WyreWebviewNavigator',
  // Cardstack Screens
  ...CSMainRoutes,
  ...CSGlobalRoutes,
};

export const NATIVE_ROUTES = [
  Routes.RECEIVE_MODAL,
  Routes.SETTINGS_MODAL,
  Routes.EXCHANGE_MODAL,
  Routes.EXPANDED_ASSET_SHEET,
  Routes.CHANGE_WALLET_SHEET,
  Routes.MODAL_SCREEN,
  Routes.SAVINGS_SHEET,
  Routes.SAVINGS_WITHDRAW_MODAL,
  Routes.SAVINGS_DEPOSIT_MODAL,
];

const RoutesWithNativeStackAvailability = {
  ...Routes,
  ADD_CASH_FLOW: Routes.ADD_CASH_SHEET,
  SEND_FLOW: Device.isAndroid ? Routes.SEND_SHEET_NAVIGATOR : Routes.SEND_SHEET,
  SPEND_FLOW: Device.isAndroid
    ? Routes.SPEND_SHEET_NAVIGATOR
    : Routes.SPEND_SHEET,
};

export default RoutesWithNativeStackAvailability;
