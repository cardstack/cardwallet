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
  COLLECTIBLE_SHEET: 'CollectibleSheet',
  PAYMENT_RECEIVED_SHEET: 'PaymentReceivedSheet',
  UNCLAIMED_REVENUE_SHEET: 'UnclaimedRevenueSheet',
  CONFIRM_CLAIM_DESTINY_SHEET: 'ConfirmClaimDestinySheet',
  WALLET_CONNECT_APPROVAL_SHEET: 'WalletConnectApprovalSheet',
  WALLET_CONNECT_REDIRECT_SHEET: 'WalletConnectRedirectSheet',
  PAYMENT_CONFIRMATION_SHEET: 'PaymentConfirmationSheet',
  MERCHANT_TRANSACTION_SHEET: 'MerchantTransactionSheet',
  CHOOSE_PREPAIDCARD_SHEET: 'ChoosePrepaidCardSheet',
  TRANSFER_CARD: 'TransferCardScreen',
  REWARDS_CENTER_SCREEN: 'RewardsCenterScreen',
  REWARDS_REGISTER_SHEET: 'RewardsRegisterSheet',
  REWARDS_CLAIM_SHEET: 'RewardsClaimSheet',
  REWARD_CLAIM_SINGLE_SHEET: 'RewardClaimSingleSheet',
  REWARD_WITHDRAW_TO: 'RewardWithdrawToScreen',
  REWARD_WITHDRAW_CONFIRMATION: 'RewardWithdrawConfirmationScreen',
  TRANSACTION_CONFIRMATION_SHEET: 'TransactionConfirmationScreen',
  REQUEST_PREPAID_CARD: 'RequestPrepaidCardScreen',
  CONFIRM_REQUEST: 'ConfirmRequest',
  CURRENCY_SELECTION_MODAL: 'CurrencySelectionModal',
  COLOR_PICKER_MODAL: 'ColorPickerModal',
  SUPPORT_AND_FEES: 'SupportAndFeesSheet',
  AVAILABLE_BALANCE_SHEET: 'AvailableBalanceSheet',
  TOKEN_SHEET: 'TokenSheet',
  WYRE_AUTH_WIDGET: 'WyreAuthenticationWidget',
} as const;

const TabRoutes = {
  TAB_NAVIGATOR: 'TabNavigator',
  HOME_SCREEN: 'HomeScreen',
  PROFILE_SCREEN: 'ProfileScreen',
  WALLET_SCREEN: 'WalletScreen',
  QR_SCANNER_SCREEN: 'QRScannerScreen',
} as const;

const NonMigratedRoutes = {
  CHANGE_WALLET_SHEET: 'ChangeWalletSheet',
  PIN_AUTHENTICATION_SCREEN: 'PinAuthenticationScreen',
} as const;

const SharedRoutes = {
  PIN_SCREEN: 'PinScreen',
  LOADING_OVERLAY: 'LoadingOverlay',
  MESSAGE_OVERLAY: 'MessageOverlay',
  SEED_PHRASE_BACKUP: 'SeedPhraseBackup',
  NOTIFICATIONS_PERMISSION: 'NotificationsPermissionScreen',
  // non-migrated
  MODAL_SCREEN: 'ModalScreen',
} as const;

export const NonAuthRoutes = {
  WELCOME_SCREEN: 'WelcomeScreen',
} as const;

const ProfileRoutes = {
  PROFILE_SLUG: 'ProfileSlug',
  PROFILE_PURCHASE: 'ProfilePurchaseScreen',
  PROFILE_NAME: 'ProfileName',
  PROFILE_CHARGE_EXPLANATION: 'ProfileChargeExplanation',
};

const BackupRoutes = {
  BACKUP_EXPLANATION: 'BackupExplanation',
  BACKUP_CLOUD_PASSWORD: 'BackupCloudPassword',
  BACKUP_RECOVERY_PHRASE: 'BackupRecoveryPhrase',
  BACKUP_SEEDPHRASE_CONFIRMATION: 'BackupSeedPhraseConfirmationScreen',
  BACKUP_MANUAL_BACKUP: 'BackupManualBackup',
  BACKUP_RESTORE_EXPLANATION: 'BackupRestoreExplanation',
  BACKUP_RESTORE_CLOUD: 'BackupRestoreCloud',
  BACKUP_RESTORE_PHRASE: 'BackupRestorePhraseScreen',
};

const SettingsRoutes = {
  SETTINGS_SCREEN: 'SettingScreen',
  CURRENCY_SECTION: 'CurrencySection',
  DEV_SECTION: 'DevSection',
  DESIGN_SYSTEM: 'DesignSystem',
  NETWORK_SECTION: 'NetworkSection',
  NOTIFICATIONS_SECTION: 'NotificationsSection',
  WC_LEGACY_SESSIONS_SECTION: 'WCLegacySessionsSection',
  WC_SESSIONS_SECTION: 'WCSessionsSection',
  MY_WALLET_ADDRESS_SECTION: 'MyWalletAddressSection',
  SECURITY_SECTION: 'SecuritySettingsSection',
};

export const Routes = {
  UNLOCK_SCREEN: 'UnlockScreen',
  ...SharedRoutes,
  ...NonMigratedRoutes,
  ...TabRoutes,
  ...MainRoutes,
  ...ProfileRoutes,
  ...BackupRoutes,
  ...SettingsRoutes,
} as const;
