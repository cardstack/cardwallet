import { isNil } from 'lodash';
import React, { Fragment } from 'react';
import styled from 'styled-components';
import CoinIconFallback from './CoinIconFallback';
import CoinIconIndicator from './CoinIconIndicator';
import { CoinIcon as ReactCoinIcon } from '@cardstack/components';
import { useColorForAsset } from '@rainbow-me/hooks';
import { getTokenMetadata, isETH, magicMemo } from '@rainbow-me/utils';

export const CoinIconSize = 40;

const StyledCoinIcon = styled(ReactCoinIcon)`
  opacity: ${({ isHidden }) => (isHidden ? 0.4 : 1)};
`;

const CoinIcon = ({
  address = 'eth',
  isHidden,
  isPinned,
  size = CoinIconSize,
  symbol = '',
  ...props
}) => {
  const tokenMetadata = getTokenMetadata(address);
  const color = useColorForAsset({ address });

  const forceFallback = !symbol && !isETH(address) && isNil(tokenMetadata);
  return (
    <Fragment>
      {(isPinned || isHidden) && <CoinIconIndicator isPinned={isPinned} />}
      <StyledCoinIcon
        {...props}
        address={address}
        color={color}
        fallbackRenderer={CoinIconFallback}
        forceFallback={forceFallback}
        shadowColor="transparent"
        size={size}
        symbol={symbol}
      />
    </Fragment>
  );
};

export default magicMemo(CoinIcon, [
  'address',
  'isHidden',
  'isPinned',
  'size',
  'symbol',
  // 'shadowColor',
]);
