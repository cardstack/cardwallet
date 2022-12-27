import { MerchantInformation, TokenType } from '.';

export interface MerchantSafeType {
  address: string;
  network?: string;
  accumulatedSpendValue: number;
  tokens: TokenType[];
  revenueBalances: TokenType[];
  type: string;
  merchantInfo?: MerchantInformation;
  infoDID: string;
}

export interface PrimarySafeUpdateProps {
  isPrimarySafe: boolean;
  changeToPrimarySafe?: () => void;
  showSafePrimarySelection?: boolean;
}

export interface ProfileIDUniquenessResponse {
  slugAvailable: boolean;
  detail: string;
}
