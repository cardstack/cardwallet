import { getAddressByNetwork } from '@cardstack/cardpay-sdk';
import { groupBy } from 'lodash';
import { useMemo, useEffect } from 'react';

import {
  useGetRewardClaimsQuery,
  useGetTransactionsFromSafesQuery,
} from '@cardstack/graphql';
import { RewardsSafeType } from '@cardstack/services/rewards-center/rewards-center-types';
import { TokenType } from '@cardstack/types';
import { groupTransactionsByDate, sortByTime } from '@cardstack/utils';

import { useAccountSettings } from '@rainbow-me/hooks';

import { ClaimOrTokenWithdraw, TokenWithSafeAddress } from './components';
import useRewardsDataFetch from './useRewardsDataFetch';

const useRewardsBalanceHistory = () => {
  const { accountAddress, network, isOnCardPayNetwork } = useAccountSettings();
  const { rewardSafes, rewardPoolTokenBalances } = useRewardsDataFetch();

  const rewardSafesAddresses = useMemo(
    () => rewardSafes?.map(({ address }) => address),
    [rewardSafes]
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

  const {
    data: rewardSafeWithdraws,
    refetch: refetchWithdrawHistory,
  } = useGetTransactionsFromSafesQuery({
    skip: !rewardSafesAddresses || !isOnCardPayNetwork,
    variables: {
      safeAddresses: rewardSafesAddresses,
      relayAddress: isOnCardPayNetwork
        ? getAddressByNetwork('relay', network)
        : '',
    },
    context: { network },
  });

  const historySectionData = useMemo(
    () =>
      Object.entries(
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
        .sort((a, b) => sortByTime(a.data[0], b.data[0])) || [],
    [rewardClaims, rewardSafeWithdraws]
  );

  // Get tokens from all rewardSafes
  const tokensBalanceData = useMemo(
    () =>
      (rewardSafes?.reduce((tokens: TokenType[], safe: RewardsSafeType) => {
        const tokensWithAddress = safe.tokens?.map(token => ({
          ...token,
          safeAddress: safe.address,
        }));

        return [...tokens, ...tokensWithAddress];
      }, []) as TokenWithSafeAddress[]) || [],
    [rewardSafes]
  );

  // Refetches when rewardSafes or rewardPoolTokenBalances updates
  useEffect(() => {
    refetchClaimHistory();
    refetchWithdrawHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rewardSafes, rewardPoolTokenBalances]);

  return { historySectionData, tokensBalanceData };
};

export default useRewardsBalanceHistory;
