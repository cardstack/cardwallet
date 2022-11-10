/* THIS WILL BE MOVED TO THE SDK */

import {
  convertAmountToNativeDisplay,
  getConstantByNetwork,
  NativeCurrency,
  convertStringToNumber,
} from '@cardstack/cardpay-sdk';
import { getResolver } from '@cardstack/did-resolver';
import { Resolver } from 'did-resolver';

import { getSpendValueInNativeCurrency } from '@cardstack/services';
import {
  PrepaidCardCustomization,
  PrepaidLinearGradientInfo,
} from '@cardstack/types';

import { Network } from '@rainbow-me/helpers/networkTypes';
export const NATIVE_TOKEN_SYMBOLS = ['eth', 'spoa', 'xdai', 'keth'];

const MAINNETS = [Network.mainnet, Network.gnosis];

const LAYER_1_NETWORKS = [Network.mainnet, Network.kovan];

const LAYER_2_NETWORKS = [Network.gnosis, Network.sokol];

const CPXD_TOKEN_SUFFIX = '.CPXD';

export const isNativeToken = (symbol: string, network: string) => {
  const nativeTokenSymbol = getConstantByNetwork('nativeTokenSymbol', network);

  return symbol === nativeTokenSymbol;
};

export const isCPXDToken = (symbol: string) =>
  symbol.includes(CPXD_TOKEN_SUFFIX);

export const removeCPXDTokenSuffix = (symbol: string) =>
  symbol.replace(CPXD_TOKEN_SUFFIX, '');

export const isLayer1 = (network: Network) =>
  LAYER_1_NETWORKS.includes(network);

export const isLayer2 = (network: Network) =>
  LAYER_2_NETWORKS.includes(network);

export const isMainnet = (network: Network) => MAINNETS.includes(network);

export const convertSpendForBalanceDisplay = async (
  spendValue: string | number,
  nativeCurrency: NativeCurrency
) => {
  const nativeBalance = await getSpendValueInNativeCurrency(
    convertStringToNumber(spendValue),
    nativeCurrency
  );

  const nativeBalanceDisplay = convertAmountToNativeDisplay(
    nativeBalance,
    nativeCurrency
  );

  return {
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
