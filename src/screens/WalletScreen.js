import AsyncStorage from '@react-native-async-storage/async-storage';
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
  useAccountSettings,
  useCoinListEdited,
  useInitializeWallet,
  usePinnedAndHiddenItemOptions,
  useWallets,
} from '../hooks';
import {
  Container,
  ServiceStatusNotice,
  SystemNotification,
  Text,
} from '@cardstack/components';
import { useLoadingOverlay } from '@cardstack/navigation';
import { colors } from '@cardstack/theme';
import { isLayer2, NOTIFICATION_KEY } from '@cardstack/utils';
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
  const [notificationsVisible, setNotificationsVisible] = useState('false');
  const initializeWallet = useInitializeWallet();
  const { isCoinListEdited } = useCoinListEdited();
  const scrollViewTracker = useValue(0);
  const { isReadOnlyWallet } = useWallets();
  const { isEmpty } = useAccountEmptyState();
  const { network } = useAccountSettings();

  const navigation = useNavigation();
  const { editing, toggle } = usePinnedAndHiddenItemOptions();
  const { showLoadingOverlay } = useLoadingOverlay();

  const setNotifications = async () => {
    try {
      const value = await AsyncStorage.getItem(NOTIFICATION_KEY);
      if (value === null) {
        // value previously stored
        AsyncStorage.setItem(NOTIFICATION_KEY, 'true');
        setNotificationsVisible('true');
      } else {
        setNotificationsVisible(value);
      }
    } catch (e) {
      // error reading value
      console.log('error', e);
    }
  };

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
      setNotifications();
    }
  }, [initializeWallet, initialized, params, showLoadingOverlay]);

  // Show the exchange fab only for supported networks
  // (mainnet & rinkeby)
  const fabs = [];

  const closedText = (
    <Text>
      Prepaid cards are denominated {`\n`} in{' '}
      <Text flex={1} weight="bold">
        SPEND §
      </Text>
    </Text>
  );

  const openedHeaderText = '1 SPEND = $0.01 USD';

  const openedBodyText =
    'The Spendable Balance may fluctuate slightly based on the exchange rate of the underlying token (USD_DAI).';

  const notificationProps = {
    closedText,
    openedHeaderText,
    openedBodyText,
  };

  const showNotificationBanner =
    notificationsVisible === 'true' && !isEmpty && isLayer2(network);

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
                <Text color="white" fontWeight="bold">
                  ASSETS
                </Text>
              </Container>
              <CameraHeaderButton />
            </Container>
          </Header>
          <ServiceStatusNotice />
          {showNotificationBanner && (
            <SystemNotification type="info" {...notificationProps} />
          )}
        </HeaderOpacityToggler>
        <AssetListWrapper />
      </FabWrapper>
    </WalletPage>
  );
}
