import { useRoute } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';

import {
  AssetList,
  Container,
  MainHeader,
  ServiceStatusNotice,
  WelcomeCtaBanner,
} from '@cardstack/components';
import { useShowOnboarding } from '@cardstack/hooks/onboarding/useShowOnboarding';
import { RouteType } from '@cardstack/navigation/types';

import { useWalletManager, useWallets } from '@rainbow-me/hooks';

export const WalletScreen = () => {
  const { params } = useRoute<RouteType<{ initialized?: boolean }>>();
  const { initializeWallet } = useWalletManager();

  const { walletReady } = useWallets();

  const initialized = useRef(!!params?.initialized);

  const { navigateToNextOnboardingStep, isLoadingSafes } = useShowOnboarding();
  // This is necessary since other instances of useShowOnboading will
  // trigger a re-render on navigateToNextOnboardingStep reference changing.
  const calledOnboardingOnce = useRef(false);

  useEffect(() => {
    if (!initialized.current && !walletReady) {
      initializeWallet();
      initialized.current = true;
    }
  }, [initializeWallet, walletReady]);

  useEffect(() => {
    if (!calledOnboardingOnce.current && walletReady && !isLoadingSafes) {
      navigateToNextOnboardingStep();
      calledOnboardingOnce.current = true;
    }
  }, [walletReady, navigateToNextOnboardingStep, isLoadingSafes]);

  return (
    <Container backgroundColor="backgroundDarkPurple" flex={1} height="100%">
      <MainHeader title="WALLET" />
      <WelcomeCtaBanner />
      <ServiceStatusNotice />
      <AssetList />
    </Container>
  );
};

export default WalletScreen;
