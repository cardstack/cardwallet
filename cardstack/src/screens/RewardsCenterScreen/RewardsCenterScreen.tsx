import React from 'react';
import { StyleSheet } from 'react-native';
import rewardBanner from '../../assets/rewards-banner.png';
import { strings } from './strings';
import { useRewardsCenterScreen } from './useRewardsCenterScreen';
import { RegisterContent, NoRewardContent } from './components';
import { Container, NavigationStackHeader, Image } from '@cardstack/components';

const RewardsCenterScreen = () => {
  const {
    onRegisterPress,
    isRegistered,
    hasRewardsAvailable,
    mainPoolTokenInfo,
  } = useRewardsCenterScreen();

  return (
    <Container backgroundColor="white" flex={1}>
      <NavigationStackHeader title={strings.navigation.title} />
      <Container backgroundColor="white" flex={1}>
        <Image source={rewardBanner} style={styles.headerImage} />
        <Container padding={5}>
          {!isRegistered &&
            (hasRewardsAvailable && mainPoolTokenInfo ? (
              <RegisterContent
                onRegisterPress={onRegisterPress}
                primaryText={mainPoolTokenInfo?.balance.display}
                subText={mainPoolTokenInfo?.native.balance.display}
                coinSymbol={mainPoolTokenInfo?.token.symbol}
              />
            ) : (
              <NoRewardContent />
            ))}
        </Container>
      </Container>
    </Container>
  );
};

const styles = StyleSheet.create({
  headerImage: { width: '100%' },
});

export default RewardsCenterScreen;
