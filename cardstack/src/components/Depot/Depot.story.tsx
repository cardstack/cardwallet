import { storiesOf } from '@storybook/react-native';
import React from 'react';

import { Depot } from './Depot';
import { getAddressPreview } from '@cardstack/utils';

storiesOf('Default', module).add('Default', () => {
  const data: any = [
    {
      balance: {
        amount: '1',
        display: '1.00',
      },
      token: {
        symbol: 'DAI',
        name: 'DAI.CPXD',
      },
    },
  ];

  const address = '0x00000000';
  return (
    <Depot
      address={address}
      addressPreview={getAddressPreview(address)}
      tokens={data}
      networkName="xDai Chain"
    />
  );
});
