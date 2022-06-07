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
    hasRewardsAvailable,
    mainPoolTokenInfo,
    historySectionData,
    tokensBalanceData,
    isLoading,
  } = useRewardsCenterScreen();

  const mainPoolRowProps = useMemo(
    () => ({
      primaryText: mainPoolTokenInfo?.balance.display || '',
      subText: mainPoolTokenInfo?.native.balance.display || '',
      coinSymbol: mainPoolTokenInfo?.token.symbol || '',
    }),
    [mainPoolTokenInfo]
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
              (hasRewardsAvailable ? (
                <RegisterContent {...mainPoolRowProps} />
              ) : (
                <NoRewardContent />
              ))}
            {isRegistered && (
              <ClaimContent
                claimList={hasRewardsAvailable ? [mainPoolRowProps] : undefined}
                historyList={historySectionData}
                balanceList={tokensBalanceData}
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
