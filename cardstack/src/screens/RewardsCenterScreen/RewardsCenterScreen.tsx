import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import rewardBanner from '../../assets/rewards-banner.png';
import { strings } from './strings';
import { useRewardsCenterScreen } from './useRewardsCenterScreen';
import {
  RegisterContent,
  NoRewardContent,
  ClaimContent,
  RewardLoadingSkeleton,
} from './components';
import { Container, NavigationStackHeader, Image } from '@cardstack/components';

const RewardsCenterScreen = () => {
  const {
    onRegisterPress,
    isRegistered,
    hasRewardsAvailable,
    mainPoolTokenInfo,
    onClaimPress,
    historySectionData,
    tokensBalanceData,
    isLoading,
    isLoadingClaimGas,
  } = useRewardsCenterScreen();

  const mainPoolRowProps = useMemo(
    () => ({
      primaryText: mainPoolTokenInfo?.balance.display || '',
      subText: mainPoolTokenInfo?.native.balance.display || '',
      coinSymbol: mainPoolTokenInfo?.token.symbol || '',
      onClaimPress: onClaimPress(
        mainPoolTokenInfo?.tokenAddress,
        mainPoolTokenInfo?.rewardProgramId
      ),
    }),
    [mainPoolTokenInfo, onClaimPress]
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
                <RegisterContent
                  onRegisterPress={onRegisterPress}
                  {...mainPoolRowProps}
                />
              ) : (
                <NoRewardContent />
              ))}
            {isRegistered && (
              <ClaimContent
                claimList={hasRewardsAvailable ? [mainPoolRowProps] : undefined}
                historyList={historySectionData}
                balanceList={tokensBalanceData}
                isLoadingClaimGas={isLoadingClaimGas}
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
