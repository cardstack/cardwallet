import { useRoute } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import Animated from 'react-native-reanimated';
import { useValue } from 'react-native-redash';
import styled from 'styled-components';

import { OpacityToggler } from '../components/animations';
import { AssetListWrapper } from '../components/asset-list';
import { FabWrapper } from '../components/fab';
import {
  CameraHeaderButton,
  DiscoverHeaderButton,
  Header,
  ProfileHeaderButton,
} from '../components/header';
import { Page } from '../components/layout';
import useExperimentalFlag, {
  DISCOVER_SHEET,
} from '../config/experimentalHooks';
import {
  useAccountEmptyState,
  useCoinListEdited,
  useInitializeWallet,
  usePinnedAndHiddenItemOptions,
  useWallets,
} from '../hooks';
import { useCoinListEditedValue } from '../hooks/useCoinListEdited';
import { colors } from '@cardstack/theme';
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
  const discoverSheetAvailable = useExperimentalFlag(DISCOVER_SHEET);
  const [initialized, setInitialized] = useState(!!params?.initialized);
  const initializeWallet = useInitializeWallet();
  const { isCoinListEdited } = useCoinListEdited();
  const scrollViewTracker = useValue(0);
  const { isReadOnlyWallet } = useWallets();
  const { isEmpty } = useAccountEmptyState();

  const navigation = useNavigation();
  const { editing, toggle } = usePinnedAndHiddenItemOptions();

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
      // We run the migrations only once on app launch
      initializeWallet(null, null, null, true);
      setInitialized(true);
    }
  }, [initializeWallet, initialized, params]);

  // Show the exchange fab only for supported networks
  // (mainnet & rinkeby)
  const fabs = [];

  const isCoinListEditedValue = useCoinListEditedValue();

  return (
    <WalletPage testID="wallet-screen">
      <StatusBar barStyle="light-content" />

      {/* Line below appears to be needed for having scrollViewTracker persistent while
      reattaching of react subviews */}
      <Animated.View style={{ opacity: isCoinListEditedValue }} />
      <Animated.Code exec={scrollViewTracker} />
      <FabWrapper
        disabled={isEmpty || !!params?.emptyWallet}
        fabs={fabs}
        isCoinListEdited={isCoinListEdited}
        isReadOnlyWallet={isReadOnlyWallet}
      >
        <HeaderOpacityToggler isVisible={isCoinListEdited}>
          <Header justify="space-between">
            <ProfileHeaderButton />
            {discoverSheetAvailable ? (
              <DiscoverHeaderButton />
            ) : (
              <CameraHeaderButton />
            )}
          </Header>
        </HeaderOpacityToggler>
        <AssetListWrapper />
      </FabWrapper>
    </WalletPage>
  );
}
