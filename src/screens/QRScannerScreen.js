import { useIsFocused } from '@react-navigation/native';
import analytics from '@segment/analytics-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import Animated, { useCode } from 'react-native-reanimated';
import styled from 'styled-components';
import { DiscoverSheet } from '../components/discover-sheet';
import { BackButton, Header, HeaderHeight } from '../components/header';

import {
  CameraDimmer,
  EmulatorPasteUriButton,
  QRCodeScanner,
} from '../components/qrcode-scanner';
import { WalletConnectExplainer } from '../components/walletconnect-list';
import {
  CenteredContainer,
  Container,
  ListItem,
  Sheet,
} from '@cardstack/components';
import useExperimentalFlag, {
  DISCOVER_SHEET,
} from '@rainbow-me/config/experimentalHooks';
import { useHeight, useWalletConnectConnections } from '@rainbow-me/hooks';
import { useNavigation } from '@rainbow-me/navigation';
import { scrollPosition } from '@rainbow-me/navigation/ScrollPagerWrapper';
import Routes from '@rainbow-me/routes';
import { shadow } from '@rainbow-me/styles';

const { call, greaterThan, onChange } = Animated;

const ENABLING_CAMERA_OFFSET = 1.01;

const Background = styled.View`
  background-color: black;
  height: 100%;
  position: absolute;
  width: 100%;
`;

function useFocusFromSwipe() {
  const [isFocused, setIsFocused] = useState(false);
  useCode(
    () =>
      onChange(
        greaterThan(scrollPosition, ENABLING_CAMERA_OFFSET),
        call([scrollPosition], ([pos]) =>
          setIsFocused(pos > ENABLING_CAMERA_OFFSET)
        )
      ),
    []
  );
  return isFocused;
}

const QRScannerScreen = () => {
  const discoverSheetAvailable = useExperimentalFlag(DISCOVER_SHEET);
  const isFocusedIOS = useFocusFromSwipe();
  const isFocusedAndroid = useIsFocused();
  const [sheetHeight] = useHeight(240);
  const [initializeCamera, setInitializeCamera] = useState(ios ? true : false);
  const { navigate } = useNavigation();
  const {
    walletConnectorsByDappName,
    walletConnectorsCount,
    walletConnectDisconnectAllByDappName,
  } = useWalletConnectConnections();

  const handlePressBackButton = useCallback(
    () => navigate(Routes.WALLET_SCREEN),
    [navigate]
  );

  useEffect(() => {
    isFocusedAndroid && !initializeCamera && setInitializeCamera(true);
  }, [initializeCamera, isFocusedAndroid]);

  const handlePressActionSheet = useCallback(
    ({ dappName, dappUrl, index }) => {
      if (index === 0) {
        walletConnectDisconnectAllByDappName(dappName);
        analytics.track('Manually disconnected from WalletConnect connection', {
          dappName,
          dappUrl,
        });
      }
    },
    [walletConnectDisconnectAllByDappName]
  );

  return (
    <Container>
      <Header backgroundColor="transparent" position="absolute" zIndex={1}>
        <BackButton
          color="teal"
          direction="left"
          onPress={handlePressBackButton}
          testID="goToBalancesFromScanner"
        />
        <EmulatorPasteUriButton />
      </Header>
      {discoverSheetAvailable && ios ? <DiscoverSheet /> : null}
      <CenteredContainer flexDirection="column" height="100%" overflow="hidden">
        <Background />
        <CameraDimmer>
          {initializeCamera && (
            <QRCodeScanner
              contentPositionBottom={sheetHeight + HeaderHeight}
              contentPositionTop={HeaderHeight}
              enableCamera={ios ? isFocusedIOS : isFocusedAndroid}
            />
          )}
        </CameraDimmer>

        <Container bottom={0} position="absolute" width="100%">
          {discoverSheetAvailable ? (
            android ? (
              <DiscoverSheet />
            ) : null
          ) : (
            <Sheet
              borderRadius={20}
              hideHandle
              style={shadow.buildAsObject(0, 1, 2)}
            >
              {walletConnectorsCount ? (
                <>
                  <FlatList
                    alwaysBounceVertical={false}
                    data={walletConnectorsByDappName}
                    keyExtractor={item => item.dappUrl}
                    removeClippedSubviews
                    renderItem={({ item }) => (
                      <>
                        <ListItem
                          actionSheetProps={{
                            onPress: index => {
                              handlePressActionSheet({ ...item, index });
                            },
                            options: ['Disconnect', 'Cancel'],
                            title: `Would you like to disconnect from ${item.dappName}?`,
                          }}
                          avatarProps={{ source: item.dappIcon }}
                          subText="Connected"
                          title={item.dappName}
                        />
                      </>
                    )}
                    scrollEventThrottle={32}
                  />
                </>
              ) : (
                <WalletConnectExplainer />
              )}
            </Sheet>
          )}
        </Container>
      </CenteredContainer>
    </Container>
  );
};

export default QRScannerScreen;
