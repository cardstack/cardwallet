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
    <Container backgroundColor="backgroundDarkPurple" flex={1}>
      <MainHeader title={strings.header.profile} />
      <Container justifyContent="center" flexGrow={1}>
        {!primarySafe && isFetching ? (
          <ActivityIndicator size="large" color="white" />
        ) : (
          <CreateProfile />
        )}
      </Container>
    </Container>
  );
};

export default ProfileScreen;
