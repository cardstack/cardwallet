import { storiesOf } from '@storybook/react-native';
import React from 'react';
import { text, number } from '@storybook/addon-knobs';

import { PrepaidCard } from './PrepaidCard';
import { SmallPrepaidCard } from './SmallPrepaidCard';

const exampleTransaction1 = {
  from: '0xAa262652e7459693fdA194b33d288b487908E520',
  nonce: 0,
  to: '0xf7FBF7200F2D98979858127baF22FB85c94f3592',
  balance: {
    amount: '5',
    display: '5.00 ETH',
  },
  description: 'Ethereum',
  gasLimit: '21000',
  gasPrice: '142029000000',
  hash: '0x57d91b5b7e5259c009e21f8d8e2ea06e7ea437ff4a2e5391fdc47de573cef3fd-0',
  minedAt: 1615326853,
  name: 'Ethereum',
  native: {
    amount: '5',
    display: '$5.00',
  },
  pending: false,
  status: 'sent',
  symbol: 'ETH',
  title: 'Sent',
};

const exampleTransaction2 = {
  from: '0xAa262652e7459693fdA194b33d288b487908E520',
  nonce: 0,
  to: '0xf7FBF7200F2D98979858127baF22FB85c94f3592',
  balance: {
    amount: '5',
    display: '5.00 ETH',
  },
  description: 'xDai',
  gasLimit: '21000',
  gasPrice: '142029000000',
  hash: '0x57d91b5b7e5259c009e21f8d8e2ea06e7ea437ff4a2e5391fdc47de573cef3fd-0',
  minedAt: 1615326853,
  name: 'Ethereum',
  native: {
    amount: '5',
    display: '$5.00',
  },
  pending: false,
  status: 'sent',
  symbol: 'DAI',
  title: 'Sent',
};

storiesOf('Prepaid Card', module)
  .add('Default', () => {
    const recentActivityData = [exampleTransaction1, exampleTransaction2];

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
  })
  .add('Small', () => {
    return (
      <SmallPrepaidCard
        id={text('Identifier', '0xbeA3123457eF8')}
        spendableBalance={number('Spendable Balance (xDai)', 2500)}
      />
    );
  });
