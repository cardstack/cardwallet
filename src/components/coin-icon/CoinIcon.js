import { isNil } from 'lodash';
import React, { Fragment } from 'react';
import ReactCoinIcon from 'react-coin-icon';
import styled from 'styled-components';

import CoinIconFallback from './CoinIconFallback';
import CoinIconIndicator from './CoinIconIndicator';
import { colors } from '@cardstack/theme';
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

  const forceFallback = !isETH(address) && isNil(tokenMetadata);

  return (
    <Fragment>
      {(isPinned || isHidden) && <CoinIconIndicator isPinned={isPinned} />}
      <StyledCoinIcon
        {...props}
        address={address}
        fallbackRenderer={CoinIconFallback}
        forceFallback={forceFallback}
        shadowColor={tokenMetadata?.shadowColor || colors.white}
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
  'shadowColor',
]);
