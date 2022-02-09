import React from 'react';
import {
  spendToUsd,
  formatCurrencyAmount,
  nativeCurrencies,
  NativeCurrency,
} from '@cardstack/cardpay-sdk';
import SVG, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { BetterOpacityContainer, Container, Text } from '@cardstack/components';

interface SmallPrepaidCardProps {
  /** unique identifier, displayed in top right corner of card */
  id: string;
  /** balance in xDai */
  spendableBalance: number;
}

/**
 * A small prepaid card component
 */
export const SmallPrepaidCard = (props: SmallPrepaidCardProps) => {
  const { id, spendableBalance } = props;
  return (
    <BetterOpacityContainer
      width="100%"
      borderWidth={1}
      borderRadius={10}
      borderColor="borderGray"
    >
      <Container
        backgroundColor="white"
        borderRadius={10}
        overflow="hidden"
        borderColor="buttonPrimaryBorder"
        width="100%"
      >
        <GradientBackground />
        <Top id={id} />
        <Bottom spendableBalance={spendableBalance} />
      </Container>
    </BetterOpacityContainer>
  );
};

const GradientBackground = () => (
  <SVG
    width="100%"
    height={110}
    viewBox="0 0 400 100"
    style={{ position: 'absolute', top: -12 }}
  >
    <Defs>
      <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
        <Stop offset="0" stopColor="#00ebe5" stopOpacity="1" />
        <Stop offset="1" stopColor="#c3fc33" stopOpacity="1" />
      </LinearGradient>
    </Defs>
    <Rect id="Gradient" width="100%" height="60" fill="url(#grad)" />
  </SVG>
);

const Top = ({ id }: { id: string }) => (
  <Container width="100%" paddingHorizontal={6} paddingVertical={4}>
    <Container
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
    >
      <Text fontSize={11} fontWeight="600">
        PREPAID CARD
      </Text>
      <Text variant="shadowRoboto" fontSize={14}>
        {`${id.slice(0, 6)}...${id.slice(-4)}`}
      </Text>
    </Container>
  </Container>
);

const Bottom = ({ spendableBalance }: { spendableBalance: number }) => {
  const formattedSpendableBalance = formatCurrencyAmount(
    spendToUsd(spendableBalance) || 0
  );

  return (
    <Container paddingHorizontal={6} paddingVertical={4}>
      <Container
        flexDirection="row"
        justifyContent="space-between"
        alignItems="flex-end"
      >
        <Container>
          <Text fontSize={11} color="spendableBalance">
            Spendable Balance
          </Text>
          <Text fontSize={26} fontWeight="700">
            {`§${formatCurrencyAmount(
              spendableBalance.toString(),
              nativeCurrencies[NativeCurrency.SPD].decimals
            )}`}
          </Text>
        </Container>
        <Text fontWeight="700">{`$${formattedSpendableBalance} USD`}</Text>
      </Container>
    </Container>
  );
};
