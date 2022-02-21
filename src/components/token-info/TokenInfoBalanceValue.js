import React from 'react';
import { RowWithMargins } from '../layout';
import { CoinIcon, Text } from '@cardstack/components';

import { magicMemo } from '@rainbow-me/utils';

const TokenInfoBalanceValue = ({ align, asset, ...props }) => {
  const { balance, value } = asset;

  return (
    <RowWithMargins
      {...props}
      align="center"
      direction={align === 'left' ? 'row' : 'row-reverse'}
      margin={5}
      marginKey={align === 'left' ? 'marginRight' : 'marginLeft'}
    >
      <CoinIcon {...asset} size={20} />
      <Text fontSize={20} weight="extraBold">
        {balance?.display || value}
      </Text>
    </RowWithMargins>
  );
};

export default magicMemo(TokenInfoBalanceValue, 'asset');
