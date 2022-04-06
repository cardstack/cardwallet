import React from 'react';
import { currencies, NativeCurrency } from '@cardstack/cardpay-sdk';
import { Image, StyleSheet } from 'react-native';

import { ResponsiveValue } from '@shopify/restyle';
import logo from '../../../assets/cardstackLogoTransparent.png';
import { PrepaidCardProps } from '../PrepaidCard';

import { getNativeBalanceFromSpend } from '@cardstack/utils';
import { Container, Text } from '@cardstack/components';
import { Theme } from '@cardstack/theme';

type CardVariants = 'normal' | 'medium';

interface VariantType {
  iconSize: {
    width: number;
    height: number;
    marginTop: number;
  };
  paddingTop: number;
  balanceFontSize: number;
  tokenFontSize: number;
  currencyFontSize: number;
  textVariant: ResponsiveValue<
    keyof Omit<Theme['textVariants'], 'defaults'>,
    Theme
  >;
}

export type PrepaidCardInnerBottomProps = Pick<
  PrepaidCardProps,
  | 'spendFaceValue'
  | 'nativeCurrency'
  | 'currencyConversionRates'
  | 'transferrable'
> & { variant?: CardVariants };

const cardType: Record<CardVariants, VariantType> = {
  normal: {
    iconSize: {
      width: 37,
      height: 39,
      marginTop: 0,
    },
    paddingTop: 4,
    balanceFontSize: 13,
    tokenFontSize: 40,
    currencyFontSize: 20,
    textVariant: 'smallGrey',
  },
  medium: {
    iconSize: {
      width: 28,
      height: 30,
      marginTop: 3,
    },
    paddingTop: 0,
    balanceFontSize: 9,
    tokenFontSize: 29,
    currencyFontSize: 14,
    textVariant: 'xsGrey',
  },
};

const styles = StyleSheet.create({
  logo: { height: '100%', resizeMode: 'contain', width: '100%' },
  currencySufix: { paddingBottom: 5 },
});

const PrepaidCardInnerBottom = ({
  spendFaceValue,
  nativeCurrency,
  currencyConversionRates,
  transferrable,
  variant = 'normal',
}: PrepaidCardInnerBottomProps) => {
  const nativeBalance = getNativeBalanceFromSpend(
    spendFaceValue,
    nativeCurrency,
    currencyConversionRates
  );

  const nativeCurrencyInfo = currencies[nativeCurrency as NativeCurrency];

  return (
    <Container
      paddingHorizontal={6}
      paddingVertical={4}
      paddingTop={cardType[variant].paddingTop}
    >
      <Container
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Container>
          <Text
            fontSize={cardType[variant].balanceFontSize}
            color="spendableBalance"
          >
            Spendable Balance
          </Text>
          <Container flexDirection="row" alignItems="flex-end">
            <Text fontSize={cardType[variant].tokenFontSize} weight="extraBold">
              {`${nativeCurrencyInfo.symbol}${nativeBalance.toFixed(2)}`}
            </Text>
            <Text
              fontSize={cardType[variant].currencyFontSize}
              weight="bold"
              letterSpacing={0}
              style={styles.currencySufix}
            >
              {` ${nativeCurrencyInfo.currency}`}
            </Text>
          </Container>
        </Container>
      </Container>
      <Container
        flexDirection="row"
        alignItems="flex-end"
        justifyContent="space-between"
      >
        <Container>
          <Text variant={cardType[variant].textVariant}>
            {transferrable ? 'TRANSFERRABLE' : 'NON-TRANSFERRABLE'}
          </Text>
        </Container>
        <Container {...cardType[variant].iconSize}>
          <Image source={logo} style={styles.logo} />
        </Container>
      </Container>
    </Container>
  );
};

export default PrepaidCardInnerBottom;
