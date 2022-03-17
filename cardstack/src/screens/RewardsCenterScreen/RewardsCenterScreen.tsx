import React from 'react';
import { strings } from './strings';
import { useRewardsCenterScreen } from './useRewardsCenterScreen';
import { Container, Button } from '@cardstack/components';

const RewardsCenterScreen = () => {
  const { onRegisterPress, rewardsSafe } = useRewardsCenterScreen();
  return (
    <Container
      backgroundColor="white"
      alignContent="center"
      justifyContent="center"
      flex={1}
    >
      {rewardsSafe}
      <Button onPress={onRegisterPress}>{strings.buttonRegisterText}</Button>
    </Container>
  );
};

export default RewardsCenterScreen;
