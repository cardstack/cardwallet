import React, { Fragment } from 'react';
import ReactCoinIcon from 'react-coin-icon';
import styled from 'styled-components';
import CoinIconFallback from './CoinIconFallback';
import CoinIconIndicator from './CoinIconIndicator';
import { useColorForAsset } from '@rainbow-me/hooks';
import { magicMemo } from '@rainbow-me/utils';

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
  const color = useColorForAsset({ address });

  return (
    <Fragment>
      {(isPinned || isHidden) && <CoinIconIndicator isPinned={isPinned} />}
      <StyledCoinIcon
        {...props}
        address={address}
        color={color}
        fallbackRenderer={CoinIconFallback}
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
