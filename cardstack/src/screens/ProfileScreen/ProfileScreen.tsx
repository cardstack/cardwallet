import React, { useMemo, useCallback } from 'react';
import { ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { CreateProfile, strings } from './components';
import {
  Container,
  MainHeader,
  MerchantContent,
  Text,
} from '@cardstack/components';
import { usePrimarySafe } from '@cardstack/redux/hooks/usePrimarySafe';
import { useAccountSettings } from '@rainbow-me/hooks';
import { Network } from '@rainbow-me/helpers/networkTypes';

const ProfileScreen = () => {
  const { primarySafe, isFetching, refetch, safesCount } = usePrimarySafe();
  const { network } = useAccountSettings();

  const ProfileBody = useMemo(() => {
    if (!primarySafe && isFetching) {
      return <ActivityIndicator size="large" color="white" />;
    }

    return primarySafe ? (
      <MerchantContent
        showSafePrimarySelection={safesCount > 1}
        isPrimarySafe
        merchantSafe={primarySafe}
        isRefreshingBalances={isFetching}
        refetch={refetch}
      />
    ) : (
      <CreateProfile />
    );
  }, [primarySafe, isFetching, safesCount, refetch]);

  const isMainNet = useMemo(() => network === Network.mainnet, [network]);

  const onRefresh = useCallback(() => {
    refetch && refetch();
  }, [refetch]);

  useFocusEffect(onRefresh);

  return (
    <Container
      backgroundColor={primarySafe ? 'white' : 'backgroundDarkPurple'}
      flex={1}
    >
      <MainHeader title={strings.header.profile} />
      <Container
        justifyContent="center"
        flexGrow={1}
        paddingHorizontal={isMainNet ? 5 : 0}
      >
        {isMainNet ? (
          <Text color="white" fontSize={26}>
            {strings.stepOne.switchToGnosisChain}
          </Text>
        ) : (
          ProfileBody
        )}
      </Container>
    </Container>
  );
};

export default ProfileScreen;
