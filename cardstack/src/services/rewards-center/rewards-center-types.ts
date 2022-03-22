import { NativeCurrency, RewardSafe } from '@cardstack/cardpay-sdk';
import { TransactionReceipt } from 'web3-core';
import { SignedProviderParams } from '@cardstack/models/hd-provider';
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

export interface RewardsRegisterMutationParams extends SignedProviderParams {
  accountAddress: string;
  prepaidCardAddress: string;
  rewardProgramId: string;
}

// Export type from sdk
interface SuccessfulTransactionReceipt extends TransactionReceipt {
  status: true;
}
export interface RewardsRegisterMutationResult {
  rewardSafe: string;
  txReceipt: SuccessfulTransactionReceipt;
}
