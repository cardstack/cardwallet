import React from 'react';
import ReactCoinIcon from 'react-coin-icon';
import { CoinIconFallback } from './CoinIconFallback';
import { isNativeToken } from '@cardstack/utils';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';

interface CoinIconProps {
  address?: string;
  symbol?: string;
  size?: number;
}

export const CoinIcon = ({ address, symbol, size = 40 }: CoinIconProps) => {
  const network = useRainbowSelector(state => state.settings.network);
  const forceFallback = !symbol && !isNativeToken(symbol, network);

  return (
    <ReactCoinIcon
      address={address}
      symbol={symbol}
      size={size}
      forceFallback={forceFallback}
      fallbackRenderer={CoinIconFallback}
    />
  );
};
