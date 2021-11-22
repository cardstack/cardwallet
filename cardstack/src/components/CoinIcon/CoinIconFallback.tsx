import React, { useState } from 'react';
import { FallbackIcon } from 'react-coin-icon';
import { CenteredContainer, Image } from '@cardstack/components';
import { toChecksumAddress } from '@rainbow-me/handlers/web3';

interface CoinIconFallbackProps {
  address?: string;
  symbol: string;
  height: number;
  width: number;
}

const getIconForCoin = (address?: string) => {
  if (!address) {
    return null;
  }

  const checksummedAddress = toChecksumAddress(address);
  return {
    uri: `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${checksummedAddress}/logo.png`,
  };
};

export const CoinIconFallback = (props: CoinIconFallbackProps) => {
  const { address, symbol, height, width } = props;
  const [showImage, setShowImage] = useState(false);
  const imageSource = getIconForCoin(address);

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
      {imageSource ? (
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
          borderRadius={width || 40}
          height={height}
          width={width}
          resizeMode="contain"
        />
      ) : null}
    </CenteredContainer>
  );
};
