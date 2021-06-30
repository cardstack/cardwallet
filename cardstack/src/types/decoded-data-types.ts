export interface Level1DecodedData {
  amount: string;
  data: string;
  to: string;
}

export interface TokenData {
  symbol: string;
  decimals: number;
}

export interface IssuePrepaidCardDecodedData {
  amount: string;
  to: string;
  issuingTokenAmounts: string[];
  owner: string;
  spendAmounts: string[];
  customizationDID: string;
  token: TokenData;
  type: 'issuePrepaidCard';
}

export interface RegisterMerchantDecodedData {
  spendAmount: number;
  infoDID: string;
  type: 'registerMerchant';
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

export type DecodedData =
  | IssuePrepaidCardDecodedData
  | RegisterMerchantDecodedData
  | null;
