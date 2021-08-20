import { DepotAsset, DepotType, TokenType } from '@cardstack/types';

export const getDepotTokenByAddress = (depot: DepotType, address?: string) =>
  address && depot
    ? depot.tokens.find(
        t => t.tokenAddress?.toLowerCase() === address?.toLowerCase()
      )
    : undefined;

export const reshapeSingleDepotTokenToAsset = ({
  tokenAddress,
  token,
  ...rest
}: TokenType) => ({
  ...rest,
  address: tokenAddress,
  uniqueId: tokenAddress,
  type: 'token',
  ...token,
});

export const reshapeDepotTokensToAssets = (depot: DepotType) =>
  depot.tokens.reduce((tokens: DepotAsset[], token: TokenType) => {
    tokens.push(reshapeSingleDepotTokenToAsset(token));

    return tokens;
  }, []);
