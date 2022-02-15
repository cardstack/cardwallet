import { useRoute } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';

import { useInitializeWallet } from '../../../../src/hooks';
import {
  AssetList,
  Container,
  MainHeader,
  ServiceStatusNotice,
} from '@cardstack/components';
import { useLoadingOverlay } from '@cardstack/navigation';
import walletLoadingStates from '@rainbow-me/helpers/walletLoadingStates';

export const WalletScreen = () => {
  const { params } = useRoute();
  const [initialized, setInitialized] = useState(!!params?.initialized);
  const initializeWallet = useInitializeWallet();

  const { showLoadingOverlay } = useLoadingOverlay();

  useEffect(() => {
    if (!initialized) {
      const isCreatingWallet = params?.emptyWallet;

      if (isCreatingWallet) {
        showLoadingOverlay({ title: walletLoadingStates.CREATING_WALLET });
      }

      initializeWallet();
      setInitialized(true);
    }
  }, [initializeWallet, initialized, params, showLoadingOverlay]);

  return (
    <Container backgroundColor="backgroundDarkPurple" flex={1} height="100%">
      <MainHeader title="WALLET" />
      <ServiceStatusNotice />
      <AssetList />
    </Container>
  );
};

export default WalletScreen;
