import { Linking } from 'react-native';
import { getConstantByNetwork } from '@cardstack/cardpay-sdk';
import React from 'react';
import {
  Container,
  Touchable,
  SafeHeader,
  Icon,
  Text,
} from '@cardstack/components';
import { showActionSheetWithOptions } from '@rainbow-me/utils';
import { MerchantCreationTransactionType } from '@cardstack/types';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';

export const MerchantCreationTransaction = ({
  item,
}: {
  item: MerchantCreationTransactionType;
}) => {
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
    <Container width="100%" paddingHorizontal={4} marginVertical={2}>
      <Touchable width="100%" onPress={onPressTransaction}>
        <Container
          backgroundColor="white"
          borderRadius={10}
          overflow="hidden"
          borderColor="buttonPrimaryBorder"
          width="100%"
        >
          <SafeHeader address={item.address} rightText="MERCHANT NAME" small />
          <Bottom />
        </Container>
      </Touchable>
    </Container>
  );
};

const Bottom = () => {
  return (
    <Container width="100%" justifyContent="center" alignItems="center">
      <Container
        alignItems="center"
        justifyContent="space-between"
        flexDirection="row"
        paddingTop={4}
        width="100%"
        paddingHorizontal={5}
        paddingBottom={5}
      >
        <Container flexDirection="row" alignItems="center">
          <Icon name="user" />
          <Container marginLeft={4} flexDirection="row">
            <Icon name="plus" size={16} color="blueText" />
            <Text variant="subText" weight="bold" marginLeft={1}>
              Created
            </Text>
          </Container>
        </Container>
        <Container alignItems="flex-end">
          <Text weight="extraBold">Merchant Name</Text>
          <Text variant="subText">Merchant Account</Text>
        </Container>
      </Container>
    </Container>
  );
};
