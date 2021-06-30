import { TransactionConfirmationType } from './TransactionConfirmationType';

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
  infoDID: string;
  type: TransactionConfirmationType.REGISTER_MERCHANT;
}

export interface PayMerchantDecodedData {
  spendAmount: number;
  merchantSafe: string;
  type: TransactionConfirmationType.PAY_MERCHANT;
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

export type TransactionConfirmationData =
  | GenericDisplayData
  | IssuePrepaidCardDecodedData
  | RegisterMerchantDecodedData
  | PayMerchantDecodedData;
