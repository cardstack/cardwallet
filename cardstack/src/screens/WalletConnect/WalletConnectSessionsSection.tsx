import React, { useCallback, memo } from 'react';
import { FlatList } from 'react-native';

import { Avatar, Container, Icon, Text } from '@cardstack/components';

import {
  SessionOrPairing,
  useWalletConnectSessions,
} from './useWalletConnectSessions';

const WalletConnectSessions = () => {
  const { items, handleDisconnect } = useWalletConnectSessions();

  const renderItem = useCallback(
    ({ item }: { item: SessionOrPairing }) => {
      const isPairing = !item.peerMetadata;

      const dappData = item.peerMetadata || item?.peer?.metadata;

      const title =
        dappData?.name || (dappData?.url || '').replace('https://', '');

      return (
        <Container
          borderBottomColor="borderGray"
          borderBottomWidth={1}
          flexDirection="row"
          paddingHorizontal={4}
          paddingVertical={3}
          flex={1}
        >
          <Container flex={0.9} justifyContent="center">
            <Avatar source={dappData?.icons[0]} textValue={title} size={40} />
          </Container>
          <Container flex={4}>
            <Text fontSize={16} fontWeight="600">
              {title}
            </Text>
            <Text color="grayText" fontSize={14} fontWeight="600">
              {isPairing ? 'Paired' : 'Session'}
            </Text>
          </Container>
          <Icon
            name="trash"
            size={20}
            color="red"
            alignSelf="center"
            onPress={handleDisconnect(item.topic)}
          />
        </Container>
      );
    },
    [handleDisconnect]
  );

  const keyExtractor = useCallback(({ topic }) => topic, []);

  return (
    <FlatList
      data={items}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
    />
  );
};

export default memo(WalletConnectSessions);
