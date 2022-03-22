import React, { useMemo } from 'react';
import { ActivityIndicator } from 'react-native';
import { CreateProfile, strings } from './components';
import { Container, MainHeader, MerchantContent } from '@cardstack/components';
import { usePrimarySafe } from '@cardstack/redux/hooks/usePrimarySafe';

const ProfileScreen = () => {
  const { primarySafe, isFetching, safesCount } = usePrimarySafe();

  const ProfileBody = useMemo(
    () =>
      primarySafe ? (
        <MerchantContent
          showSafePrimarySelection={safesCount > 1}
          isPrimarySafe
          merchantSafe={primarySafe}
          isRefreshingBalances={isFetching}
        />
      ) : (
        <CreateProfile />
      ),
    [primarySafe, isFetching, safesCount]
  );

  return (
    <Container
      backgroundColor={primarySafe ? 'white' : 'backgroundDarkPurple'}
      flex={1}
    >
      <MainHeader title={strings.title} />
      <Container justifyContent="center" flexGrow={1}>
        {!primarySafe && isFetching ? (
          <ActivityIndicator size="large" color="white" />
        ) : (
          ProfileBody
        )}
      </Container>
    </Container>
  );
};

export default ProfileScreen;
