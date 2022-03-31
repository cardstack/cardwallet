import {
  GlobalRoutes as CSGlobalRoutes,
  MainRoutes as CSMainRoutes,
} from '@cardstack/navigation/routes';

const Routes = {
  ADD_CASH_SCREEN_NAVIGATOR: 'AddCashSheetNavigator',
  ADD_CASH_SHEET: 'AddCashSheet',
  CHANGE_WALLET_SHEET: 'ChangeWalletSheet',
  CURRENCY_SELECT_SCREEN: 'CurrencySelectScreen',
  EXCHANGE_MODAL: 'ExchangeModal',
  EXPANDED_ASSET_SHEET: 'ExpandedAssetSheet',
  EXPANDED_ASSET_SHEET_DRILL: 'ExpandedAssetSheetDrill',
  MAIN_EXCHANGE_NAVIGATOR: 'MainExchangeNavigator',
  MAIN_EXCHANGE_SCREEN: 'MainExchangeScreen',
  MAIN_NAVIGATOR: 'MainNavigator',
  MODAL_SCREEN: 'ModalScreen',
  PIN_AUTHENTICATION_SCREEN: 'PinAuthenticationScreen',
  QR_SCANNER_SCREEN: 'QRScannerScreen',
  RESTORE_SHEET: 'RestoreSheet',
  SAVINGS_DEPOSIT_MODAL: 'SavingsDepositModal',
  SAVINGS_SHEET: 'SavingsSheet',
  SAVINGS_WITHDRAW_MODAL: 'SavingsWithdrawModal',
  SEND_SHEET: 'SendSheet',
  SETTINGS_MODAL: 'SettingsModal',
  SPEED_UP_AND_CANCEL_SHEET: 'SpeedUpAndCancelSheet',
  STACK: 'Stack',
  SUPPORTED_COUNTRIES_MODAL_SCREEN: 'SupportedCountriesModalScreen',
  SWAP_DETAILS_SCREEN: 'SwapDetailsScreen',
  SWIPE_LAYOUT: 'SwipeLayout',
  WYRE_WEBVIEW: 'WyreWebview',
  WYRE_WEBVIEW_NAVIGATOR: 'WyreWebviewNavigator',
  // Cardstack Screens
  ...CSMainRoutes,
  ...CSGlobalRoutes,
  HOME_SCREEN: 'HomeScreen',
  PROFILE_SCREEN: 'ProfileScreen',
  WALLET_SCREEN: 'WalletScreen',
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
};

export default RoutesWithNativeStackAvailability;
