import React from 'react';
import CoinIcon from 'react-coin-icon';

import { CenteredContainer } from '../Container';
import { TokenType } from '@cardstack/types';
import { Container, SafeHeader, Text, Touchable } from '@cardstack/components';

interface MerchantSafeType {
  address: string;
  tokens: TokenType[];
}

interface MerchantSafeProps extends MerchantSafeType {
  networkName: string;
}

export const MerchantSafe = (props: MerchantSafeProps) => {
  const onPress = () => ({});

  return (
    <Container width="100%" paddingHorizontal={4}>
      <Touchable width="100%" testID="inventory-card" onPress={onPress}>
        <Container
          backgroundColor="white"
          borderRadius={10}
          overflow="hidden"
          borderColor="buttonPrimaryBorder"
          width="100%"
        >
          <SafeHeader {...props} onPress={onPress} />
          <MerchantInfo />
          <Bottom {...props} />
        </Container>
      </Touchable>
    </Container>
  );
};

const MerchantInfo = () => (
  <Container width="100%" justifyContent="center" alignItems="center">
    <Container
      flexDirection="row"
      paddingVertical={4}
      width="100%"
      paddingHorizontal={5}
    >
      <CenteredContainer
        height={80}
        borderRadius={100}
        backgroundColor="red"
        width={80}
      >
        <Text color="white" fontSize={11} weight="extraBold">
          MANDELLO
        </Text>
      </CenteredContainer>
      <Container flexDirection="column" marginLeft={4} justifyContent="center">
        <Text weight="bold">Mandello</Text>
        <Text variant="subText">Merchant Account</Text>
      </Container>
    </Container>
  </Container>
);

const Bottom = (props: MerchantSafeProps) => {
  return (
    <Container paddingHorizontal={6} paddingBottom={6}>
      <CustomerSpendSection />
      <HorizontalDivider />
      <RevenuePoolSection />
      <HorizontalDivider />
      <MerchantSafeSection {...props} />
    </Container>
  );
};

const CustomerSpendSection = () => {
  return (
    <Container flexDirection="column">
      <Text marginBottom={2}>Customer Spend</Text>
      <Container
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Container>
          <Container flexDirection="row">
            <CenteredContainer
              backgroundColor="brightBlue"
              height={30}
              width={30}
              borderRadius={100}
            >
              <Text color="white" weight="extraBold" size="medium">
                §
              </Text>
            </CenteredContainer>
            <Container flexDirection="column" marginLeft={2}>
              <Text size="medium" weight="extraBold">
                21,000,000 SPEND
              </Text>
              <Text variant="subText">$20,000</Text>
            </Container>
          </Container>
        </Container>
      </Container>
    </Container>
  );
};

const RevenuePoolSection = () => {
  const revenuePoolToken = {
    token: {
      symbol: 'DAI',
    },
    balance: {
      display: '74.5991 DAI',
    },
    native: {
      balance: {
        display: '$75.00',
      },
    },
  };

  return (
    <Container flexDirection="column">
      <Text marginBottom={2}>Revenue Pool</Text>
      <Container
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Container>
          <Container flexDirection="row">
            <CoinIcon size={30} {...revenuePoolToken.token} />
            <Container flexDirection="column" marginLeft={2}>
              <Text size="medium" weight="extraBold">
                {`${revenuePoolToken.balance.display}`}
              </Text>
              <Text variant="subText">
                {revenuePoolToken.native.balance.display}
              </Text>
            </Container>
          </Container>
        </Container>
      </Container>
    </Container>
  );
};

const MerchantSafeSection = ({ tokens }: MerchantSafeProps) => {
  const firstToken = tokens[0];

  return (
    <Container flexDirection="column">
      <Text marginBottom={2}>Merchant Safe</Text>
      <Container
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Container>
          <Container flexDirection="row">
            <CoinIcon size={30} {...firstToken.token} />
            <Container flexDirection="column" marginLeft={2}>
              <Text size="medium" weight="extraBold">
                {`${firstToken.balance.display}`}
              </Text>
              <Text variant="subText">{firstToken.native.balance.display}</Text>
            </Container>
          </Container>
        </Container>
      </Container>
    </Container>
  );
};

const HorizontalDivider = () => (
  <Container
    marginVertical={4}
    height={1}
    backgroundColor="borderGray"
    width="100%"
  />
);
