import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import rewardBanner from '../../assets/rewards-banner.png';
import { strings } from './strings';
import { useRewardsCenterScreen } from './useRewardsCenterScreen';
import { RegisterContent, NoRewardContent, RewardRow } from './components';
import { Container, NavigationStackHeader, Image } from '@cardstack/components';

const RewardsCenterScreen = () => {
  const {
    onRegisterPress,
    isRegistered,
    hasRewardsAvailable,
    mainPoolTokenInfo,
    onClaimPress,
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
        <Container padding={5}>
          {!isRegistered &&
            (hasRewardsAvailable ? (
              <RegisterContent
                onRegisterPress={onRegisterPress}
                {...mainPoolRowProps}
              />
            ) : (
              <NoRewardContent />
            ))}
          {isRegistered && hasRewardsAvailable && (
            <RewardRow
              {...mainPoolRowProps}
              onClaimPress={onClaimPress(
                mainPoolTokenInfo?.tokenAddress,
                mainPoolTokenInfo?.rewardProgramId
              )}
            />
          )}
        </Container>
      </Container>
    </Container>
  );
};

const styles = StyleSheet.create({
  headerImage: { width: '100%' },
});

export default RewardsCenterScreen;
