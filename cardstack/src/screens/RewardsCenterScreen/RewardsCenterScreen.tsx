import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { Container, NavigationStackHeader, Image } from '@cardstack/components';

import rewardBanner from '../../assets/rewards-banner.png';

import {
  RegisterContent,
  NoRewardContent,
  ClaimContent,
  RewardLoadingSkeleton,
} from './components';
import { strings } from './strings';
import { useRewardsCenterScreen } from './useRewardsCenterScreen';

const RewardsCenterScreen = () => {
  const {
    isRegistered,
    hasRewards,
    fullBalanceToken,
    isLoading,
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
    <Container backgroundColor="white" flex={1}>
      <NavigationStackHeader title={strings.navigation.title} />
      <Container backgroundColor="white" flex={1}>
        <Image source={rewardBanner} style={styles.headerImage} />
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
            {isRegistered && (
              <ClaimContent
                claimList={hasRewards ? [mainPoolRowProps] : undefined}
              />
            )}
          </Container>
        )}
      </Container>
    </Container>
  );
};

const styles = StyleSheet.create({
  headerImage: { width: '100%' },
});

export default RewardsCenterScreen;
