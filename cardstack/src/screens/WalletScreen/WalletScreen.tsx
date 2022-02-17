import { useRoute } from '@react-navigation/core';
import React, { useEffect, useRef } from 'react';

import {
  AssetList,
  Container,
  MainHeader,
  ServiceStatusNotice,
} from '@cardstack/components';
import { BusinessAccountBanner } from '@cardstack/components/CollapsibleBanner';
import { RouteType } from '@cardstack/navigation/types';
import { useWalletManager } from '@rainbow-me/hooks';

export const WalletScreen = () => {
  const { params } = useRoute<RouteType<{ initialized?: boolean }>>();
  const { initializeWallet } = useWalletManager();

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
