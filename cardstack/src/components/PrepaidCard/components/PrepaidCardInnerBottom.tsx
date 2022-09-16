import { ResponsiveValue } from '@shopify/restyle';
import React, { memo } from 'react';
import { Image, StyleSheet } from 'react-native';

import { Container, Text } from '@cardstack/components';
import { Theme } from '@cardstack/theme';

import logo from '../../../assets/cardstackLogoTransparent.png';
import { PrepaidCardProps } from '../PrepaidCard';

import { strings } from './strings';

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
  'transferrable'
> & {
  variant?: CardVariants;
  nativeCurrencyInfo: { symbol: string; currency: string };
  nativeBalance: string;
};

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
  transferrable,
  variant = 'normal',
  nativeCurrencyInfo,
  nativeBalance,
}: PrepaidCardInnerBottomProps) => (
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
        <Text fontSize={cardType[variant].balanceFontSize} color="blueDarkest">
          {strings.spendableBalance}
        </Text>
        <Container flexDirection="row" alignItems="flex-end">
          <Text fontSize={cardType[variant].tokenFontSize} weight="extraBold">
            {nativeBalance.replace(nativeCurrencyInfo.currency, '')}
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
          {strings.transfer[`${transferrable}`]}
        </Text>
      </Container>
      <Container {...cardType[variant].iconSize}>
        <Image source={logo} style={styles.logo} />
      </Container>
    </Container>
  </Container>
);

export default memo(PrepaidCardInnerBottom);
