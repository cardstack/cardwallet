import { storiesOf } from '@storybook/react-native';
import React from 'react';
import { text, number } from '@storybook/addon-knobs';

import { PrepaidCard } from './PrepaidCard';

storiesOf('Prepaid Card', module).add('Default', () => (
  <PrepaidCard
    id={text('Identifier', '0xbeA3123457eF8')}
    issuer={text('Issuer', 'Cardstack')}
    spendableBalance={number('Spendable Balance (xDai)', 2500)}
  />
));
