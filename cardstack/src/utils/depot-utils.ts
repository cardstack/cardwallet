import { AssetTypes, DepotAsset, DepotType, TokenType } from '@cardstack/types';

export const reshapeSingleDepotTokenToAsset = ({
  tokenAddress,
  token,
  ...rest
}: TokenType) => ({
  ...rest,
  address: tokenAddress,
  uniqueId: tokenAddress,
  type: AssetTypes.token,
  ...token,
});

export const reshapeDepotTokensToAssets = (depot: DepotType) =>
  depot.tokens.reduce((tokens: DepotAsset[], token: TokenType) => {
    tokens.push(reshapeSingleDepotTokenToAsset(token));

    return tokens;
  }, []);

export const isBridgedCardToken = (tokenSymbol: string) =>
  tokenSymbol === 'CARD.CPXD';
