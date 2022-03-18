import React from 'react';
import rewardBanner from '../../assets/rewards-banner.png';
import { strings } from './strings';
import { useRewardsCenterScreen } from './useRewardsCenterScreen';
import { RegisterContent } from './components/RegisterContent';
import { Container, NavigationStackHeader, Image } from '@cardstack/components';

const RewardsCenterScreen = () => {
  const { onRegisterPress, isRegistered } = useRewardsCenterScreen();

  return (
    <Container backgroundColor="white" flex={1}>
      <NavigationStackHeader title={strings.navigation.title} />
      <Container backgroundColor="white" flex={1}>
        <Image source={rewardBanner} />
        {isRegistered}
        <RegisterContent onRegisterPress={onRegisterPress} />
      </Container>
    </Container>
  );
};

export default RewardsCenterScreen;
