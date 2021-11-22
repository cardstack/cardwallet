import React from 'react';
import ReactCoinIcon from 'react-coin-icon';
import CUSTOM_COIN_ICONS from './CustomCoinIcons';
import { CoinIconFallback } from './CoinIconFallback';
import { CenteredContainer, Image } from '@cardstack/components';

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
}: CoinIconProps) => {
  const customCoinIcon = CUSTOM_COIN_ICONS.find(
    ({ symbol: coinSymbol }) => symbol && coinSymbol === symbol.toUpperCase()
  );

  if (customCoinIcon) {
    return (
      <CenteredContainer height={size} width={size}>
        <Image
          bottom={0}
          source={customCoinIcon.icon}
          left={0}
          position="absolute"
          right={0}
          top={0}
          borderRadius={size}
          height={size}
          width={size}
          resizeMode="contain"
        />
      </CenteredContainer>
    );
  }

  return (
    <ReactCoinIcon
      address={address}
      symbol={symbol}
      size={size}
      fallbackRenderer={CoinIconFallback}
      shadowColor={shadowColor}
    />
  );
};
