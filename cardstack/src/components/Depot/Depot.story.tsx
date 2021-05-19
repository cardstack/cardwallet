import { storiesOf } from '@storybook/react-native';
import React from 'react';
import { Alert } from 'react-native';
import { Depot } from './Depot';

storiesOf('Inventory Card', module).add('Default', () => {
  const data = [
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

  return (
    <Depot
      address="0x00000000"
      onPress={() => Alert.alert('pressed')}
      tokens={data}
    />
  );
});
