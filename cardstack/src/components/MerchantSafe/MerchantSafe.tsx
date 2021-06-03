import React from 'react';

import { CenteredContainer } from '../Container';
import {
  Container,
  SafeHeader,
  Text,
  TokenBalance,
  Touchable,
  HorizontalDivider,
  Icon,
} from '@cardstack/components';
import { MerchantSafeType } from '@cardstack/types';
import {
  convertAmountToBalanceDisplay,
  convertAmountToNativeDisplay,
} from '@rainbow-me/helpers/utilities';
import { getUSDFromSpend } from '@cardstack/utils';

interface MerchantSafeProps extends MerchantSafeType {
  networkName: string;
  nativeCurrency: string;
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
      alignItems="center"
      flexDirection="row"
      paddingVertical={4}
      width="100%"
      paddingHorizontal={5}
    >
      <Icon name="mandello" />
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
      <LifetimeEarningsSection {...props} />
      <HorizontalDivider />
      <RecentRevenuSection />
      <HorizontalDivider />
      <AvailableBalancesSection {...props} />
    </Container>
  );
};

const LifetimeEarningsSection = ({
  accumulatedSpendValue,
  nativeCurrency,
}: MerchantSafeProps) => {
  const tokenSymbol = 'SPEND';
  const usdBalance = getUSDFromSpend(Number(accumulatedSpendValue));

  const tokenBalanceDisplay = convertAmountToBalanceDisplay(
    accumulatedSpendValue,
    {
      decimals: 18,
      symbol: tokenSymbol,
    }
  );

  const nativeBalanceDisplay = convertAmountToNativeDisplay(
    usdBalance,
    nativeCurrency
  );

  return (
    <Container flexDirection="column">
      <SectionHeader>Lifetime earnings</SectionHeader>
      <TokenBalance
        Icon={<Icon name="spend" />}
        tokenSymbol="SPEND"
        tokenBalance={tokenBalanceDisplay}
        nativeBalance={nativeBalanceDisplay}
      />
    </Container>
  );
};

const RecentRevenuSection = () => {
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
      <SectionHeader>Recent revenue</SectionHeader>
      {revenuePoolToken ? (
        <TokenBalance
          tokenSymbol={revenuePoolToken.token.symbol}
          tokenBalance={revenuePoolToken.balance.display}
          nativeBalance={revenuePoolToken.native.balance.display}
        />
      ) : (
        <EmptySection>No revenue to be claimed</EmptySection>
      )}
    </Container>
  );
};

const AvailableBalancesSection = ({ tokens }: MerchantSafeProps) => {
  const firstToken = tokens.length ? tokens[0] : null;

  return (
    <Container flexDirection="column">
      <SectionHeader>Available balances</SectionHeader>
      <Container
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        {firstToken ? (
          <TokenBalance
            tokenSymbol={firstToken.token.symbol}
            tokenBalance={firstToken.balance.display}
            nativeBalance={firstToken.native.balance.display}
          />
        ) : (
          <EmptySection>No available assets</EmptySection>
        )}
      </Container>
    </Container>
  );
};

const SectionHeader = ({ children }: { children: string }) => (
  <Text marginBottom={3}>{children}</Text>
);

const EmptySection = ({ children }: { children: string }) => (
  <Container>
    <Text variant="subText">{children}</Text>
  </Container>
);
