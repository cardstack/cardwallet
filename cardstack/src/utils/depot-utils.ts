import { DepotAsset, DepotType, TokenType } from '@cardstack/types';

export const getDepotTokenByAddress = (depot: DepotType, address?: string) =>
  address
    ? depot.tokens.find(
        t => t.tokenAddress?.toLowerCase() === address?.toLowerCase()
      )
    : undefined;

export const reshapeSingleDepotTokenToAsset = ({
  tokenAddress,
  token: { decimals, name, symbol },
  ...rest
}: TokenType) => ({
  ...rest,
  address: tokenAddress,
  uniqueId: tokenAddress,
  type: 'token',
  symbol,
  name,
  decimals,
});

export const reshapeDepotTokensToAssets = (depot: DepotType) =>
  depot.tokens.reduce((tokens: DepotAsset[], token: TokenType) => {
    tokens.push(reshapeSingleDepotTokenToAsset(token));

    return tokens;
  }, []);
