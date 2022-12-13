import { getTokenMetadata } from '@rainbow-me/utils';

// eslint-disable-next-line no-useless-escape
const sanitize = (s: string) => s.replace(/[^a-z0-9áéíóúñü \.,_@:-]/gim, '');

type Metadata = ReturnType<typeof getTokenMetadata>;

export const parseAssetName = (metadata: Metadata, name: string) => {
  if (metadata?.name) return metadata?.name;
  return name ? sanitize(name) : 'Unknown Token';
};

export const parseAssetSymbol = (metadata: Metadata, symbol: string) => {
  if (metadata?.symbol) return metadata?.symbol;
  return symbol ? sanitize(symbol).toUpperCase() : '———';
};
