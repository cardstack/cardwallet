import React from 'react';

import { Container, MainHeader, TransactionList } from '@cardstack/components';

import { useAccountSettings } from '@rainbow-me/hooks';

const HomeScreen = () => {
  const { accountAddress } = useAccountSettings();

  return (
    <Container backgroundColor="backgroundDarkPurple" flex={1}>
      <MainHeader title="ACTIVITY" />
      <Container flex={1}>
        <TransactionList accountAddress={accountAddress} />
      </Container>
    </Container>
  );
};

export default HomeScreen;
