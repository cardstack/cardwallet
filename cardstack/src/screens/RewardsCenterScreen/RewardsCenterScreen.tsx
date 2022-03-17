import React from 'react';
import { strings } from './strings';
import { useRewardsCenterScreen } from './useRewardsCenterScreen';
import { Container, Button } from '@cardstack/components';

const RewardsCenterScreen = () => {
  const { onRegisterPress, isRegistered } = useRewardsCenterScreen();

  return (
    <Container
      backgroundColor="white"
      alignContent="center"
      justifyContent="center"
      flex={1}
    >
      {isRegistered}
      <Button onPress={onRegisterPress}>{strings.buttonRegisterText}</Button>
    </Container>
  );
};

export default RewardsCenterScreen;
