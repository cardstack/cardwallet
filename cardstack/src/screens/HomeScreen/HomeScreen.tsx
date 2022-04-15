import React from 'react';

import { Container, MainHeader, TransactionList } from '@cardstack/components';

import { useAccountProfile } from '@rainbow-me/hooks';

const HomeScreen = () => {
  const { accountAddress } = useAccountProfile();

  return (
    <Container backgroundColor="backgroundDarkPurple" flex={1}>
      <MainHeader title="ACTIVITY" />
      <Container>
        <TransactionList accountAddress={accountAddress} />
      </Container>
    </Container>
  );
};

export default HomeScreen;
