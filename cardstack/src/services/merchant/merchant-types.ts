import { SignerParamsBase } from '@cardstack/models/ethers-wallet';
import { TokenType } from '@cardstack/types';

export interface ClaimRevenueQueryParams extends SignerParamsBase {
  accountAddress: string;
  merchantSafeAddress: string;
  revenueBalances: TokenType[];
}

export interface CreateProfileQueryParams extends SignerParamsBase {
  selectedPrepaidCardAddress: string;
  profileDID: string;
  accountAddress: string;
}
