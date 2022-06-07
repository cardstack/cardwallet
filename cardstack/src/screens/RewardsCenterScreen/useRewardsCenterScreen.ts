import { getAddressByNetwork } from '@cardstack/cardpay-sdk';
import { groupBy } from 'lodash';
import { useEffect, useMemo } from 'react';

import {
  useGetRewardClaimsQuery,
  useGetTransactionsFromSafesQuery,
} from '@cardstack/graphql';
import { RewardsSafeType } from '@cardstack/services/rewards-center/rewards-center-types';
import { TokenType } from '@cardstack/types';
import {
  groupTransactionsByDate,
  isLayer1,
  sortByTime,
} from '@cardstack/utils';

import { useAccountSettings } from '@rainbow-me/hooks';

import { ClaimOrTokenWithdraw, TokenWithSafeAddress } from './components';
import useRewardsDataFetch from './useRewardsDataFetch';

export const useRewardsCenterScreen = () => {
  const { accountAddress, network } = useAccountSettings();

  const {
    rewardSafes,
    rewardPoolTokenBalances,
    defaultRewardProgramId,
    isLoading,
    mainPoolTokenInfo,
  } = useRewardsDataFetch();

  const registeredPools = useMemo(
    () =>
      rewardSafes?.filter(safe =>
        rewardPoolTokenBalances?.some(
          ({ rewardProgramId }) => rewardProgramId === safe?.rewardProgramId
        )
      ),
    [rewardPoolTokenBalances, rewardSafes]
  );

  const isRegistered = useMemo(
    () =>
      rewardSafes?.some(
        ({ rewardProgramId }) => rewardProgramId === defaultRewardProgramId
      ),
    [rewardSafes, defaultRewardProgramId]
  );

  const {
    data: rewardClaims,
    refetch: refetchClaimHistory,
  } = useGetRewardClaimsQuery({
    skip: !accountAddress,
    variables: {
      rewardeeAddress: accountAddress,
    },
    context: { network },
  });

  const rewardSafesAddresses = useMemo(
    () => rewardSafes?.map(({ address }) => address),
    [rewardSafes]
  );

  const {
    data: rewardSafeWithdraws,
    refetch: refetchWithdrawHistory,
  } = useGetTransactionsFromSafesQuery({
    skip: !rewardSafesAddresses || isLayer1(network),
    variables: {
      safeAddresses: rewardSafesAddresses,
      relayAddress: !isLayer1(network)
        ? getAddressByNetwork('relay', network)
        : '',
    },
    context: { network },
  });

  const historySectionData = useMemo(
    () => ({
      sections: Object.entries(
        groupBy(
          [
            ...(rewardClaims?.rewardeeClaims || []),
            ...(rewardSafeWithdraws?.tokenTransfers || []),
          ],
          groupTransactionsByDate
        )
      )
        .map(([title, data]) => ({
          title,
          data: data.sort(sortByTime) as ClaimOrTokenWithdraw[],
        }))
        .sort((a, b) => sortByTime(a.data[0], b.data[0])),
    }),
    [rewardClaims, rewardSafeWithdraws]
  );

  // Refetchs when rewardSafes or rewardPoolTokenBalances updates
  useEffect(() => {
    refetchClaimHistory();
    refetchWithdrawHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rewardSafes, rewardPoolTokenBalances]);

  const tokensBalanceData = useMemo(
    () => ({
      // Get tokens from all rewardSafes
      data: rewardSafes?.reduce(
        (tokens: TokenType[], safe: RewardsSafeType) => {
          const tokensWithAddress = safe.tokens?.map(token => ({
            ...token,
            safeAddress: safe.address,
          }));

          return [...tokens, ...tokensWithAddress] as TokenWithSafeAddress[];
        },
        []
      ),
    }),
    [rewardSafes]
  );

  return {
    rewardSafes,
    registeredPools,
    rewardPoolTokenBalances,
    isRegistered,
    hasRewardsAvailable: !!mainPoolTokenInfo,
    mainPoolTokenInfo,
    isLoading,
    historySectionData,
    tokensBalanceData,
  };
};
