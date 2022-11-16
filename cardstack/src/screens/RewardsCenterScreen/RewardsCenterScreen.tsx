import React, { useMemo } from 'react';

import { Container, NavigationStackHeader } from '@cardstack/components';

import {
  RegisterContent,
  NoRewardContent,
  ClaimContent,
  RewardLoadingSkeleton,
  RewardProgramHeader,
} from './components';
import { strings } from './strings';
import { useRewardsCenterScreen } from './useRewardsCenterScreen';

const RewardsCenterScreen = () => {
  const {
    isRegistered,
    hasRewards,
    rewards,
    fullBalanceToken,
    isLoading,
    rewardProgramExplainer,
  } = useRewardsCenterScreen();

  const mainPoolRowProps = useMemo(
    () =>
      hasRewards
        ? {
            primaryText: fullBalanceToken?.balance.display || '',
            subText: fullBalanceToken?.native.balance.display || '',
            coinSymbol: fullBalanceToken?.token.symbol || '',
            isClaimable: !!fullBalanceToken?.isClaimable,
          }
        : undefined,
    [hasRewards, fullBalanceToken]
  );

  const rewardsRowProps = useMemo(
    () =>
      rewards?.map(reward => ({
        primaryText: reward?.balance.display || '',
        subText: reward?.native.balance.display || '',
        coinSymbol: reward?.token.symbol || '',
        isClaimable: true,
      })),
    [rewards]
  );

  return (
    <Container backgroundColor="white" flex={1}>
      <NavigationStackHeader title={strings.navigation.title} />
      <Container backgroundColor="white" flex={1}>
        <RewardProgramHeader title={rewardProgramExplainer} />
        {isLoading ? (
          <RewardLoadingSkeleton />
        ) : (
          <Container flex={1}>
            {!isRegistered &&
              (mainPoolRowProps ? (
                <RegisterContent {...mainPoolRowProps} />
              ) : (
                <NoRewardContent />
              ))}
            {isRegistered && <ClaimContent claimList={rewardsRowProps} />}
          </Container>
        )}
      </Container>
    </Container>
  );
};

export default RewardsCenterScreen;
