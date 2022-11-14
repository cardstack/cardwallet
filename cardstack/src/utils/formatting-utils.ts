import { formatCurrencyAmount, fromWei } from '@cardstack/cardpay-sdk';
import { KebabToCamelCaseKeys } from 'globals';
import GraphemeSplitter from 'grapheme-splitter';
import _ from 'lodash';

export const numberWithCommas = (number: string) =>
  number.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const getAddressPreview = (address: string): string => {
  if (!address) {
    return '';
  }

  const addressStart = address.slice(0, 6);
  const addressEnd = address.slice(-4);

  return `${addressStart}...${addressEnd}`;
};

// Removes dash and everything after it
export const normalizeTxHash = (hash: string) => hash.replace(/-.*/g, '');

export const splitAddress = (address: string) => {
  const half = address.length / 2;
  const addressFirstHalf = address.slice(0, half);

  const addressSecondHalf = address.slice(-half);

  const twoLinesAddress = `${addressFirstHalf}\n${addressSecondHalf}`;

  return { addressFirstHalf, addressSecondHalf, twoLinesAddress };
};

export const getSymbolCharacterFromAddress = (string?: string) => {
  if (!string) return '';

  const characters = new GraphemeSplitter().splitGraphemes(
    string.toUpperCase()
  );

  return characters.length > 2 &&
    (string.startsWith('0x') || string.startsWith('0X'))
    ? characters[2]
    : characters[0];
};

export const getValidColorHexString = (color?: string) => {
  if (!color) return '#000000';
  let convertedColorString = color.toUpperCase().replace(/[^#0-9A-F]/gi, '');
  const checkValidColorHexReg = /^#([0-9A-F]{3}){1,2}$/i;

  // check if valid hex color
  if (checkValidColorHexReg.test(convertedColorString)) {
    return convertedColorString;
  }

  if (!convertedColorString.startsWith('#')) {
    convertedColorString = `#${convertedColorString}`;
  }

  if (convertedColorString.length < 4) {
    return `${convertedColorString}${Array(4 - convertedColorString.length)
      .fill(0)
      .join('')}`;
  }

  if (convertedColorString.length < 7) {
    return `${convertedColorString}${Array(7 - convertedColorString.length)
      .fill(0)
      .join('')}`;
  }

  return convertedColorString.substring(0, 7);
};

export const fromWeiToFixedEth = (amountInWei: string) =>
  formatCurrencyAmount(fromWei(amountInWei), 2);

export const transformObjKeysToCamelCase = <ObjType>(obj: ObjType) =>
  Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [_.camelCase(key), value])
  ) as KebabToCamelCaseKeys<ObjType>;

export const addLeftZero = (value: string | number | undefined) =>
  value ? ('0' + value).slice(-2) : '00';

export const shortNetworkName = (value: string) => value.split(' ')[0];
