import { getConstantByNetwork } from '@cardstack/cardpay-sdk';
import React from 'react';
import { Linking } from 'react-native';
import {
  CoinIcon,
  Container,
  ContainerProps,
  Icon,
  SafeHeader,
  Text,
  Touchable,
} from '@cardstack/components';
import { BridgedTokenTransactionType } from '@cardstack/types';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';
import { showActionSheetWithOptions } from '@rainbow-me/utils';

export interface BridgedTokenTransactionProps extends ContainerProps {
  item: BridgedTokenTransactionType;
}

/**
 * A component for displaying a transaction item
 */
export const BridgedTokenTransaction = ({
  item,
  ...props
}: BridgedTokenTransactionProps) => {
  const network = useRainbowSelector(state => state.settings.network);
  const blockExplorer = getConstantByNetwork('blockExplorer', network);

  if (!item) {
    return null;
  }

  const onPressTransaction = () => {
    showActionSheetWithOptions(
      {
        options: ['View on Blockscout', 'Cancel'],
        cancelButtonIndex: 1,
      },
      (buttonIndex: number) => {
        if (buttonIndex === 0) {
          Linking.openURL(`${blockExplorer}/tx/${item.transactionHash}`);
        }
      }
    );
  };

  return (
    <Container width="100%" paddingHorizontal={4} {...props} marginVertical={2}>
      <Touchable
        width="100%"
        testID="inventory-card"
        onPress={onPressTransaction}
      >
        <Container
          backgroundColor="white"
          borderRadius={10}
          overflow="hidden"
          borderColor="buttonPrimaryBorder"
          width="100%"
        >
          <SafeHeader address={item.to} rightText="DEPOT" small />
          <Bottom {...item} />
        </Container>
      </Touchable>
    </Container>
  );
};

const Bottom = (token: BridgedTokenTransactionType) => {
  return (
    <Container paddingHorizontal={5} paddingVertical={4}>
      <Container
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Container
          alignItems="center"
          flexDirection="row"
          justifyContent="space-between"
          width="100%"
        >
          <Container flexDirection="row" alignItems="center">
            {/* NEED ERC-20 TOKEN DATA */}
            <CoinIcon address={token.token} symbol="DAI" />
            <Container marginLeft={4} flexDirection="row">
              <Icon name="arrow-down" size={16} color="blueText" />
              <Text variant="subText" weight="bold" marginLeft={1}>
                Received
              </Text>
            </Container>
          </Container>
          <Container
            flexDirection="column"
            marginLeft={3}
            alignItems="flex-end"
          >
            <Text weight="extraBold">{`+ ${token.balance.display}`}</Text>
            <Text variant="subText">{token.native.display}</Text>
          </Container>
        </Container>
      </Container>
    </Container>
  );
};
