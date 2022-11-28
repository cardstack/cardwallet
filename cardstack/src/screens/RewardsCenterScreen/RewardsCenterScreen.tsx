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
    () => ({
      primaryText: fullBalanceToken?.balance.display || '',
      subText: fullBalanceToken?.native.balance.display || '',
      coinSymbol: fullBalanceToken?.token.symbol || '',
      isClaimable: !!fullBalanceToken?.isClaimable,
    }),
    [fullBalanceToken]
  );

  return (
    <Container backgroundColor="white" flex={1} width="100%">
      <NavigationStackHeader title={strings.navigation.title} />
      <Container backgroundColor="white" flex={1}>
        <RewardProgramHeader title={rewardProgramExplainer} />
        {isLoading ? (
          <RewardLoadingSkeleton />
        ) : (
          <Container flex={1}>
            {!isRegistered &&
              (hasRewards ? (
                <RegisterContent {...mainPoolRowProps} />
              ) : (
                <NoRewardContent />
              ))}
            {isRegistered && <ClaimContent rewards={rewards} />}
          </Container>
        )}
      </Container>
    </Container>
  );
};

export default RewardsCenterScreen;
