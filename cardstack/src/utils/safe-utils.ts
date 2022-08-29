import { TokenType } from '@cardstack/types';

export const getSafeTokenByAddress = (tokens: TokenType[], address?: string) =>
  address
    ? tokens?.find(
        t => t.tokenAddress?.toLowerCase() === address?.toLowerCase()
      )
    : undefined;

export const findByRewardProgramId = <T extends { rewardProgramId: string }>(
  array: Array<T> | undefined,
  rewardId: string
) => array?.find(({ rewardProgramId }) => rewardProgramId === rewardId);
