import { NativeCurrency, Safe } from '@cardstack/cardpay-sdk';
import { TokenType } from '@cardstack/types';

export interface RewardsSafeQueryParams {
  accountAddress: string;
  nativeCurrency: NativeCurrency;
}

// TODO: add correct type after exporting RewardsSafe from sdk
export type RewardsSafeType = Safe & { tokens: TokenType[] };

export interface RewardsSafeQueryResult {
  rewardSafes: RewardsSafeType[];
}
