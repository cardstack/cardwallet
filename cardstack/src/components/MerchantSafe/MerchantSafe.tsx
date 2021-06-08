import React from 'react';
import {
  convertAmountToBalanceDisplay,
  convertAmountToNativeDisplay,
} from '@cardstack/cardpay-sdk';
import {
  Container,
  HorizontalDivider,
  Icon,
  SafeHeader,
  Text,
  TokenBalance,
  Touchable,
  MoreItemsFooter,
} from '@cardstack/components';
import { MerchantSafeType } from '@cardstack/types';
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
      paddingTop={4}
      width="100%"
      paddingHorizontal={5}
      paddingBottom={10}
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
      <RecentRevenueSection {...props} />
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
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

const RecentRevenueSection = ({ revenueBalances }: MerchantSafeProps) => {
  const firstToken = revenueBalances.length ? revenueBalances[0] : null;

  return (
    <Container flexDirection="column">
      <SectionHeader>Unclaimed revenue</SectionHeader>
      {firstToken ? (
        <TokenBalance
          address={firstToken.tokenAddress}
          tokenSymbol={firstToken.token.symbol}
          tokenBalance={firstToken.balance.display}
          nativeBalance={firstToken.native.balance.display}
        />
      ) : (
        <EmptySection>No revenue to be claimed</EmptySection>
      )}
      <MoreItemsFooter tokens={revenueBalances} />
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
            address={firstToken.tokenAddress}
            tokenSymbol={firstToken.token.symbol}
            tokenBalance={firstToken.balance.display}
            nativeBalance={firstToken.native.balance.display}
          />
        ) : (
          <EmptySection>No available assets</EmptySection>
        )}
      </Container>
      <MoreItemsFooter tokens={tokens} />
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
