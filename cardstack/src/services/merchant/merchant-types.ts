import { TokenType } from '@cardstack/types';
import { Network } from '@rainbow-me/helpers/networkTypes';
import { RainbowWallet } from '@rainbow-me/model/wallet';

export interface ClaimRevenueQueryParams {
  selectedWallet: RainbowWallet;
  network: Network;
  accountAddress: string;
  merchantSafeAddress: string;
  revenueBalances: TokenType[];
}
