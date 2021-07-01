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
import {
  CreatedPrepaidCardTransactionType,
  PrepaidCardPaymentTransactionType,
  TransactionTypes,
} from '@cardstack/types';
import { getAddressPreview } from '@cardstack/utils';

type TransactionStatus = {
  operator: '+' | '-';
  status: 'Loaded' | 'Paid';
  iconName: 'arrow-up' | 'arrow-down' | 'refresh';
};

const getTransactionStatus = (
  type:
    | TransactionTypes.CREATED_PREPAID_CARD
    | TransactionTypes.PREPAID_CARD_PAYMENT
): TransactionStatus => {
  const status = {
    [TransactionTypes.CREATED_PREPAID_CARD]: {
      operator: '+',
      status: 'Loaded',
      iconName: 'arrow-down',
    },
    [TransactionTypes.PREPAID_CARD_PAYMENT]: {
      operator: '-',
      status: 'Paid',
      iconName: 'arrow-up',
    },
  };

  return status[type] as TransactionStatus;
};

export const PrepaidCardTransaction = ({
  item,
}: {
  item: CreatedPrepaidCardTransactionType | PrepaidCardPaymentTransactionType;
}) => {
  const network = useRainbowSelector(state => state.settings.network);
  const blockExplorer = getConstantByNetwork('blockExplorer', network);
  const transactionStatus = getTransactionStatus(item.type);

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
          {item.type === TransactionTypes.PREPAID_CARD_PAYMENT && (
            <PaidPrepaidCard transaction={item} status={transactionStatus} />
          )}
          {item.type === TransactionTypes.CREATED_PREPAID_CARD && (
            <CreatedPrepaidCard transaction={item} status={transactionStatus} />
          )}
        </Container>
      </Touchable>
    </Container>
  );
};

const Top = (
  transaction:
    | CreatedPrepaidCardTransactionType
    | PrepaidCardPaymentTransactionType
) => (
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

const Bottom = (
  transaction: (
    | CreatedPrepaidCardTransactionType
    | PrepaidCardPaymentTransactionType
  ) &
    TransactionStatus
) => {
  return (
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
            <Icon name={transaction.iconName} size={16} color="blueText" />
            <Text variant="subText" weight="bold" marginLeft={1}>
              {transaction.status}
            </Text>
          </Container>
        </Container>
        <Container flexDirection="column" marginLeft={3} alignItems="flex-end">
          <Text weight="extraBold">{`${transaction.operator} ${transaction.spendBalanceDisplay}`}</Text>
          <Text variant="subText">{transaction.nativeBalanceDisplay}</Text>
        </Container>
      </Container>
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

const PaidPrepaidCard = ({
  transaction,
  status,
}: {
  transaction: PrepaidCardPaymentTransactionType;
  status: TransactionStatus;
}) => {
  return (
    <Container paddingHorizontal={5} paddingVertical={4}>
      <Bottom {...transaction} {...status} />
    </Container>
  );
};

const CreatedPrepaidCard = ({
  transaction,
  status,
}: {
  transaction: CreatedPrepaidCardTransactionType;
  status: TransactionStatus;
}) => {
  return (
    <>
      <Container paddingHorizontal={5} paddingTop={4}>
        <Bottom {...transaction} {...status} />
      </Container>
      <HorizontalDivider />
      <FundedBy {...transaction} />
    </>
  );
};
