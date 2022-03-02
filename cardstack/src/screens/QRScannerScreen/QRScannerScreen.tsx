import React, { useCallback } from 'react';
import { FlatList } from 'react-native';
import {
  CameraDimmer,
  EmulatorPasteUriButton,
  QRCodeScanner,
} from './components';
import {
  BackButton,
  Header,
  HeaderHeight,
} from '@rainbow-me/components/header';

import { WalletConnectExplainer } from '@rainbow-me/components/walletconnect-list';
import {
  CenteredContainer,
  Container,
  ListItem,
  Sheet,
  SwitchSelector,
} from '@cardstack/components';

import { useWalletConnectConnections } from '@rainbow-me/hooks';
import { useNavigation } from '@rainbow-me/navigation';
import Routes from '@rainbow-me/routes';
const SHEET_HEIGHT = 240;

const QRScannerScreen = () => {
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
      <Header
        backgroundColor="transparent"
        position="absolute"
        zIndex={1}
        width="100%"
        justifyContent="center"
      >
        <SwitchSelector
          options={[
            { label: 'Scan', value: 'scan' },
            { label: 'Request', value: 'request' },
          ]}
          width="60%"
          height={38}
        />
        <Container position="absolute" left={0}>
          <BackButton
            color="teal"
            direction="left"
            onPress={handlePressBackButton}
            testID="goToBalancesFromScanner"
            throttle={undefined}
            textChevron={undefined}
          />
        </Container>
        <Container position="absolute" right={0}>
          <EmulatorPasteUriButton />
        </Container>
      </Header>
      <CenteredContainer flexDirection="column" height="100%" overflow="hidden">
        <Container
          backgroundColor="black"
          position="absolute"
          width="100%"
          height="100%"
        />
        <CameraDimmer>
          <QRCodeScanner
            contentPositionBottom={SHEET_HEIGHT + HeaderHeight}
            contentPositionTop={HeaderHeight}
          />
        </CameraDimmer>

        {/* <Container bottom={0} position="absolute" width="100%">
          <Sheet borderRadius={20} hideHandle shadowEnabled>
            {walletConnectorsCount ? (
              <>
                <FlatList
                  alwaysBounceVertical={false}
                  data={walletConnectorsByDappName}
                  keyExtractor={item => `${item.dappUrl}`}
                  removeClippedSubviews
                  renderItem={({ item, index }) => (
                    <>
                      <ListItem
                        actionSheetProps={{
                          onPress: () => {
                            handlePressActionSheet({ ...item, index });
                          },
                          options: ['Disconnect', 'Cancel'],
                          title: `Would you like to disconnect from ${item.dappName}?`,
                        }}
                        avatarProps={{ source: item.dappIcon }}
                        subText="Connected"
                        title={item.dappName || ''}
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
        </Container> */}
      </CenteredContainer>
    </Container>
  );
};

export default QRScannerScreen;
