import React, { useCallback } from 'react';
import { Alert, FlatList } from 'react-native';

import {
  Avatar,
  Button,
  CenteredContainer,
  Container,
  Text,
} from '@cardstack/components';

import { useWalletConnectConnections } from '@rainbow-me/hooks';

const WalletConnectLegacySessionsSection = () => {
  const {
    walletConnectorsByDappName,
    walletConnectDisconnectAllByDappNameOrUrl,
  } = useWalletConnectConnections();

  const handleDisconnectSession = useCallback(
    (sessionName?: string) => () => {
      if (sessionName) {
        Alert.alert(`Would you like to disconnect from ${sessionName}?`, '', [
          {
            onPress: () =>
              walletConnectDisconnectAllByDappNameOrUrl(sessionName),
            text: 'Disconnect',
          },
          {
            style: 'cancel',
            text: 'Cancel',
          },
        ]);
      }
    },
    [walletConnectDisconnectAllByDappNameOrUrl]
  );

  const renderItem = useCallback(
    ({ item }) => {
      const title =
        item.dappName || (item.dappUrl || '').replace('https://', '');

      return (
        <Container
          borderBottomColor="grayLightBackground"
          borderBottomWidth={1}
          flexDirection="row"
          paddingHorizontal={7}
          paddingVertical={4}
          testID="session-item"
        >
          <Container
            alignItems="center"
            flex={1}
            flexDirection="row"
            paddingLeft={1}
          >
            <CenteredContainer height={30} width={30}>
              <Avatar source={item.dappIcon} />
            </CenteredContainer>
            <Container marginLeft={7}>
              <Text fontSize={16} fontWeight="600">
                {title}
              </Text>
              <Text color="grayText" fontSize={14} fontWeight="600">
                Connected
              </Text>
            </Container>
          </Container>
          <Container
            alignItems="center"
            flex={1}
            flexDirection="row"
            justifyContent="flex-end"
          >
            <Button
              borderColor="buttonSecondaryBorder"
              height={50}
              onPress={handleDisconnectSession(item.dappName || item.dappUrl)}
              variant="smallPrimaryWhite"
              width={135}
            >
              Disconnect
            </Button>
          </Container>
        </Container>
      );
    },
    [handleDisconnectSession]
  );

  const keyExtractor = useCallback(
    (item, index) => `${item.dappUrl}_${index}`,
    []
  );

  return (
    <Container paddingTop={4}>
      <FlatList
        data={walletConnectorsByDappName}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
      />
    </Container>
  );
};

export default WalletConnectLegacySessionsSection;
