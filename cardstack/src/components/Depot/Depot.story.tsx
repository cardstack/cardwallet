import { storiesOf } from '@storybook/react-native';
import React from 'react';
import { Alert } from 'react-native';
import { Depot } from './Depot';

storiesOf('Inventory Card', module).add('Default', () => {
  const data = [
    {
      title: 'Prepaid Cards',
      length: 5,
      totalValueText: 'Total Face Value',
      totalValue: '1000',
    },
    {
      title: 'Balances',
      length: 3,
      totalValueText: 'Total Value',
      totalValue: '1000',
    },
    {
      title: 'Collectables',
      length: 2,
    },
  ];

  return (
    <Depot
      title="Inventory 1"
      onPress={() => Alert.alert('pressed')}
      items={data}
    />
  );
});
