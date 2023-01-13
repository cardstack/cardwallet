import React from 'react';

import {
  Container,
  ListEmptyComponent,
  MainHeader,
  TransactionList,
} from '@cardstack/components';
import { strings } from '@cardstack/components/TransactionList/strings';

import { useAccountSettings } from '@rainbow-me/hooks';

const HomeScreen = () => {
  const { accountAddress, isOnCardPayNetwork, network } = useAccountSettings();

  return (
    <Container backgroundColor="backgroundDarkPurple" flex={1}>
      <MainHeader title="ACTIVITY" />
      <Container flex={1}>
        {isOnCardPayNetwork ? (
          <TransactionList accountAddress={accountAddress} />
        ) : (
          <Container paddingTop={4}>
            <ListEmptyComponent
              text={strings.nonCardPayNetwork(network)}
              textColor="blueText"
              hasRoundBox
              flex={0}
            />
          </Container>
        )}
      </Container>
    </Container>
  );
};

export default HomeScreen;
