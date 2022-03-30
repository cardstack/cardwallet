import { NativeCurrency, RewardSafe } from '@cardstack/cardpay-sdk';
import { TransactionReceipt } from 'web3-core';
import { SignedProviderParams } from '@cardstack/models/hd-provider';
import { TokenType } from '@cardstack/types';

export interface RewardsSafeQueryParams {
  accountAddress: string;
  nativeCurrency: NativeCurrency;
}

export type RewardsSafeType = Omit<RewardSafe, 'tokens'> & {
  tokens: TokenType[];
};

export interface RewardsSafeQueryResult {
  rewardSafes: RewardsSafeType[];
}

interface TokenByProgramID extends TokenType {
  rewardProgramId?: string;
}
export interface RewardsTokenBalancesResult {
  rewardPoolTokenBalances: TokenByProgramID[];
}

interface RewardsPoolSignedBaseParams extends SignedProviderParams {
  accountAddress: string;
  rewardProgramId: string;
}
export interface RewardsRegisterMutationParams
  extends RewardsPoolSignedBaseParams {
  prepaidCardAddress: string;
}

// Export type from sdk
export interface SuccessfulTransactionReceipt extends TransactionReceipt {
  status: true;
}
export interface RewardsRegisterMutationResult {
  rewardSafe: string;
  txReceipt: SuccessfulTransactionReceipt;
}

export interface RewardsClaimMutationParams
  extends RewardsPoolSignedBaseParams,
    ValidProofsParams {
  safeAddress: string;
}

export interface RegisterGasEstimateQueryParams {
  prepaidCardAddress: string;
  rewardProgramId: string;
}

export interface ValidProofsParams {
  accountAddress: string;
  tokenAddress: string;
  rewardProgramId: string;
}

export type RewardsClaimGasEstimateParams = Omit<
  RewardsClaimMutationParams,
  keyof SignedProviderParams
>;
