import React from 'react';

import {
  CenteredContainer,
  Container,
  MainHeader,
  MerchantSafe,
  MerchantSafeProps,
} from '@cardstack/components';
import usePrimaryMerchant from '@cardstack/redux/hooks/usePrimaryMerchant';

const ProfileScreen = () => {
  const { primaryMerchant } = usePrimaryMerchant();

  return (
    <Container backgroundColor="backgroundDarkPurple" flex={1}>
      <MainHeader title="PROFILE" />
      <CenteredContainer flex={1}>
        <MerchantSafe {...(primaryMerchant as MerchantSafeProps)} />
      </CenteredContainer>
    </Container>
  );
};

export default ProfileScreen;
