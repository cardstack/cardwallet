import { isNil } from 'lodash';
import React, { Fragment, memo } from 'react';
import styled from 'styled-components';

import { CoinIcon as ReactCoinIcon } from '@cardstack/components';

import { getTokenMetadata, isETH } from '@rainbow-me/utils';

import CoinIconFallback from './CoinIconFallback';

export const CoinIconSize = 40;

const StyledCoinIcon = styled(ReactCoinIcon)`
  opacity: ${({ isHidden }) => (isHidden ? 0.4 : 1)};
`;

const CoinIcon = ({
  address = 'eth',
  size = CoinIconSize,
  symbol = '',
  ...props
}) => {
  const tokenMetadata = getTokenMetadata(address);

  const forceFallback = !symbol && !isETH(address) && isNil(tokenMetadata);
  return (
    <Fragment>
      <StyledCoinIcon
        {...props}
        address={address}
        fallbackRenderer={CoinIconFallback}
        forceFallback={forceFallback}
        shadowColor="transparent"
        size={size}
        symbol={symbol}
      />
    </Fragment>
  );
};

export default memo(CoinIcon);
