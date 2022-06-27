import { EthersSignerParams } from '@cardstack/models/ethers-wallet';
import { TokenType } from '@cardstack/types';

export interface ClaimRevenueQueryParams extends EthersSignerParams {
  accountAddress: string;
  merchantSafeAddress: string;
  revenueBalances: TokenType[];
}

export interface CreateProfileQueryParams extends EthersSignerParams {
  selectedPrepaidCardAddress: string;
  profileDID: string;
  accountAddress: string;
}
