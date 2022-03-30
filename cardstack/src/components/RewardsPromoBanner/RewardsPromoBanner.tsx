import React, { memo, useCallback } from 'react';

import { useNavigation } from '@react-navigation/core';
import rewardsPromoBanner from '../../assets/promo-rewards.png';
import { Button } from '../Button';
import { CenteredContainer } from '../Container';
import { Container, Image, Text } from '@cardstack/components';
import Routes from '@rainbow-me/navigation/routesNames';

const strings = {
  rewards: 'Rewards',
};

const RewardsPromoBanner = () => {
  const { navigate } = useNavigation();

  const onPress = useCallback(() => {
    navigate(Routes.REWARDS_CENTER_SCREEN);
  }, [navigate]);

  return (
    <Container>
      <Image
        alignSelf="center"
        overflow="hidden"
        borderRadius={10}
        maxWidth="90%"
        source={rewardsPromoBanner}
      />
      <CenteredContainer position="absolute" bottom="15%" left={0} right={0}>
        <Button onPress={onPress} variant="small" height={30}>
          <Text fontSize={13} fontWeight="600">
            {strings.rewards}
          </Text>
        </Button>
      </CenteredContainer>
    </Container>
  );
};

export default memo(RewardsPromoBanner);
