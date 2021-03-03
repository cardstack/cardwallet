import { storiesOf } from '@storybook/react-native';
import React from 'react';
import { text, number } from '@storybook/addon-knobs';

import { TransactionType } from '../TransactionCoinRow';
import { PrepaidCard } from './PrepaidCard';

storiesOf('Prepaid Card', module).add('Default', () => {
  const recentActivityData = Object.values(TransactionType).map(type => ({
    type,
    transactionAmount: 6000,
    recipient: 'BGY Solutions',
  }));

  const recentActivity = [
    {
      title: 'Yesterday',
      data: recentActivityData,
    },
    {
      title: 'This Month',
      data: recentActivityData,
    },
    {
      title: 'February 2021',
      data: recentActivityData,
    },
  ];

  return (
    <PrepaidCard
      id={text('Identifier', '0xbeA3123457eF8')}
      issuer={text('Issuer', 'Cardstack')}
      spendableBalance={number('Spendable Balance (xDai)', 2500)}
      recentActivity={recentActivity}
    />
  );
});
