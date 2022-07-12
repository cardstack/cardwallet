import { MerchantInformation, TokenType } from '.';

export interface MerchantSafeType {
  address: string;
  network?: string;
  accumulatedSpendValue: string;
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

export interface BusinessIDUniquenessResponse {
  slugAvailable: boolean;
  detail: string;
}

export interface CreateBusinessInfoDIDParams {
  name: string;
  slug: string;
  color: string;
  'text-color': string;
  'owner-address'?: string;
}
