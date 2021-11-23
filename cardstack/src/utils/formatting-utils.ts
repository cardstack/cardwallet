import GraphemeSplitter from 'grapheme-splitter';

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

  return characters.length > 2 && string.startsWith('0x')
    ? characters[2]
    : characters[0];
};
