import { boolean } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react-native';
import React from 'react';

import { BalanceCoinRow, Container } from '@cardstack/components';
import { AssetTypes } from '@cardstack/types';

const exampleCoinItem = {
  address: 'eth',
  balance: { amount: '100', display: '100.00 ETH' },
  coingecko_id: 'dai',
  decimals: 18,
  icon_url:
    'https://raw.githubusercontent.com/1Hive/default-token-list/master/src/assets/xdai/0xe91d153e0b41518a2ce8dd3d7944fa863463a97d/logo.png',
  isCoin: true,
  isHidden: false,
  isPinned: true,
  isRainbowCurated: true,
  isSmall: false,
  isVerified: true,
  name: 'Ethereum',
  native: {
    balance: { amount: '99.7955', display: '$99.80' },
    change: '5.517%',
    price: { amount: 0.997955, display: '$0.998' },
  },
  price: {
    changed_at: 1614805795,
    relative_change_24h: 5.5172559866460995,
    value: 0.997955,
  },
  formattedSymbol: 'eth',
  symbol: 'ETH',
  type: AssetTypes.token,
  uniqueId: 'eth',
};

const exampleCoinItem2 = {
  address: 'dai',
  balance: { amount: '50', display: '50.27 DAI' },
  coingecko_id: 'dai',
  decimals: 18,
  icon_url:
    'https://raw.githubusercontent.com/1Hive/default-token-list/master/src/assets/xdai/0xe91d153e0b41518a2ce8dd3d7944fa863463a97d/logo.png',
  isCoin: true,
  isHidden: false,
  isPinned: false,
  isRainbowCurated: true,
  isSmall: false,
  isVerified: true,
  name: 'Dai',
  native: {
    balance: { amount: '10.45', display: '$10.45' },
    change: '-0.423%',
    price: { amount: 1.01231, display: '$1.01' },
  },
  price: {
    changed_at: 1614805795,
    relative_change_24h: -0.4232559866460995,
    value: 1.01231,
  },
  formattedSymbol: 'dai',
  symbol: 'DAI',
  type: AssetTypes.token,
  uniqueId: 'dai',
};

storiesOf('Balance Coin Row', module).add('Default', () => {
  const isEditing = boolean('Editing', false);
  const onPress = () => console.log('Pin pressed!');
  const selected = boolean('Selected', false);

  return (
    <Container width="100%" alignItems="center">
      <BalanceCoinRow
        selected={selected}
        isEditing={isEditing}
        onPress={onPress}
        item={{
          ...exampleCoinItem,
        }}
      />
      <BalanceCoinRow
        selected={selected}
        isEditing={isEditing}
        onPress={onPress}
        item={{
          ...exampleCoinItem2,
        }}
      />
    </Container>
  );
});
