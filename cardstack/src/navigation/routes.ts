export const MainRoutes = {
  DEPOT_SCREEN: 'DepotScreen',
  MERCHANT_SCREEN: 'MerchantScreen',
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
} as const;

export const GlobalRoutes = {
  CONFIRM_REQUEST: 'ConfirmRequest',
  SHOW_QRCODE_MODAL: 'ShowQRCodeModal',
  CURRENCY_SELECTION_MODAL: 'CurrencySelectionModal',
} as const;
