/* THIS WILL BE MOVED TO THE SDK */

import {
  convertAmountToNativeDisplay,
  getConstantByNetwork,
} from '@cardstack/cardpay-sdk';
import { getResolver } from '@cardstack/did-resolver';
import { Resolver } from 'did-resolver';
import {
  PrepaidCardCustomization,
  PrepaidLinearGradientInfo,
} from '@cardstack/types';
export const NATIVE_TOKEN_SYMBOLS = ['eth', 'spoa', 'dai', 'keth'];
const MAINNETS = ['mainnet', 'xdai'];
const LAYER_1_NETWORKS = ['mainnet', 'kovan'];

export const isNativeToken = (symbol: string, network: string) => {
  const nativeTokenSymbol = getConstantByNetwork('nativeTokenSymbol', network);

  return symbol === nativeTokenSymbol;
};

export const isLayer1 = (network: string) => LAYER_1_NETWORKS.includes(network);

export const isMainnet = (network: string) => MAINNETS.includes(network);

export const getNativeBalanceFromSpend = (
  spendAmount: number,
  nativeCurrency: string,
  currencyConversionRates: { [key: string]: number }
): number => {
  const usdBalance = spendAmount / 100;

  const currencyConversionRate = currencyConversionRates?.[nativeCurrency];

  if (nativeCurrency === 'USD') {
    return usdBalance;
  } else if (currencyConversionRate) {
    return usdBalance * currencyConversionRate;
  }

  return 0;
};

export const convertSpendForBalanceDisplay = (
  accumulatedSpendValue: string | number,
  nativeCurrency: string,
  currencyConversionRates: {
    [key: string]: number;
  },
  includeSuffix?: boolean
) => {
  const nativeBalance = getNativeBalanceFromSpend(
    Number(accumulatedSpendValue),
    nativeCurrency,
    currencyConversionRates
  );

  const spendWithCommas = String(accumulatedSpendValue).replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ','
  );

  const nativeBalanceDisplay = convertAmountToNativeDisplay(
    nativeBalance,
    nativeCurrency
  );

  return {
    tokenBalanceDisplay: `§${spendWithCommas}${includeSuffix ? ' SPEND' : ''}`,
    nativeBalanceDisplay,
  };
};

export const fetchCardCustomizationFromDID = async (
  customizationDID?: string
): Promise<PrepaidCardCustomization> => {
  if (!customizationDID) {
    throw new Error('customizationDID must be present!');
  }

  const didResolver = new Resolver(getResolver());
  const did = await didResolver.resolve(customizationDID);

  const alsoKnownAs = did?.didDocument?.alsoKnownAs?.[0];

  if (!alsoKnownAs) {
    throw new Error('alsoKnownAs is not defined');
  }

  const jsonApiDocument = await (await fetch(alsoKnownAs)).json();
  const included = jsonApiDocument.included || [];

  let colorScheme = included.find(
    (node: any) => node.type === 'prepaid-card-color-schemes'
  );

  let pattern = included.find(
    (node: any) => node.type === 'prepaid-card-patterns'
  );

  colorScheme = colorScheme ? colorScheme.attributes : {};
  pattern = pattern ? pattern.attributes : {};

  return {
    issuerName: jsonApiDocument.data.attributes['issuer-name'],
    background: colorScheme.background,
    patternColor: colorScheme['pattern-color'],
    textColor: colorScheme['text-color'],
    patternUrl: pattern['pattern-url'],
  };
};

export const parseLinearGradient = (
  cardCustomization?: PrepaidCardCustomization
): PrepaidLinearGradientInfo => {
  const hasLinearGradient = !!cardCustomization?.background.startsWith(
    'linear-gradient'
  );

  if (!cardCustomization || !hasLinearGradient) {
    return { hasLinearGradient: false };
  }

  const backgroundValues = (/linear-gradient\(([^"]+)\)/.exec(
    cardCustomization?.background || ''
  ) || [])[1]
    .split(',')
    .map((value: string) => value.trim());

  const stop1 = backgroundValues[1]
    ? backgroundValues[1].split(' ')
    : ['#fff', 0];

  const stop2 = backgroundValues[2]
    ? backgroundValues[2].split(' ')
    : ['#fff', 0];

  const angle = Number(
    (180 - parseFloat(backgroundValues[0]?.replace('deg', '')) || 0).toFixed(2)
  );

  return {
    hasLinearGradient: true,
    angle,
    stop1: {
      stopColor: `${stop1[0] || '#fff'}`,
      offset: `${stop1[1] || '0%'}`,
    },
    stop2: {
      stopColor: `${stop2[0] || '#fff'}`,
      offset: `${stop2[1] || '0%'}`,
    },
  };
};
