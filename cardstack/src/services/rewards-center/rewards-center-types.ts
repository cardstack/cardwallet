import { NativeCurrency, RewardSafe } from '@cardstack/cardpay-sdk';
import { TokenType } from '@cardstack/types';

export interface RewardsSafeQueryParams {
  accountAddress: string;
  nativeCurrency: NativeCurrency;
}

export type RewardsSafeType = RewardSafe & { tokens: TokenType[] };

export interface RewardsSafeQueryResult {
  rewardSafes: RewardsSafeType[];
}

interface TokenByProgramID extends TokenType {
  rewardProgramId?: string;
}
export interface RewardsTokenBalancesResult {
  rewardPoolTokenBalances: TokenByProgramID[];
}
