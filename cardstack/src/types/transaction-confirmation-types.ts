import { PrepaidCardCustomization } from './transaction-types';
import { MerchantInformation, TokenType } from './';

export enum TransactionConfirmationType {
  GENERIC = 'generic',
  HUB_AUTH = 'hubAuth',
  ISSUE_PREPAID_CARD = 'issuePrepaidCard',
  REGISTER_MERCHANT = 'registerMerchant',
  PAY_MERCHANT = 'payMerchant',
  SPLIT_PREPAID_CARD = 'splitPrepaidCard',
  TRANSFER_PREPAID_CARD_1 = 'transferPrepaidCard1',
  TRANSFER_PREPAID_CARD_2 = 'transferPrepaidCard2',
  CLAIM_REVENUE = 'claimRevenue',
  WITHDRAWAL = 'withdrawal',
  REWARDS_REGISTER = 'rewardsRegister',
  REWARDS_CLAIM = 'rewardsClaim',
}

export interface Level1DecodedData {
  amount: string;
  data: string;
  to: string;
}

export interface TokenData {
  symbol: string;
  decimals: number;
}

export interface GenericDisplayData {
  type: TransactionConfirmationType.GENERIC;
}

export interface HubAuthData {
  type: TransactionConfirmationType.HUB_AUTH;
}

export interface IssuePrepaidCardDecodedData {
  amount: string;
  to: string;
  issuingTokenAmounts: string[];
  owner: string;
  spendAmounts: string[];
  customizationDID: string;
  token: TokenData;
  type: TransactionConfirmationType.ISSUE_PREPAID_CARD;
}

export interface RegisterMerchantDecodedData {
  spendAmount: number;
  infoDID?: string;
  merchantInfo?: MerchantInformation;
  prepaidCard: string;
  type: TransactionConfirmationType.REGISTER_MERCHANT;
}

export interface RewardsRegisterData {
  programName: string;
  prepaidCard: string;
  spendAmount: number;
  type: TransactionConfirmationType.REWARDS_REGISTER;
}

export interface RewardsClaimData extends TokenType {
  estGasFee: string;
  type: TransactionConfirmationType.REWARDS_CLAIM;
}

export interface PayMerchantDecodedData {
  amount: number;
  spendAmount?: number;
  merchantSafe: string;
  prepaidCard?: string;
  prepaidCardCustomization?: PrepaidCardCustomization;
  infoDID?: string;
  currency?: string;
  type: TransactionConfirmationType.PAY_MERCHANT;
}

export interface ClaimRevenueDecodedData {
  amount: string;
  tokenAddress: string;
  merchantSafe: string;
  price: number;
  token: TokenData;
  type: TransactionConfirmationType.CLAIM_REVENUE;
}

export interface SplitPrepaidCardDecodedData {
  issuingTokenAmounts: string[];
  spendAmounts: string[];
  prepaidCard: string;
  customizationDID: string;
  token: TokenData;
  type: TransactionConfirmationType.SPLIT_PREPAID_CARD;
}

export interface TransferPrepaidCard1DecodedData {
  newOwner: string;
  oldOwner: string;
  prepaidCard: string;
  type: TransactionConfirmationType.TRANSFER_PREPAID_CARD_1;
}

export interface TransferPrepaidCard2DecodedData {
  newOwner: string;
  prepaidCard: string;
  type: TransactionConfirmationType.TRANSFER_PREPAID_CARD_2;
}

export interface WithdrawalDecodedData {
  amount: string;
  address: string;
  addressType: 'depot' | 'merchant' | 'prepaid-card' | 'external' | 'reward';
  layer1Recipient: string;
  tokenBalance: string;
  price: number;
  token: TokenData;
  type: TransactionConfirmationType.WITHDRAWAL;
}

export type ActionDispatcherActionName =
  | 'registerMerchant'
  | 'payMerchant'
  | 'split'
  | 'transfer';

export interface ActionDispatcherDecodedData {
  spendAmount: number;
  requestedRate: number;
  actionName: ActionDispatcherActionName;
  actionData: string;
}

export interface TransactionConfirmationRouteParams {
  data: TransactionConfirmationData;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

export type TransactionConfirmationData =
  | GenericDisplayData
  | HubAuthData
  | IssuePrepaidCardDecodedData
  | RegisterMerchantDecodedData
  | SplitPrepaidCardDecodedData
  | TransferPrepaidCard1DecodedData
  | TransferPrepaidCard2DecodedData
  | ClaimRevenueDecodedData
  | WithdrawalDecodedData
  | PayMerchantDecodedData
  | RewardsRegisterData
  | RewardsClaimData;
