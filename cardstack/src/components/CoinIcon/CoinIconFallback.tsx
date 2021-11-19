import React, { useState } from 'react';
import { FallbackIcon } from 'react-coin-icon';
import CUSTOM_COIN_ICONS from './CustomCoinIcons';
import { CenteredContainer, Image } from '@cardstack/components';
import { toChecksumAddress } from '@rainbow-me/handlers/web3';

interface CoinIconFallbackProps {
  address?: string;
  symbol: string;
  height: number;
  width: number;
}

const getIconForCoin = (symbol?: string, address?: string) => {
  const customCoinIcon = CUSTOM_COIN_ICONS.find(
    ({ symbol: coinSymbol }) => symbol && coinSymbol === symbol.toUpperCase()
  );

  if (customCoinIcon) {
    return customCoinIcon.icon;
  }

  if (!address) {
    return '';
  }

  const checksummedAddress = toChecksumAddress(address);
  return {
    uri: `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${checksummedAddress}/logo.png`,
  };
};

export const CoinIconFallback = (props: CoinIconFallbackProps) => {
  const { address, symbol, height, width } = props;
  const [showImage, setShowImage] = useState(false);
  const imageSource = getIconForCoin(symbol, address);

  return (
    <CenteredContainer height={height} width={width}>
      {!showImage && (
        <FallbackIcon
          {...props}
          fallbackIconColor="white"
          showImage={showImage}
          symbol={symbol}
          textStyles={{
            marginBottom: 0.5,
            textAlign: 'center',
          }}
        />
      )}
      <Image
        backgroundColor={showImage ? 'white' : 'transparent'}
        bottom={0}
        source={imageSource}
        left={0}
        position="absolute"
        right={0}
        top={0}
        onError={() => setShowImage(false)}
        onLoad={() => setShowImage(true)}
        borderRadius={100}
        height={height}
        width={width}
      />
    </CenteredContainer>
  );
};
