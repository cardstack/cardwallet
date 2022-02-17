import { useRoute } from '@react-navigation/core';
import React, { useEffect, useRef } from 'react';

import { useInitializeWallet } from '../../../../src/hooks';
import {
  AssetList,
  Container,
  MainHeader,
  ServiceStatusNotice,
} from '@cardstack/components';
import { BusinessAccountBanner } from '@cardstack/components/CollapsibleBanner';
import { RouteType } from '@cardstack/navigation/types';

export const WalletScreen = () => {
  const { params } = useRoute<RouteType<{ initialized?: boolean }>>();
  const { initializeWallet } = useInitializeWallet();

  const initialized = useRef(!!params?.initialized);

  useEffect(() => {
    if (!initialized.current) {
      initializeWallet();
      initialized.current = true;
    }
  }, [initializeWallet]);

  return (
    <Container backgroundColor="backgroundDarkPurple" flex={1} height="100%">
      <MainHeader title="WALLET" />
      <ServiceStatusNotice />
      <BusinessAccountBanner />
      <AssetList />
    </Container>
  );
};

export default WalletScreen;
