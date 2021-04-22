import React from 'react';

import { CoinIcon } from '../coin-icon';
import { RowWithMargins } from '../layout';
import { Text } from '@cardstack/components';
import { magicMemo } from '@rainbow-me/utils';

const TokenInfoBalanceValue = ({ align, asset, ...props }) => {
  const { address, balance, symbol, value } = asset;

  return (
    <RowWithMargins
      {...props}
      align="center"
      direction={align === 'left' ? 'row' : 'row-reverse'}
      margin={5}
      marginKey={align === 'left' ? 'marginRight' : 'marginLeft'}
    >
      <CoinIcon address={address} size={20} symbol={symbol} />
      <Text fontSize={20} fontWeight="700">
        {balance?.display || value}
      </Text>
    </RowWithMargins>
  );
};

export default magicMemo(TokenInfoBalanceValue, 'asset');
