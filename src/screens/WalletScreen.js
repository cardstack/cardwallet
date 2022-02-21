import { useRoute } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import Animated from 'react-native-reanimated';
import { useValue } from 'react-native-redash/lib/module/v1';
import styled from 'styled-components';

import { OpacityToggler } from '../components/animations';
import { AssetListWrapper } from '../components/asset-list';
import { FabWrapper } from '../components/fab';
import {
  CameraHeaderButton,
  Header,
  ProfileHeaderButton,
} from '../components/header';
import { Page } from '../components/layout';

import {
  useAccountEmptyState,
  useCoinListEdited,
  useInitializeWallet,
  usePinnedAndHiddenItemOptions,
  useWallets,
} from '../hooks';
import {
  BusinessAccountBanner,
  Container,
  ServiceStatusNotice,
  Text,
} from '@cardstack/components';
import { useLoadingOverlay } from '@cardstack/navigation';
import { colors } from '@cardstack/theme';
import walletLoadingStates from '@rainbow-me/helpers/walletLoadingStates';
import { useNavigation } from '@rainbow-me/navigation';
import { position } from '@rainbow-me/styles';

const HeaderOpacityToggler = styled(OpacityToggler).attrs(({ isVisible }) => ({
  endingOpacity: 0.4,
  pointerEvents: isVisible ? 'none' : 'auto',
}))`
  padding-top: 5;
  z-index: 1;
`;

const WalletPage = styled(Page)`
  ${position.size('100%')};
  background-color: ${colors.backgroundBlue};
  flex: 1;
`;

export default function WalletScreen() {
  const { params } = useRoute();
  const [initialized, setInitialized] = useState(!!params?.initialized);
  const initializeWallet = useInitializeWallet();
  const { isCoinListEdited } = useCoinListEdited();
  const scrollViewTracker = useValue(0);
  const { isReadOnlyWallet } = useWallets();
  const { isEmpty } = useAccountEmptyState();

  const navigation = useNavigation();
  const { editing, toggle } = usePinnedAndHiddenItemOptions();
  const { showLoadingOverlay } = useLoadingOverlay();

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      if (editing) {
        toggle(null);
      }
    });

    return unsubscribe;
  });

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

  // Show the exchange fab only for supported networks
  // (mainnet & rinkeby)
  const fabs = [];

  return (
    <WalletPage testID="wallet-screen">
      <StatusBar barStyle="light-content" />

      {/* Line below appears to be needed for having scrollViewTracker persistent while
      reattaching of react subviews */}
      <Animated.Code exec={scrollViewTracker} />
      <FabWrapper
        disabled={isEmpty || !!params?.emptyWallet}
        fabs={fabs}
        isCoinListEdited={isCoinListEdited}
        isReadOnlyWallet={isReadOnlyWallet}
      >
        <HeaderOpacityToggler isVisible={isCoinListEdited}>
          <Header>
            <Container
              alignItems="center"
              flex={1}
              flexDirection="row"
              justifyContent="space-between"
            >
              <ProfileHeaderButton />
              <Container
                alignItems="flex-end"
                flex={0.5}
                justifyContent="center"
              >
                <Text color="white" weight="bold">
                  ASSETS
                </Text>
              </Container>
              <CameraHeaderButton />
            </Container>
          </Header>
          <ServiceStatusNotice />
          <BusinessAccountBanner />
        </HeaderOpacityToggler>
        <AssetListWrapper />
      </FabWrapper>
    </WalletPage>
  );
}
