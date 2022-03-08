import React from 'react';

import { Container, MainHeader, MerchantSafe } from '@cardstack/components';
import usePrimarySafe from '@cardstack/redux/hooks/usePrimarySafe';

const ProfileScreen = () => {
  const { primarySafe } = usePrimarySafe();

  return (
    <Container backgroundColor="backgroundDarkPurple" flex={1}>
      <MainHeader title="PROFILE" />
      <Container justifyContent="center" flex={1}>
        {!!primarySafe && <MerchantSafe {...primarySafe} />}
      </Container>
    </Container>
  );
};

export default ProfileScreen;
