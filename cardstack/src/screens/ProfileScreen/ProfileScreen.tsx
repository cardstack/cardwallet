import React from 'react';
import { CreateProfile, strings } from './components';
import { Container, MainHeader, MerchantContent } from '@cardstack/components';
import { usePrimarySafe } from '@cardstack/redux/hooks/usePrimarySafe';

const ProfileScreen = () => {
  const { primarySafe, isFetching, safesCount } = usePrimarySafe();

  return (
    <Container
      backgroundColor={primarySafe ? 'white' : 'backgroundDarkPurple'}
      flex={1}
    >
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
