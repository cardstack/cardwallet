export const MainRoutes = {
  DEPOT_SCREEN: 'DepotScreen',
  MERCHANT_SCREEN: 'MerchantScreen',
  MERCHANT_PAYMENT_REQUEST_SHEET: 'MerchantPaymentRequestSheet',
  PREPAID_CARD_MODAL: 'PrepaidCardModal',
  BUY_PREPAID_CARD: 'BuyPrepaidCard',
  SEND_FLOW_DEPOT: 'SendFlowDepot',
  SEND_FLOW_EOA: 'SendFlowEOA',
  PAY_MERCHANT: 'PayMerchant',
  ERROR_FALLBACK_SCREEN: 'ErrorFallbackScreen',
  LOADING_OVERLAY: 'LoadingOverlay',
  WELCOME_SCREEN: 'WelcomeScreen',
  COLLECTIBLE_SHEET: 'CollectibleSheet',
  IMPORT_SEED_SHEET: 'ImportSeedSheet',
  PAYMENT_RECEIVED_SHEET: 'PaymentReceivedSheet',
  UNCLAIMED_REVENUE_SHEET: 'UnclaimedRevenueSheet',
  WALLET_CONNECT_APPROVAL_SHEET: 'WalletConnectApprovalSheet',
  WALLET_CONNECT_REDIRECT_SHEET: 'WalletConnectRedirectSheet',
  SHOW_QRCODE_MODAL: 'ShowQRCodeModal',
  SETTINGS_MODAL: 'SettingModal',
} as const;

export const GlobalRoutes = {
  CONFIRM_REQUEST: 'ConfirmRequest',
  CURRENCY_SELECTION_MODAL: 'CurrencySelectionModal',
  LOADING_OVERLAY: 'LoadingOverlay',
} as const;
