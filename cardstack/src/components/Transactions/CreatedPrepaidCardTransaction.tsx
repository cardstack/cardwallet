import React from 'react';
import { getConstantByNetwork } from '@cardstack/cardpay-sdk';
import { Linking } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { Icon } from '../Icon';
import { CoinIcon } from '../CoinIcon';
import {
  Container,
  Touchable,
  Text,
  NetworkBadge,
  HorizontalDivider,
} from '@cardstack/components';
import { showActionSheetWithOptions } from '@rainbow-me/utils';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';
import { CreatedPrepaidCardTransactionType } from '@cardstack/types';
import { getAddressPreview } from '@cardstack/utils';

export const CreatedPrepaidCardTransaction = ({
  item,
}: {
  item: CreatedPrepaidCardTransactionType;
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
          <Top {...item} />
          <Bottom {...item} />
          <FundedBy {...item} />
        </Container>
      </Touchable>
    </Container>
  );
};

const Top = (transaction: CreatedPrepaidCardTransactionType) => (
  <Container
    height={40}
    flexDirection="row"
    paddingHorizontal={5}
    justifyContent="space-between"
    width="100%"
    alignItems="center"
  >
    <SVG />
    <Container flexDirection="row" alignItems="center">
      <NetworkBadge marginRight={2} />
      <Text variant="shadowRoboto" size="xs">
        {getAddressPreview(transaction.address)}
      </Text>
    </Container>
    <Text weight="extraBold" size="small">
      PREPAID CARD
    </Text>
  </Container>
);

const Bottom = (transaction: CreatedPrepaidCardTransactionType) => {
  return (
    <Container paddingHorizontal={5} paddingTop={4}>
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
            <Icon name="spend" />
            <Container marginLeft={4} flexDirection="row">
              <Icon name="arrow-down" size={16} color="blueText" />
              <Text variant="subText" weight="bold" marginLeft={1}>
                Loaded
              </Text>
            </Container>
          </Container>
          <Container
            flexDirection="column"
            marginLeft={3}
            alignItems="flex-end"
          >
            <Text weight="extraBold">{`+ ${transaction.spendBalanceDisplay}`}</Text>
            <Text variant="subText">{transaction.nativeBalanceDisplay}</Text>
          </Container>
        </Container>
      </Container>
      <HorizontalDivider />
    </Container>
  );
};

const SVG = () => {
  return (
    <Svg height="40" width="115%" style={{ position: 'absolute' }}>
      <Defs>
        <LinearGradient
          id="grad"
          x1={0.168}
          x2={1.072}
          y2={1.05}
          gradientUnits="objectBoundingBox"
        >
          <Stop offset={0} stopColor="#00ebe5" />
          <Stop offset={1} stopColor="#c3fc33" />
        </LinearGradient>
      </Defs>
      <Rect id="Gradient" width="115%" height="40" fill="url(#grad)" />
    </Svg>
  );
};

const FundedBy = (transaction: CreatedPrepaidCardTransactionType) => {
  return (
    <Container
      paddingHorizontal={5}
      paddingBottom={5}
      flexDirection="row"
      justifyContent="space-between"
    >
      <Container>
        <Text variant="subText" marginBottom={1}>
          Funded by Depot
        </Text>
        <Text size="xs" fontFamily="RobotoMono-Regular">
          {getAddressPreview(transaction.createdFromAddress)}
        </Text>
      </Container>
      <Container flexDirection="row" alignItems="center">
        <Text size="xs" weight="extraBold" marginRight={2}>
          {`- ${transaction.issuingToken.balance.display}`}
        </Text>
        <CoinIcon
          address={transaction.issuingToken.address}
          symbol={transaction.issuingToken.symbol}
          size={20}
        />
      </Container>
    </Container>
  );
};
