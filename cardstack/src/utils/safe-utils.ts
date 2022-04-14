import { TokenType } from '@cardstack/types';

export const getSafeTokenByAddress = (tokens: TokenType[], address?: string) =>
  address
    ? tokens?.find(
        t => t.tokenAddress?.toLowerCase() === address?.toLowerCase()
      )
    : undefined;
