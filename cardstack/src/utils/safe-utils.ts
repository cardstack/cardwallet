import { AssetWithTokensType } from '@cardstack/types';

export const getSafeTokenByAddress = (
  asset: AssetWithTokensType,
  address?: string
) =>
  address && asset
    ? asset.tokens.find(
        t => t.tokenAddress?.toLowerCase() === address?.toLowerCase()
      )
    : undefined;
