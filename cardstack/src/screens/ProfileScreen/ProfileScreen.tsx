import React from 'react';

import { CreateProfileStepOne, strings } from './components';
import { Container, MainHeader, MerchantSafe } from '@cardstack/components';
import usePrimarySafe from '@cardstack/redux/hooks/usePrimarySafe';

const ProfileScreen = () => {
  const { primarySafe } = usePrimarySafe();

  // TODO: add step indicator and other step screens
  const CreateProfile = () => (
    <Container flex={1}>
      <CreateProfileStepOne />
    </Container>
  );

  return (
    <Container backgroundColor="backgroundDarkPurple" flex={1}>
      <MainHeader title={strings.title} />
      <Container justifyContent="center" flexGrow={1}>
        {primarySafe ? <MerchantSafe {...primarySafe} /> : <CreateProfile />}
      </Container>
    </Container>
  );
};

export default ProfileScreen;
