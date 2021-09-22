import React from 'react';
import { Image, StyleSheet } from 'react-native';

import { ResponsiveValue } from '@shopify/restyle';
import logo from '../../../assets/cardstackLogoTransparent.png';
import { PrepaidCardProps } from '../PrepaidCard';

import { convertSpendForBalanceDisplay } from '@cardstack/utils';
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
  textVariant: ResponsiveValue<
    keyof Omit<Theme['textVariants'], 'defaults'>,
    Theme
  >;
}

export type PrepaidCardInnerBottomProps = Pick<
  PrepaidCardProps,
  | 'spendFaceValue'
  | 'reloadable'
  | 'nativeCurrency'
  | 'currencyConversionRates'
  | 'transferrable'
> & { variant?: CardVariants };

const cardType: Record<CardVariants, VariantType> = {
  normal: {
    iconSize: {
      width: 42,
      height: 46,
      marginTop: 0,
    },
    paddingTop: 4,
    balanceFontSize: 13,
    tokenFontSize: 40,
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
    textVariant: 'xsGrey',
  },
};

const styles = StyleSheet.create({
  logo: { height: '100%', resizeMode: 'contain', width: '100%' },
});

const PrepaidCardInnerBottom = ({
  spendFaceValue,
  reloadable,
  nativeCurrency,
  currencyConversionRates,
  transferrable,
  variant = 'normal',
}: PrepaidCardInnerBottomProps) => {
  const {
    tokenBalanceDisplay,
    nativeBalanceDisplay,
  } = convertSpendForBalanceDisplay(
    spendFaceValue.toString(),
    nativeCurrency,
    currencyConversionRates
  );

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
          <Text fontSize={cardType[variant].tokenFontSize} fontWeight="700">
            {tokenBalanceDisplay}
          </Text>
        </Container>
        <Container {...cardType[variant].iconSize}>
          <Image source={logo} style={styles.logo} />
        </Container>
      </Container>
      <Container
        flexDirection="row"
        alignItems="flex-end"
        justifyContent="space-between"
        marginTop={2}
      >
        <Text fontWeight="700">{nativeBalanceDisplay}</Text>
        <Container alignItems="flex-end">
          <Text variant={cardType[variant].textVariant}>
            {reloadable ? 'RELOADABLE' : 'NON-RELOADABLE'}
          </Text>
          <Text variant={cardType[variant].textVariant}>
            {transferrable ? 'TRANSFERRABLE' : 'NON-TRANSFERRABLE'}
          </Text>
        </Container>
      </Container>
    </Container>
  );
};

export default PrepaidCardInnerBottom;
