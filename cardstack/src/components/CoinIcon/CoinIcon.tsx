import React from 'react';
import ReactCoinIcon from 'react-coin-icon';
import { CoinIconFallback } from './CoinIconFallback';

interface CoinIconProps {
  address?: string;
  symbol?: string | null;
  size?: number;
  shadowColor?: string;
}

export const CoinIcon = ({
  address,
  symbol,
  size = 40,
  shadowColor = 'transparent', // 'transparent' is to remove drop shadow on Token icons
}: CoinIconProps) => (
  <ReactCoinIcon
    address={address}
    symbol={symbol}
    size={size}
    fallbackRenderer={CoinIconFallback}
    shadowColor={shadowColor}
  />
);
