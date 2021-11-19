import AsyncStorage from '@react-native-community/async-storage';
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
  useAccountSettings,
  useCoinListEdited,
  useInitializeWallet,
  usePinnedAndHiddenItemOptions,
  useWallets,
} from '../hooks';
import { useCoinListEditedValue } from '../hooks/useCoinListEdited';
import { Container, SystemNotification, Text } from '@cardstack/components';
import { colors } from '@cardstack/theme';
import { isLayer2, NOTIFICATION_KEY } from '@cardstack/utils';
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
  const [notificationsVisible, setNotificationsVisible] = useState('false');
  const initializeWallet = useInitializeWallet();
  const { isCoinListEdited } = useCoinListEdited();
  const scrollViewTracker = useValue(0);
  const { isReadOnlyWallet } = useWallets();
  const { isEmpty } = useAccountEmptyState();
  const { network } = useAccountSettings();

  const navigation = useNavigation();
  const { editing, toggle } = usePinnedAndHiddenItemOptions();

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
      // We run the migrations only once on app launch
      initializeWallet({ shouldRunMigrations: true });
      setInitialized(true);
      setNotifications();
    }
  }, [initializeWallet, initialized, params]);

  // Show the exchange fab only for supported networks
  // (mainnet & rinkeby)
  const fabs = [];

  // const isCoinListEditedValue = useCoinListEditedValue();
  const isCoinListEditedValue = true; //temporary

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
      <Animated.View style={{ opacity: isCoinListEditedValue }} />
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
              {discoverSheetAvailable ? (
                <DiscoverHeaderButton />
              ) : (
                <CameraHeaderButton />
              )}
            </Container>
          </Header>
          {showNotificationBanner && (
            <SystemNotification type="info" {...notificationProps} />
          )}
        </HeaderOpacityToggler>
        <AssetListWrapper />
      </FabWrapper>
    </WalletPage>
  );
}
