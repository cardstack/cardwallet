import React, { useMemo } from 'react';

import { Container, MainHeader, TransactionList } from '@cardstack/components';
import { useAccountProfile } from '@rainbow-me/hooks';
import {
  DiscordPromoBanner,
  useDiscordPromoBanner,
} from '@cardstack/components/DiscordPromoBanner';

const HomeScreen = () => {
  const { accountAddress } = useAccountProfile();

  const {
    showPromoBanner,
    onPress: onDiscordPromoPress,
  } = useDiscordPromoBanner();

  const renderPromoBanner = useMemo(
    () =>
      showPromoBanner ? (
        <DiscordPromoBanner onPress={onDiscordPromoPress} />
      ) : undefined,
    [onDiscordPromoPress, showPromoBanner]
  );

  return (
    <Container backgroundColor="backgroundDarkPurple" flex={1}>
      <MainHeader title="ACTIVITY" />
      <Container>
        <TransactionList
          Header={renderPromoBanner}
          accountAddress={accountAddress}
        />
      </Container>
    </Container>
  );
};

export default HomeScreen;
