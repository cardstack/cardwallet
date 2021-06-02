import { storiesOf } from '@storybook/react-native';
import React from 'react';

import { Depot } from './Depot';

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

  return <Depot address="0x00000000" tokens={data} />;
});
