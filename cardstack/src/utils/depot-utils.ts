import { DepotAsset, DepotType } from '@cardstack/types';

export const getDepotTokenByAddress = (depot: DepotType, address?: string) =>
  address
    ? depot.tokens.find(
        t => t.tokenAddress?.toLowerCase() === address?.toLowerCase()
      )
    : undefined;

export const reshapeDepotTokensToAssets = (depot: DepotType) =>
  depot.tokens.reduce(
    (
      tokens: DepotAsset[],
      { tokenAddress, token: { decimals, name, symbol }, ...rest }
    ) => {
      const asset = {
        ...rest,
        address: tokenAddress,
        uniqueId: tokenAddress,
        type: 'token',
        symbol,
        name,
        decimals,
      };

      tokens.push(asset);

      return tokens;
    },
    []
  );
