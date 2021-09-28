import { useIsFocused } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList } from 'react-native';
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
import Routes from '@rainbow-me/routes';
import { shadow } from '@rainbow-me/styles';

const Background = styled.View`
  background-color: black;
  height: 100%;
  position: absolute;
  width: 100%;
`;

const QRScannerScreen = () => {
  const discoverSheetAvailable = useExperimentalFlag(DISCOVER_SHEET);
  const isFocused = useIsFocused();
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
    isFocused && !initializeCamera && setInitializeCamera(true);
  }, [initializeCamera, isFocused]);

  const handlePressActionSheet = useCallback(
    ({ dappName, index }) => {
      if (index === 0) {
        walletConnectDisconnectAllByDappName(dappName);
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
              enableCamera={isFocused}
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
              css={shadow.buildAsObject(0, 1, 2)}
              hideHandle
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
