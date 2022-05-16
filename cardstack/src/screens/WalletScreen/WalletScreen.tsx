import { useRoute } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';

import {
  AssetList,
  Container,
  MainHeader,
  ServiceStatusNotice,
  WelcomeCtaBanner,
} from '@cardstack/components';
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
      {__DEV__ && <WelcomeCtaBanner />}
      <ServiceStatusNotice />
      <AssetList />
    </Container>
  );
};

export default WalletScreen;
