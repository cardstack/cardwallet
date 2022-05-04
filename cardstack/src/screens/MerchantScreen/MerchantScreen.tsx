import React, { memo } from 'react';
import { StatusBar } from 'react-native';

import { Container, MerchantContent } from '@cardstack/components';

import { NavBarHeader } from './components/NavBarHeader';
import { useMerchantScreen } from './useMerchantScreen';

const MerchantScreen = () => {
  const {
    isRefreshingBalances,
    refetch,
    merchantSafe,
    safesCount,
    isPrimarySafe,
    changeToPrimarySafe,
  } = useMerchantScreen();

  return (
    <Container flex={1} width="100%" backgroundColor="white">
      <StatusBar barStyle="light-content" />
      <NavBarHeader
        address={merchantSafe.address}
        name={merchantSafe.merchantInfo?.name}
      />
      <MerchantContent
        showSafePrimarySelection={safesCount > 1}
        isPrimarySafe={isPrimarySafe}
        changeToPrimarySafe={changeToPrimarySafe}
        merchantSafe={merchantSafe}
        isRefreshingBalances={isRefreshingBalances}
        refetch={refetch}
      />
    </Container>
  );
};

export default memo(MerchantScreen);
