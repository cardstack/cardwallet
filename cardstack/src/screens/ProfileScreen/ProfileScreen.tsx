import React from 'react';

import { CreateProfileStepOne, strings } from './components';
import { Container, MainHeader, MerchantContent } from '@cardstack/components';
import usePrimarySafe from '@cardstack/redux/hooks/usePrimarySafe';

const ProfileScreen = () => {
  const { primarySafe, isFetching, safesCount } = usePrimarySafe();

  // TODO: add step indicator and other step screens
  const CreateProfile = () => (
    <Container flex={1}>
      <CreateProfileStepOne />
    </Container>
  );

  return (
    <Container backgroundColor="white" flex={1}>
      <MainHeader title={strings.title} />

      <Container justifyContent="center" flexGrow={1}>
        {primarySafe ? (
          <MerchantContent
            showSafePrimarySelection={safesCount > 1}
            isPrimarySafe={true}
            merchantSafe={primarySafe}
            isRefreshingBalances={isFetching}
          />
        ) : (
          <CreateProfile />
        )}
      </Container>
    </Container>
  );
};

export default ProfileScreen;
