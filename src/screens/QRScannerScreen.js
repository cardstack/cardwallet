import React, { useCallback } from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components';
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
  const [sheetHeight] = useHeight(240);
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
      <CenteredContainer flexDirection="column" height="100%" overflow="hidden">
        <Background />
        <CameraDimmer>
          <QRCodeScanner
            contentPositionBottom={sheetHeight + HeaderHeight}
            contentPositionTop={HeaderHeight}
          />
        </CameraDimmer>

        <Container bottom={0} position="absolute" width="100%">
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
        </Container>
      </CenteredContainer>
    </Container>
  );
};

export default QRScannerScreen;
