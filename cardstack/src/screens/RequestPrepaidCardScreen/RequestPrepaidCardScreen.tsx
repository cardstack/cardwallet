import React, { useMemo } from 'react';
import { strings } from './strings';
import { useRequestPrepaidCardScreen } from './useRequestPrepaidCardScreen';
import { Container, NavigationStackHeader } from '@cardstack/components';

const RequestPrepaidCardScreen = () => {
  const {} = useRequestPrepaidCardScreen();

  return (
    <Container backgroundColor="backgroundDarkPurple" flex={1}>
      <NavigationStackHeader title={strings.navigation.title} />
    </Container>
  );
};

export default RequestPrepaidCardScreen;
